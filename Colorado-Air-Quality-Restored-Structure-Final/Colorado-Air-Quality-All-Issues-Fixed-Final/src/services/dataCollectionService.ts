import regionalDataService from './regionalDataService';
import { COLORADO_REGIONS, ColoradoRegion } from '../data/coloradoRegions';

// Interface for daily regional data
interface DailyRegionalData {
  date: string;
  regionId: string;
  regionName: string;
  aqi: number;
  pollutant: string;
  category: string;
  emergencyVisits: number;
  hospitalizations: number;
  asthmaRate: number;
}

// Interface for stored historical data
interface HistoricalRegionalData {
  [regionId: string]: DailyRegionalData[];
}

class DataCollectionService {
  private readonly STORAGE_KEY = 'colorado_regional_historical_data';
  private readonly MAX_DAYS = 30;
  private readonly COLLECTION_HOUR = 0; // 12:30 AM = 0:30
  private readonly COLLECTION_MINUTE = 30;

  // Collect daily data for all Colorado regions
  async collectDailyRegionalData(): Promise<void> {
    console.log('🕐 Starting daily regional data collection at 12:30 AM...');
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Get existing historical data
      const historicalData = this.getStoredHistoricalData();
      
      // Collect data for each region with rate limiting
      for (let i = 0; i < COLORADO_REGIONS.length; i++) {
        const region = COLORADO_REGIONS[i];
        
        try {
          console.log(`📍 Collecting data for ${region.displayName} (${i + 1}/${COLORADO_REGIONS.length})...`);
          
          // Get real air quality data for this region using regional data service
          const airQualityData = await regionalDataService.getRegionalData(region.id);
          
          if (!airQualityData) {
            console.warn(`⚠️ No data available for ${region.displayName}, skipping...`);
            continue;
          }
          
          // Create daily data point with health estimates
          const dailyData: DailyRegionalData = {
            date: today,
            regionId: region.id,
            regionName: region.name,
            aqi: airQualityData.aqi,
            pollutant: airQualityData.pollutant,
            category: airQualityData.category,
            // Health impact estimates based on AQI and population
            emergencyVisits: this.estimateEmergencyVisits(airQualityData.aqi, region.population),
            hospitalizations: this.estimateHospitalizations(airQualityData.aqi, region.population),
            asthmaRate: this.estimateAsthmaRate(region.population)
          };
          
          // Add to historical data
          if (!historicalData[region.id]) {
            historicalData[region.id] = [];
          }
          
          // Remove data for today if it already exists (update)
          historicalData[region.id] = historicalData[region.id].filter(
            data => data.date !== today
          );
          
          // Add new data point
          historicalData[region.id].push(dailyData);
          
          // Keep only last 30 days (rolling window)
          historicalData[region.id] = historicalData[region.id]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-this.MAX_DAYS);
          
          console.log(`✅ Data collected for ${region.displayName}: AQI ${airQualityData.aqi}`);
          
          // Rate limiting: wait 200ms between requests to avoid API limits
          if (i < COLORADO_REGIONS.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
        } catch (error) {
          console.error(`❌ Error collecting data for ${region.name}:`, error);
          // Continue with next region even if one fails
        }
      }
      
      // Save updated historical data
      this.saveHistoricalData(historicalData);
      console.log('🎉 Daily regional data collection completed successfully!');
      
    } catch (error) {
      console.error('💥 Error during daily data collection:', error);
    }
  }

  // Get historical data for a specific region
  getRegionalHistoricalData(regionId: string): DailyRegionalData[] {
    const historicalData = this.getStoredHistoricalData();
    return historicalData[regionId] || [];
  }

  // Get all historical data
  getAllHistoricalData(): HistoricalRegionalData {
    return this.getStoredHistoricalData();
  }

  // Get data collection status
  getCollectionStatus(): { totalDays: number; regionsWithData: number; lastCollectionDate: string | null } {
    const historicalData = this.getStoredHistoricalData();
    const regionIds = Object.keys(historicalData);
    
    if (regionIds.length === 0) {
      return { totalDays: 0, regionsWithData: 0, lastCollectionDate: null };
    }
    
    // Find the most recent date across all regions
    let lastDate: string | null = null;
    let totalDays = 0;
    
    regionIds.forEach(regionId => {
      const regionData = historicalData[regionId];
      if (regionData.length > 0) {
        totalDays = Math.max(totalDays, regionData.length);
        const regionLastDate = regionData[regionData.length - 1].date;
        if (!lastDate || regionLastDate > lastDate) {
          lastDate = regionLastDate;
        }
      }
    });
    
    return {
      totalDays,
      regionsWithData: regionIds.length,
      lastCollectionDate: lastDate
    };
  }

  // Initialize automatic daily collection
  initializeAutomaticCollection(): void {
    console.log('⏰ Initializing automatic daily regional data collection at 12:30 AM...');
    
    const scheduleNextCollection = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(this.COLLECTION_HOUR, this.COLLECTION_MINUTE, 0, 0);
      
      const msUntilCollection = tomorrow.getTime() - now.getTime();
      
      console.log(`⏰ Next regional data collection scheduled for: ${tomorrow.toLocaleString()}`);
      console.log(`⏰ Time until next collection: ${Math.round(msUntilCollection / 1000 / 60)} minutes`);
      
      setTimeout(async () => {
        await this.collectDailyRegionalData();
        scheduleNextCollection(); // Schedule the next collection
      }, msUntilCollection);
    };
    
    scheduleNextCollection();
  }

  // Private helper methods
  private getStoredHistoricalData(): HistoricalRegionalData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading historical regional data:', error);
      return {};
    }
  }

  private saveHistoricalData(data: HistoricalRegionalData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving historical regional data:', error);
    }
  }

  private estimateEmergencyVisits(aqi: number, population: number): number {
    // Estimate emergency visits based on AQI and population
    // Higher AQI correlates with more emergency visits
    const baseRate = 0.0001; // Base rate per person
    const aqiMultiplier = Math.max(1, aqi / 50); // Increases with AQI
    return Math.round(population * baseRate * aqiMultiplier);
  }

  private estimateHospitalizations(aqi: number, population: number): number {
    // Estimate hospitalizations (typically lower than emergency visits)
    const baseRate = 0.00005; // Base rate per person
    const aqiMultiplier = Math.max(1, aqi / 50);
    return Math.round(population * baseRate * aqiMultiplier);
  }

  private estimateAsthmaRate(population: number): number {
    // Colorado average asthma rate is approximately 7.8%
    const coloradoAsthmaRate = 0.078;
    return Math.round(population * coloradoAsthmaRate);
  }
}

// Export singleton instance
export default new DataCollectionService();

