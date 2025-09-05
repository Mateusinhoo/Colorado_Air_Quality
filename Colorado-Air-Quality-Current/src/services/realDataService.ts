// Real Data Service - Legacy support for zip code lookups
// Main functionality moved to regionalDataService.ts

interface AirQualityData {
  zip: string;
  city: string;
  aqi: number;
  pollutant: string;
  category: string;
  date: string;
}

interface HealthData {
  county: string;
  asthmaRate: number;
  emergencyVisits: number;
  population: number;
}

interface TrendDataPoint {
  month: string;
  pm25: number;
  emergencyVisits: number;
  hospitalizations: number;
  asthmaRate: number;
}

// User's AirNow API Key - use environment variable first, then fallback
const AIRNOW_API_KEY = process.env.REACT_APP_AIRNOW_API_KEY || 'E97798F2-4817-46B4-9E10-21E25227F39C';
const AIRNOW_BASE_URL = 'https://www.airnowapi.org/aq';

// Debug API key configuration
console.log('AirNow API Key configured:', AIRNOW_API_KEY ? 'YES' : 'NO');
console.log('Environment API Key:', process.env.REACT_APP_AIRNOW_API_KEY ? 'SET' : 'NOT SET');

// Data cache for preloading
let airQualityCache: { [key: string]: AirQualityData } = {};
let trendDataCache: { [key: string]: TrendDataPoint[] } = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

class RealDataService {
  // Legacy method - kept for backward compatibility
  // Use regionalDataService for new functionality
  getCityName(zip: string): string {
    // Basic fallback for legacy zip code lookups
    const cityMap: { [key: string]: string } = {
      '80134': 'Parker',
      '80202': 'Denver',
      '80301': 'Boulder',
      '80525': 'Fort Collins',
      '80918': 'Colorado Springs'
    };
    return cityMap[zip] || 'Unknown';
  }

  // Fetch real air quality data from AirNow API
  async fetchAirQualityData(zip: string): Promise<AirQualityData> {
    try {
      // Debug API configuration
      console.log(`🔍 Fetching AQI for ${zip} (${this.getCityName(zip)})`);
      console.log(`🔑 Using API Key: ${AIRNOW_API_KEY.substring(0, 8)}...`);
      
      // Use the correct AirNow API endpoint for current observations by zip code
      const apiUrl = `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zip}&distance=25&API_KEY=${AIRNOW_API_KEY}`;
      console.log(`🌐 API URL: ${apiUrl.replace(AIRNOW_API_KEY, 'API_KEY_HIDDEN')}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Colorado-Air-Quality-Dashboard/1.0'
        }
      });
      
      console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        console.error(`❌ AirNow API error for ${zip}: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`❌ Error response body: ${errorText}`);
        
        // If it's a 401 error, it's likely an API key issue
        if (response.status === 401) {
          console.error('🚨 API KEY AUTHENTICATION FAILED - Check environment variable REACT_APP_AIRNOW_API_KEY');
        }
        
        throw new Error(`AirNow API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📊 Raw API response for ${zip}:`, data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        // AirNow API returns observations for the reporting area
        // Find the observation with the highest AQI (peak value for the area)
        const validObservations = data.filter(obs => obs.AQI && obs.AQI > 0);
        console.log(`✅ Valid observations found: ${validObservations.length}`);
        
        if (validObservations.length > 0) {
          // Sort by AQI descending to get the peak value (what AirNow.gov shows)
          validObservations.sort((a, b) => (b.AQI || 0) - (a.AQI || 0));
          const peakObservation = validObservations[0];
          
          const result = {
            zip: zip,
            city: this.getCityName(zip),
            aqi: peakObservation.AQI || 0,
            pollutant: peakObservation.ParameterName || 'PM2.5',
            category: peakObservation.Category?.Name || 'Good',
            date: peakObservation.DateObserved || new Date().toISOString().split('T')[0]
          };
          console.log(`🎯 Final result for ${zip}:`, result);
          return result;
        } else {
          console.warn(`⚠️ No valid AQI observations in response for ${zip}`);
        }
      } else {
        console.warn(`⚠️ Empty or invalid API response for ${zip}:`, data);
      }
      
      console.warn(`🔄 Using fallback data for ${zip}`);
      return this.getFallbackData(zip);
    } catch (error) {
      console.error(`💥 Error fetching air quality data for ${zip}:`, error);
      console.error(`🔄 Using fallback data for ${zip}`);
      return this.getFallbackData(zip);
    }
  }

  // Fallback data when API is unavailable
  getFallbackData(zip: string): AirQualityData {
    // For debugging: Show realistic fallback values so we can distinguish between
    // API failures (fallback data) and successful API calls
    const fallbackAQI = 45; // Moderate value to indicate this is fallback data
    
    console.log(`🔄 Returning fallback data for ${zip} with AQI ${fallbackAQI}`);
    
    return {
      zip: zip,
      city: this.getCityName(zip),
      aqi: fallbackAQI, // Use consistent fallback value for debugging
      pollutant: 'PM2.5',
      category: 'Moderate (Fallback)',
      date: new Date().toISOString().split('T')[0]
    };
  }

  // This method now returns empty array - real data comes from dataCollectionService
  async getTrendData(zip: string, pollutant: string = 'PM2.5'): Promise<TrendDataPoint[]> {
    // Real trend data is now handled by the dataCollectionService
    // This method is kept for compatibility but returns empty data
    console.log(`getTrendData called for ${zip} - redirecting to real data collection system`);
    return [];
  }

  // Get county asthma data
  async getCountyAsthmaData(): Promise<HealthData[]> {
    return [
      { county: 'Denver', asthmaRate: 8.9, emergencyVisits: 1250, population: 715522 },
      { county: 'Jefferson', asthmaRate: 7.7, emergencyVisits: 890, population: 582910 },
      { county: 'Arapahoe', asthmaRate: 8.1, emergencyVisits: 1100, population: 655070 },
      { county: 'Adams', asthmaRate: 8.5, emergencyVisits: 980, population: 508347 },
      { county: 'Boulder', asthmaRate: 7.1, emergencyVisits: 420, population: 330758 },
      { county: 'Larimer', asthmaRate: 7.4, emergencyVisits: 380, population: 359066 },
      { county: 'Douglas', asthmaRate: 6.8, emergencyVisits: 290, population: 357978 },
      { county: 'El Paso', asthmaRate: 8.2, emergencyVisits: 1180, population: 730395 }
    ];
  }

}

export default new RealDataService();

