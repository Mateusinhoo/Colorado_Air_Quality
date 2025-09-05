// Regional Data Service - Uses AirNow API with lat/lon coordinates for regional coverage
// Implements proper rate limiting to avoid 429 errors
// Uses EPA AirNow API with user's API key: E97798F2-4817-46B4-9E10-21E25227F39C

import { COLORADO_REGIONS, ColoradoRegion } from '../data/coloradoRegions';

interface RegionalAirQualityData {
  regionId: string;
  regionName: string;
  displayName: string;
  aqi: number;
  pollutant: string;
  category: string;
  date: string;
  reportingArea: string;
  lat: number;
  lon: number;
}

interface RegionalTrendDataPoint {
  date: string;
  aqi: number;
  pollutant: string;
  category: string;
}

// User's AirNow API Key
const AIRNOW_API_KEY = process.env.REACT_APP_AIRNOW_API_KEY || 'E97798F2-4817-46B4-9E10-21E25227F39C';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 500; // 500ms between API calls
const MAX_CONCURRENT_REQUESTS = 3; // Maximum 3 concurrent requests
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache

// Data cache
let regionalDataCache: { [key: string]: RegionalAirQualityData } = {};
let lastCacheUpdate = 0;

class RegionalDataService {
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;

  // Rate-limited API request wrapper
  private async makeRateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          this.activeRequests++;
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      });
      
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.activeRequests < MAX_CONCURRENT_REQUESTS && this.requestQueue.length > 0) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        setTimeout(() => {
          nextRequest();
        }, RATE_LIMIT_DELAY);
      }
    }
  }

  // Get AQI category from numeric value
  private getAQICategory(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  // Fetch air quality data for a specific region
  async fetchRegionalAirQualityData(region: ColoradoRegion): Promise<RegionalAirQualityData> {
    return this.makeRateLimitedRequest(async () => {
      try {
        console.log(`🔍 Fetching AQI for ${region.displayName} (${region.lat}, ${region.lon})`);
        console.log(`🔑 Using API Key: ${AIRNOW_API_KEY.substring(0, 8)}...`);
        
        const apiUrl = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${region.lat}&longitude=${region.lon}&distance=${region.radius}&API_KEY=${AIRNOW_API_KEY}`;
        console.log(`🌐 API URL: ${apiUrl.replace(AIRNOW_API_KEY, 'API_KEY_HIDDEN')}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Colorado-Air-Quality-Dashboard/1.0'
          }
        });
        
        console.log(`📡 Response Status for ${region.name}: ${response.status} ${response.statusText}`);
        
        if (response.status === 429) {
          const errorText = await response.text();
          console.error(`❌ Rate limit exceeded for ${region.name}: ${errorText}`);
          throw new Error(`Rate limit exceeded: ${errorText}`);
        }
        
        if (!response.ok) {
          console.error(`❌ AirNow API error for ${region.name}: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error(`❌ Error response body: ${errorText}`);
          
          if (response.status === 401) {
            console.error('🚨 API KEY AUTHENTICATION FAILED - Check environment variable REACT_APP_AIRNOW_API_KEY');
          }
          
          throw new Error(`AirNow API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`📊 Raw API response for ${region.name}:`, data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Filter for valid observations with AQI values
          const validObservations = data.filter(obs => obs.AQI && obs.AQI > 0);
          console.log(`✅ Valid observations found for ${region.name}: ${validObservations.length}`);
          
          if (validObservations.length > 0) {
            // Sort by AQI descending to get the peak value (what AirNow.gov shows)
            validObservations.sort((a, b) => (b.AQI || 0) - (a.AQI || 0));
            const peakObservation = validObservations[0];
            
            const result: RegionalAirQualityData = {
              regionId: region.id,
              regionName: region.name,
              displayName: region.displayName,
              aqi: peakObservation.AQI || 0,
              pollutant: peakObservation.ParameterName || 'PM2.5',
              category: peakObservation.Category?.Name || this.getAQICategory(peakObservation.AQI || 0),
              date: peakObservation.DateObserved || new Date().toISOString().split('T')[0],
              reportingArea: peakObservation.ReportingArea || region.displayName,
              lat: region.lat,
              lon: region.lon
            };
            
            console.log(`🎯 Final result for ${region.name}:`, result);
            return result;
          } else {
            console.warn(`⚠️ No valid AQI observations in response for ${region.name}`);
          }
        } else {
          console.warn(`⚠️ Empty or invalid API response for ${region.name}:`, data);
        }
        
        console.warn(`🔄 Using fallback data for ${region.name}`);
        return this.getFallbackRegionalData(region);
      } catch (error) {
        console.error(`💥 Error fetching air quality data for ${region.name}:`, error);
        console.error(`🔄 Using fallback data for ${region.name}`);
        return this.getFallbackRegionalData(region);
      }
    });
  }

  // Fallback data when API is unavailable
  private getFallbackRegionalData(region: ColoradoRegion): RegionalAirQualityData {
    // Use realistic fallback values based on region characteristics
    let fallbackAQI = 45; // Default moderate value
    
    // Adjust fallback based on region characteristics
    if (region.id === 'denver-metro') fallbackAQI = 52;
    else if (region.id === 'colorado-springs') fallbackAQI = 48;
    else if (region.id === 'pueblo') fallbackAQI = 55;
    else if (region.id.includes('mountain')) fallbackAQI = 35; // Mountain areas typically cleaner
    
    console.log(`🔄 Returning fallback data for ${region.name} with AQI ${fallbackAQI}`);
    
    return {
      regionId: region.id,
      regionName: region.name,
      displayName: region.displayName,
      aqi: fallbackAQI,
      pollutant: 'PM2.5',
      category: this.getAQICategory(fallbackAQI) + ' (Fallback)',
      date: new Date().toISOString().split('T')[0],
      reportingArea: region.displayName,
      lat: region.lat,
      lon: region.lon
    };
  }

  // Get all regional air quality data
  async getAllRegionalData(): Promise<RegionalAirQualityData[]> {
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - lastCacheUpdate < CACHE_DURATION && Object.keys(regionalDataCache).length === COLORADO_REGIONS.length) {
      console.log('📦 Using cached regional data');
      return Object.values(regionalDataCache);
    }

    console.log('🔄 Fetching fresh regional data...');
    
    try {
      // Fetch data for all regions with rate limiting
      const promises = COLORADO_REGIONS.map(region => this.fetchRegionalAirQualityData(region));
      const results = await Promise.all(promises);
      
      // Update cache
      regionalDataCache = {};
      results.forEach(data => {
        regionalDataCache[data.regionId] = data;
      });
      
      lastCacheUpdate = now;
      console.log('✅ Regional data fetched and cached successfully');
      
      return results;
    } catch (error) {
      console.error('💥 Error fetching regional data:', error);
      
      // Return cached data if available, otherwise fallback data
      if (Object.keys(regionalDataCache).length > 0) {
        console.log('📦 Using cached data due to API error');
        return Object.values(regionalDataCache);
      } else {
        console.log('🔄 Using fallback data for all regions');
        return COLORADO_REGIONS.map(region => this.getFallbackRegionalData(region));
      }
    }
  }

  // Get data for a specific region
  async getRegionalData(regionId: string): Promise<RegionalAirQualityData | null> {
    const region = COLORADO_REGIONS.find(r => r.id === regionId);
    if (!region) {
      console.error(`❌ Region not found: ${regionId}`);
      return null;
    }

    // Check cache first
    if (regionalDataCache[regionId] && (Date.now() - lastCacheUpdate < CACHE_DURATION)) {
      console.log(`📦 Using cached data for ${region.name}`);
      return regionalDataCache[regionId];
    }

    // Fetch fresh data
    const data = await this.fetchRegionalAirQualityData(region);
    regionalDataCache[regionId] = data;
    
    return data;
  }

  // Get all available regions for dropdown
  getAvailableRegions(): Array<{id: string, name: string, displayName: string}> {
    return COLORADO_REGIONS.map(region => ({
      id: region.id,
      name: region.name,
      displayName: region.displayName
    }));
  }

  // Get most polluted regions
  async getMostPollutedRegions(): Promise<Array<{name: string, displayName: string, regionId: string, aqi: number, population: number}>> {
    const allData = await this.getAllRegionalData();
    
    return allData
      .map(data => {
        const region = COLORADO_REGIONS.find(r => r.id === data.regionId);
        return {
          name: data.displayName,
          displayName: data.displayName,
          regionId: data.regionId,
          aqi: data.aqi,
          population: region?.population || 0
        };
      })
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, 5); // Top 5 most polluted
  }

  // Get cleanest regions
  async getCleanestRegions(): Promise<Array<{name: string, displayName: string, regionId: string, aqi: number, population: number}>> {
    const allData = await this.getAllRegionalData();
    
    return allData
      .map(data => {
        const region = COLORADO_REGIONS.find(r => r.id === data.regionId);
        return {
          name: data.displayName,
          displayName: data.displayName,
          regionId: data.regionId,
          aqi: data.aqi,
          population: region?.population || 0
        };
      })
      .sort((a, b) => a.aqi - b.aqi)
      .slice(0, 5); // Top 5 cleanest
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    regionalDataCache = {};
    lastCacheUpdate = 0;
    console.log('🗑️ Regional data cache cleared');
  }
}

export default new RegionalDataService();
export type { RegionalAirQualityData, RegionalTrendDataPoint };

