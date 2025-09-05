import React, { createContext, useContext, useState, useEffect } from 'react';
import regionalDataService, { RegionalAirQualityData } from '../services/regionalDataService';
import dataCollectionService from '../services/dataCollectionService';
import { COLORADO_REGIONS, ColoradoRegion, getAllRegionDisplayNames } from '../data/coloradoRegions';

// Define the shape of our context
interface DataContextType {
  regionalData: RegionalAirQualityData[];
  selectedRegion: string;
  selectedPollutant: string;
  trendData: any[];
  mostPollutedRegions: any[];
  cleanestRegions: any[];
  regions: Array<{id: string, name: string, displayName: string}>;
  pollutants: string[];
  setSelectedRegion: (region: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
  refreshData: () => Promise<void>;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Available pollutants for filtering
const POLLUTANTS = ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management for regional air quality data
  const [regionalData, setRegionalData] = useState<RegionalAirQualityData[]>([]);
  
  // State for selected region and pollutant
  const [selectedRegion, setSelectedRegion] = useState<string>('denver-metro');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('PM2.5');
  
  // State for trend data and regional rankings
  const [trendData, setTrendData] = useState<any[]>([]);
  const [mostPollutedRegions, setMostPollutedRegions] = useState<any[]>([]);
  const [cleanestRegions, setCleanestRegions] = useState<any[]>([]);

  // Load regional air quality data
  const loadData = async () => {
    try {
      console.log('🔄 Loading regional air quality data...');
      
      // Get air quality data for all Colorado regions using regional data service
      const data = await regionalDataService.getAllRegionalData();
      setRegionalData(data);

      // Get most polluted and cleanest regions
      const mostPolluted = await regionalDataService.getMostPollutedRegions();
      const cleanest = await regionalDataService.getCleanestRegions();

      setMostPollutedRegions(mostPolluted);
      setCleanestRegions(cleanest);

      console.log('✅ Regional data loaded successfully');
      console.log(`📊 Loaded ${data.length} regions`);
      console.log(`🏆 Most polluted: ${mostPolluted[0]?.name} (AQI: ${mostPolluted[0]?.aqi})`);
      console.log(`🌟 Cleanest: ${cleanest[0]?.name} (AQI: ${cleanest[0]?.aqi})`);

    } catch (error) {
      console.error('💥 Error loading regional data:', error);
    }
  };

  // Load data on component mount and initialize automatic collection
  useEffect(() => {
    loadData();
    
    // Initialize automatic data collection system
    dataCollectionService.initializeAutomaticCollection();
    console.log('🚀 Automatic data collection system initialized');
  }, []);

  // Get available regions and pollutants
  const regions = regionalDataService.getAvailableRegions();
  const pollutants = POLLUTANTS;
  
  const contextValue: DataContextType = {
    // Regional Air Quality Data
    regionalData,
    selectedRegion,
    selectedPollutant,
    
    // Trend and ranking data
    trendData,
    mostPollutedRegions,
    cleanestRegions,
    
    // Available options
    regions,
    pollutants,
    
    // Actions
    setSelectedRegion,
    setSelectedPollutant,
    refreshData: loadData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;

