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

  // Collect daily data for all Colorado regions and all pollutants
  async collectDailyRegionalData(): Promise<void> {
    console.log('🕐 Starting daily regional data collection for all pollutants...');
    const today = new Date().toISOString().split('T')[0];
    
    // Define pollutants to collect data for
    const pollutants = ['PM2.5', 'Ozone', 'PM10', 'NO2', 'SO2', 'CO'];
    
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
          
          // Create data points for each pollutant
          for (const pollutant of pollutants) {
            // For now, we'll use the primary pollutant data but label it for each type
            // In a real implementation, you'd fetch specific pollutant data
            const pollutantAQI = this.estimatePollutantAQI(airQualityData.aqi, pollutant);
            
            const dailyData: DailyRegionalData = {
              date: today,
              regionId: region.id,
              regionName: region.name,
              aqi: pollutantAQI,
              pollutant: pollutant,
              category: this.getAQICategory(pollutantAQI),
              // Health impact estimates based on AQI and population
              emergencyVisits: this.estimateEmergencyVisits(pollutantAQI, region.population),
              hospitalizations: this.estimateHospitalizations(pollutantAQI, region.population),
              asthmaRate: this.estimateAsthmaRate(region.population)
            };
            
            // Create a unique key for region + pollutant combination
            const dataKey = `${region.id}_${pollutant}`;
            
            // Add to historical data
            if (!historicalData[dataKey]) {
              historicalData[dataKey] = [];
            }
            
            // Remove data for today if it already exists (update)
            historicalData[dataKey] = historicalData[dataKey].filter(
              data => data.date !== today
            );
            
            // Add new data point
            historicalData[dataKey].push(dailyData);
            
            // Keep only last 30 days (rolling window)
            historicalData[dataKey] = historicalData[dataKey]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(-this.MAX_DAYS);
          }
          
          console.log(`✅ Data collected for ${region.displayName} (all pollutants)`);
          
          // Rate limiting: wait 100ms between regions to avoid overwhelming the API
          if (i < COLORADO_REGIONS.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.error(`💥 Error collecting data for ${region.displayName}:`, error);
          continue; // Continue with next region
        }
      }
      
      // Save all collected data
      this.saveHistoricalData(historicalData);
      console.log(`✅ Daily regional data collection completed for ${COLORADO_REGIONS.length} regions and ${pollutants.length} pollutants`);
      
    } catch (error) {
      console.error('💥 Error during daily data collection:', error);
    }
  }
  // Get historical data for a specific region and pollutant
  getRegionalHistoricalData(regionId: string, pollutant?: string): DailyRegionalData[] {
    const historicalData = this.getStoredHistoricalData();
    
    // If pollutant is specified, use the new key format
    if (pollutant) {
      const dataKey = `${regionId}_${pollutant}`;
      return historicalData[dataKey] || [];
    }
    
    // If no pollutant specified, return data for the primary pollutant (PM2.5) for backward compatibility
    const primaryKey = `${regionId}_PM2.5`;
    return historicalData[primaryKey] || historicalData[regionId] || [];
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

  // Initialize automatic daily collection with smart scheduling
  initializeAutomaticCollection(): void {
    console.log('⏰ Initializing smart automatic data collection system...');
    
    // Check if we need to collect data immediately (for new users or missed collections)
    this.checkAndCollectIfNeeded();
    
    // Set up periodic checks every hour to catch any missed collections
    setInterval(() => {
      this.checkAndCollectIfNeeded();
    }, 60 * 60 * 1000); // Check every hour
    
    // Also schedule the next daily collection
    this.scheduleNextCollection();
  }

  // Smart collection check - collects data if needed
  private async checkAndCollectIfNeeded(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const status = this.getCollectionStatus();
    
    // Check if we already collected data today
    if (status.lastCollectionDate === today) {
      console.log('✅ Data already collected today, skipping...');
      return;
    }
    
    // Check if it's past the collection time (12:30 AM) or if we're missing data
    const now = new Date();
    const todayCollectionTime = new Date();
    todayCollectionTime.setHours(this.COLLECTION_HOUR, this.COLLECTION_MINUTE, 0, 0);
    
    const shouldCollect = 
      now >= todayCollectionTime || // Past collection time today
      !status.lastCollectionDate || // No data at all
      status.lastCollectionDate < today; // Missing recent data
    
    if (shouldCollect) {
      console.log('🚀 Triggering automatic data collection...');
      await this.collectDailyRegionalData();
    }
  }

  // Schedule the next collection
  private scheduleNextCollection(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(this.COLLECTION_HOUR, this.COLLECTION_MINUTE, 0, 0);
    
    const msUntilCollection = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Next data collection scheduled for: ${tomorrow.toLocaleString()}`);
    console.log(`⏰ Time until next collection: ${Math.round(msUntilCollection / 1000 / 60)} minutes`);
    
    setTimeout(async () => {
      await this.collectDailyRegionalData();
      this.scheduleNextCollection(); // Schedule the next collection
    }, msUntilCollection);
  }

  // Estimate AQI for different pollutants based on primary AQI
  private estimatePollutantAQI(primaryAQI: number, pollutant: string): number {
    // Create realistic variations for different pollutants
    const variations: { [key: string]: number } = {
      'PM2.5': 1.0,      // Primary pollutant (no change)
      'Ozone': 0.85,     // Usually lower in winter, higher in summer
      'PM10': 1.15,      // Usually slightly higher than PM2.5
      'NO2': 0.75,       // Usually lower except near traffic
      'SO2': 0.6,        // Usually much lower in most areas
      'CO': 0.5          // Usually very low except near sources
    };
    
    const multiplier = variations[pollutant] || 1.0;
    const estimatedAQI = Math.round(primaryAQI * multiplier);
    
    // Add some realistic random variation (±10%)
    const variation = (Math.random() - 0.5) * 0.2;
    return Math.max(1, Math.round(estimatedAQI * (1 + variation)));
  }

  // Get AQI category based on value
  private getAQICategory(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
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

  // Get automatic collection system status
  getAutomaticCollectionStatus(): { 
    isActive: boolean; 
    nextCollectionTime: string; 
    lastCollectionDate: string | null;
    dataFreshness: string;
  } {
    const status = this.getCollectionStatus();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(this.COLLECTION_HOUR, this.COLLECTION_MINUTE, 0, 0);
    
    let dataFreshness = 'No data';
    if (status.lastCollectionDate) {
      const lastCollection = new Date(status.lastCollectionDate);
      const hoursAgo = Math.floor((now.getTime() - lastCollection.getTime()) / (1000 * 60 * 60));
      
      if (hoursAgo < 1) {
        dataFreshness = 'Less than 1 hour ago';
      } else if (hoursAgo < 24) {
        dataFreshness = `${hoursAgo} hours ago`;
      } else {
        const daysAgo = Math.floor(hoursAgo / 24);
        dataFreshness = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      }
    }
    
    return {
      isActive: true, // System is always active once initialized
      nextCollectionTime: tomorrow.toLocaleString(),
      lastCollectionDate: status.lastCollectionDate,
      dataFreshness
    };
  }

  // Force immediate data collection (for manual refresh)
  async forceDataRefresh(): Promise<boolean> {
    try {
      console.log('🔄 Forcing immediate data refresh...');
      await this.collectDailyRegionalData();
      console.log('✅ Data refresh completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error during forced data refresh:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new DataCollectionService();

