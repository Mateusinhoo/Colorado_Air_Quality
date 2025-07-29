import React, { useState, useEffect, createContext, useContext } from 'react';
import realDataService from '../services/realDataService';

// Types for API responses
interface AirNowObservation {
  DateObserved: string;
  HourObserved: number;
  LocalTimeZone: string;
  ReportingArea: string;
  StateCode: string;
  Latitude: number;
  Longitude: number;
  ParameterName: string;
  AQI: number;
  Category: {
    Number: number;
    Name: string;
  };
}

interface AirQualityFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    city: string;
    zip: string;
    AQI: number;
    Pollutant: string;
    category: string;
    dateObserved: string;
  };
}

interface AirQualityData {
  type: 'FeatureCollection';
  features: AirQualityFeature[];
}

interface AsthmaStatistics {
  averagePrevalence: number;
  adultPrevalence?: number;
  childPrevalence?: number;
  totalCounties: number;
  dataAvailable: boolean;
}

interface TrendDataPoint {
  month: string;
  pm25: number;
  emergencyVisits: number;
  hospitalizations: number;
  asthmaRate: number;
}

interface CityData {
  name: string;
  zip: string;
  aqi: number;
  pollutant: string;
  category: string;
}

interface DataContextType {
  // Air Quality Data
  airQualityData: AirQualityData;
  features: AirQualityFeature[];
  
  // Selection State
  selectedZip: string;
  selectedPollutant: string;
  setSelectedZip: (zip: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
  
  // City Rankings
  mostPollutedCities: CityData[];
  cleanestCities: CityData[];
  
  // Available Options
  zipCodes: string[];
  pollutants: string[];
  
  // Asthma Data
  asthmaStatistics: AsthmaStatistics;
  
  // Trend Data
  trendData: TrendDataPoint[];
  
  // Loading and Error States
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

// Colorado cities data for coordinates with proper spacing to prevent overlapping
const COLORADO_CITIES = [
  { name: 'Parker', zip: '80134', lat: 39.5186, lon: -104.7614, population: 77814 },
  { name: 'Aurora', zip: '80013', lat: 39.6880, lon: -104.7547, population: 74732 },
  { name: 'Aurora', zip: '80015', lat: 39.6292, lon: -104.8319, population: 72155 },
  { name: 'Aurora', zip: '80016', lat: 39.6292, lon: -104.7319, population: 66479 },
  { name: 'Greeley', zip: '80634', lat: 40.4233, lon: -104.7091, population: 63553 },
  { name: 'Longmont', zip: '80504', lat: 40.1672, lon: -105.1019, population: 61305 },
  { name: 'Denver', zip: '80219', lat: 39.7392, lon: -105.0178, population: 60095 },
  { name: 'Commerce City', zip: '80022', lat: 39.8083, lon: -104.9342, population: 59556 },
  { name: 'Denver', zip: '80229', lat: 39.8361, lon: -105.0178, population: 57274 },
  { name: 'Fort Collins', zip: '80525', lat: 40.5853, lon: -105.0844, population: 55541 },
  { name: 'Greeley', zip: '80631', lat: 40.4233, lon: -104.7091, population: 50000 },
  { name: 'Broomfield', zip: '80020', lat: 39.9205, lon: -105.0866, population: 48000 },
  { name: 'Thornton', zip: '80011', lat: 39.8956, lon: -104.9811, population: 47000 },
  { name: 'Thornton', zip: '80012', lat: 39.8680, lon: -104.9547, population: 46000 },
  { name: 'Severance', zip: '80538', lat: 40.5225, lon: -104.8547, population: 45000 },
  { name: 'Colorado Springs', zip: '80918', lat: 38.8339, lon: -104.8214, population: 44000 },
  { name: 'Northglenn', zip: '80233', lat: 39.8956, lon: -104.9811, population: 43000 },
  { name: 'Denver', zip: '80202', lat: 39.7392, lon: -105.0178, population: 50000 },
  
  // Boulder area with proper spacing
  { name: 'Boulder', zip: '80301', lat: 40.0150, lon: -105.2705, population: 45000 },
  { name: 'Boulder', zip: '80302', lat: 40.0274, lon: -105.2519, population: 42000 },
  { name: 'Boulder', zip: '80303', lat: 40.0176, lon: -105.2811, population: 38000 },
  { name: 'Boulder', zip: '80304', lat: 40.0093, lon: -105.2430, population: 35000 },
  { name: 'Boulder', zip: '80305', lat: 40.0499, lon: -105.2277, population: 32000 },
  
  // Fort Collins area with spacing
  { name: 'Fort Collins', zip: '80521', lat: 40.5853, lon: -105.0844, population: 48000 },
  { name: 'Fort Collins', zip: '80522', lat: 40.5508, lon: -105.0668, population: 45000 },
  { name: 'Fort Collins', zip: '80523', lat: 40.5308, lon: -105.0468, population: 42000 },
  { name: 'Fort Collins', zip: '80524', lat: 40.5708, lon: -105.0268, population: 40000 },
  { name: 'Fort Collins', zip: '80526', lat: 40.5908, lon: -105.0068, population: 38000 },
  
  // Denver area with proper spacing to avoid overlap
  { name: 'Denver', zip: '80203', lat: 39.7192, lon: -105.0078, population: 45000 },
  { name: 'Denver', zip: '80204', lat: 39.7592, lon: -105.0278, population: 43000 },
  { name: 'Denver', zip: '80205', lat: 39.7792, lon: -105.0378, population: 41000 },
  { name: 'Denver', zip: '80206', lat: 39.7092, lon: -104.9978, population: 39000 },
  { name: 'Denver', zip: '80207', lat: 39.7292, lon: -104.9878, population: 37000 },
  { name: 'Denver', zip: '80209', lat: 39.7492, lon: -104.9778, population: 35000 },
  { name: 'Denver', zip: '80210', lat: 39.7692, lon: -104.9678, population: 33000 },
  { name: 'Denver', zip: '80211', lat: 39.7892, lon: -104.9578, population: 31000 },
  { name: 'Denver', zip: '80212', lat: 39.7992, lon: -104.9478, population: 29000 },
  { name: 'Denver', zip: '80214', lat: 39.7192, lon: -105.0478, population: 27000 },
  { name: 'Denver', zip: '80218', lat: 39.7392, lon: -104.9378, population: 25000 },
  { name: 'Denver', zip: '80220', lat: 39.7592, lon: -104.9278, population: 23000 },
  { name: 'Denver', zip: '80221', lat: 39.7792, lon: -104.9178, population: 21000 },
  { name: 'Denver', zip: '80222', lat: 39.7992, lon: -104.9078, population: 19000 },
  { name: 'Denver', zip: '80223', lat: 39.6892, lon: -105.0078, population: 17000 },
  { name: 'Denver', zip: '80224', lat: 39.6792, lon: -104.9978, population: 15000 },
  { name: 'Denver', zip: '80226', lat: 39.6692, lon: -104.9878, population: 13000 },
  { name: 'Denver', zip: '80227', lat: 39.6592, lon: -104.9778, population: 11000 },
  { name: 'Denver', zip: '80230', lat: 39.6492, lon: -104.9678, population: 9000 },
  { name: 'Denver', zip: '80231', lat: 39.6392, lon: -104.9578, population: 7000 },
  { name: 'Denver', zip: '80235', lat: 39.6292, lon: -104.9478, population: 5000 },
  
  // Colorado Springs area with proper spacing
  { name: 'Colorado Springs', zip: '80906', lat: 38.8339, lon: -104.8214, population: 42000 },
  { name: 'Colorado Springs', zip: '80907', lat: 38.8139, lon: -104.8014, population: 40000 },
  { name: 'Colorado Springs', zip: '80909', lat: 38.8539, lon: -104.8414, population: 38000 },
  { name: 'Colorado Springs', zip: '80910', lat: 38.8739, lon: -104.8614, population: 36000 },
  { name: 'Colorado Springs', zip: '80911', lat: 38.8939, lon: -104.8814, population: 34000 },
  { name: 'Colorado Springs', zip: '80915', lat: 38.8039, lon: -104.7814, population: 32000 },
  { name: 'Colorado Springs', zip: '80916', lat: 38.7839, lon: -104.7614, population: 30000 },
  { name: 'Colorado Springs', zip: '80917', lat: 38.7639, lon: -104.7414, population: 28000 },
  { name: 'Colorado Springs', zip: '80919', lat: 38.7439, lon: -104.7214, population: 26000 },
  { name: 'Colorado Springs', zip: '80920', lat: 38.7239, lon: -104.7014, population: 24000 },
  { name: 'Colorado Springs', zip: '80921', lat: 38.7039, lon: -104.6814, population: 22000 },
  { name: 'Colorado Springs', zip: '80922', lat: 38.6839, lon: -104.6614, population: 20000 },
  { name: 'Colorado Springs', zip: '80923', lat: 38.6639, lon: -104.6414, population: 18000 },
  { name: 'Colorado Springs', zip: '80924', lat: 38.6439, lon: -104.6214, population: 16000 },
  { name: 'Colorado Springs', zip: '80925', lat: 38.6239, lon: -104.6014, population: 14000 },
  
  // Longmont area with spacing
  { name: 'Longmont', zip: '80501', lat: 40.1672, lon: -105.1019, population: 35000 },
  { name: 'Longmont', zip: '80502', lat: 40.1472, lon: -105.0819, population: 33000 },
  { name: 'Longmont', zip: '80503', lat: 40.1872, lon: -105.1219, population: 31000 },
  
  // Arvada area with spacing
  { name: 'Arvada', zip: '80001', lat: 39.8028, lon: -105.0875, population: 45000 },
  { name: 'Arvada', zip: '80002', lat: 39.8228, lon: -105.1075, population: 43000 },
  { name: 'Arvada', zip: '80003', lat: 39.7828, lon: -105.0675, population: 41000 },
  { name: 'Arvada', zip: '80004', lat: 39.8428, lon: -105.1275, population: 39000 },
  { name: 'Arvada', zip: '80005', lat: 39.7628, lon: -105.0475, population: 37000 },
  
  // Westminster area with spacing
  { name: 'Westminster', zip: '80021', lat: 39.8366, lon: -105.0372, population: 40000 },
  { name: 'Westminster', zip: '80030', lat: 39.8566, lon: -105.0572, population: 38000 },
  { name: 'Westminster', zip: '80031', lat: 39.8166, lon: -105.0172, population: 36000 },
  
  // Littleton area with spacing
  { name: 'Littleton', zip: '80120', lat: 39.6133, lon: -105.0178, population: 35000 },
  { name: 'Littleton', zip: '80121', lat: 39.5933, lon: -104.9978, population: 33000 },
  { name: 'Littleton', zip: '80122', lat: 39.6333, lon: -105.0378, population: 31000 },
  { name: 'Littleton', zip: '80123', lat: 39.5733, lon: -104.9778, population: 29000 },
  { name: 'Littleton', zip: '80124', lat: 39.6533, lon: -105.0578, population: 27000 },
  { name: 'Littleton', zip: '80125', lat: 39.5533, lon: -104.9578, population: 25000 },
  { name: 'Littleton', zip: '80126', lat: 39.6733, lon: -105.0778, population: 23000 },
  { name: 'Littleton', zip: '80127', lat: 39.6133, lon: -105.0178, population: 21000 },
  
  // Pueblo area
  { name: 'Pueblo', zip: '81001', lat: 38.2544, lon: -104.6091, population: 40000 },
  { name: 'Pueblo', zip: '81003', lat: 38.2344, lon: -104.5891, population: 38000 },
  { name: 'Pueblo', zip: '81005', lat: 38.2744, lon: -104.6291, population: 36000 },
  { name: 'Pueblo', zip: '81007', lat: 38.2144, lon: -104.5691, population: 34000 },
  { name: 'Pueblo', zip: '81008', lat: 38.2944, lon: -104.6491, population: 32000 },
  
  // Grand Junction area (Western Slope)
  { name: 'Grand Junction', zip: '81501', lat: 39.0639, lon: -108.5506, population: 45000 },
  { name: 'Grand Junction', zip: '81502', lat: 39.0839, lon: -108.5706, population: 43000 },
  { name: 'Grand Junction', zip: '81503', lat: 39.0439, lon: -108.5306, population: 41000 },
  { name: 'Grand Junction', zip: '81504', lat: 39.1039, lon: -108.5906, population: 39000 },
  { name: 'Grand Junction', zip: '81505', lat: 39.0239, lon: -108.5106, population: 37000 },
  { name: 'Grand Junction', zip: '81506', lat: 39.1239, lon: -108.6106, population: 35000 },
  
  // Durango area (Southwest)
  { name: 'Durango', zip: '81301', lat: 37.2753, lon: -107.8801, population: 35000 },
  { name: 'Durango', zip: '81302', lat: 37.2553, lon: -107.8601, population: 33000 },
  { name: 'Durango', zip: '81303', lat: 37.2953, lon: -107.9001, population: 31000 },
  
  // Aspen area (Mountain Resort)
  { name: 'Aspen', zip: '81611', lat: 39.1911, lon: -106.8175, population: 15000 },
  { name: 'Snowmass Village', zip: '81615', lat: 39.2130, lon: -106.9378, population: 12000 },
  { name: 'Basalt', zip: '81621', lat: 39.3686, lon: -107.0323, population: 8000 },
  
  // Vail area (Mountain Resort)
  { name: 'Vail', zip: '81657', lat: 39.6403, lon: -106.3742, population: 18000 },
  { name: 'Avon', zip: '81620', lat: 39.6308, lon: -106.5217, population: 16000 },
  { name: 'Eagle', zip: '81631', lat: 39.6553, lon: -106.8289, population: 14000 },
  
  // Steamboat Springs area (Northwest)
  { name: 'Steamboat Springs', zip: '80487', lat: 40.4850, lon: -106.8317, population: 25000 },
  { name: 'Steamboat Springs', zip: '80488', lat: 40.4650, lon: -106.8117, population: 23000 },
  
  // Glenwood Springs area
  { name: 'Glenwood Springs', zip: '81601', lat: 39.5505, lon: -107.3248, population: 22000 },
  { name: 'Glenwood Springs', zip: '81602', lat: 39.5305, lon: -107.3048, population: 20000 },
  
  // Montrose area (Western Slope)
  { name: 'Montrose', zip: '81401', lat: 38.4783, lon: -107.8762, population: 28000 },
  { name: 'Montrose', zip: '81403', lat: 38.4583, lon: -107.8562, population: 26000 },
  
  // Sterling area (Eastern Plains)
  { name: 'Sterling', zip: '80751', lat: 40.6253, lon: -103.2077, population: 18000 },
  { name: 'Sterling', zip: '80750', lat: 40.6053, lon: -103.1877, population: 16000 },
  
  // La Junta area (Eastern Plains)
  { name: 'La Junta', zip: '81050', lat: 37.9847, lon: -103.5441, population: 15000 },
  { name: 'Las Animas', zip: '81054', lat: 38.0664, lon: -103.2099, population: 12000 },
  
  // Alamosa area (San Luis Valley)
  { name: 'Alamosa', zip: '81101', lat: 37.4694, lon: -105.8700, population: 20000 },
  { name: 'Alamosa', zip: '81102', lat: 37.4494, lon: -105.8500, population: 18000 },
  
  // Craig area (Northwest)
  { name: 'Craig', zip: '81625', lat: 40.5155, lon: -107.5464, population: 16000 },
  { name: 'Hayden', zip: '81639', lat: 40.4889, lon: -107.2631, population: 8000 },
  
  // Cortez area (Southwest)
  { name: 'Cortez', zip: '81321', lat: 37.3489, lon: -108.5859, population: 14000 },
  { name: 'Cortez', zip: '81323', lat: 37.3289, lon: -108.5659, population: 12000 },
  
  // Salida area (Mountain)
  { name: 'Salida', zip: '81201', lat: 38.5347, lon: -105.9989, population: 12000 },
  { name: 'Buena Vista', zip: '81211', lat: 38.8422, lon: -106.1312, population: 8000 },
  
  // Canon City area
  { name: 'Canon City', zip: '81212', lat: 38.4411, lon: -105.2422, population: 18000 },
  { name: 'Canon City', zip: '81215', lat: 38.4211, lon: -105.2222, population: 16000 },
  
  // Trinidad area (South)
  { name: 'Trinidad', zip: '81082', lat: 37.1692, lon: -104.5011, population: 10000 },
  { name: 'Walsenburg', zip: '81089', lat: 37.6242, lon: -104.7808, population: 8000 },
  
  // Rifle area (Western Slope)
  { name: 'Rifle', zip: '81650', lat: 39.5347, lon: -107.7831, population: 12000 },
  { name: 'Silt', zip: '81652', lat: 39.5486, lon: -107.6553, population: 6000 },
  
  // Delta area (Western Slope)
  { name: 'Delta', zip: '81416', lat: 38.7420, lon: -108.0687, population: 10000 },
  { name: 'Cedaredge', zip: '81413', lat: 38.9003, lon: -107.9231, population: 4000 },
  
  // Lamar area (Eastern Plains)
  { name: 'Lamar', zip: '81052', lat: 38.0869, lon: -102.6204, population: 12000 },
  { name: 'Holly', zip: '81047', lat: 38.0581, lon: -102.1232, population: 2000 },
  
  // Yuma area (Eastern Plains)
  { name: 'Yuma', zip: '80759', lat: 40.1097, lon: -102.7238, population: 6000 },
  { name: 'Wray', zip: '80758', lat: 40.0756, lon: -102.2232, population: 4000 },
  
  // Kremmling area (Mountain)
  { name: 'Kremmling', zip: '80459', lat: 40.0581, lon: -106.3928, population: 3000 },
  { name: 'Hot Sulphur Springs', zip: '80451', lat: 40.0789, lon: -106.1081, population: 2000 },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management for air quality data
  const [airQualityData, setAirQualityData] = useState<{ type: 'FeatureCollection'; features: AirQualityFeature[] }>({
    type: 'FeatureCollection',
    features: []
  });
  
  // State management for features
  const [features, setFeatures] = useState<AirQualityFeature[]>([]);
  const [selectedZip, setSelectedZip] = useState('80134'); // Default to Parker
  const [selectedPollutant, setSelectedPollutant] = useState('PM2.5');
  const [mostPollutedCities, setMostPollutedCities] = useState<CityData[]>([]);
  const [cleanestCities, setCleanestCities] = useState<CityData[]>([]);
  const [asthmaStatistics, setAsthmaStatistics] = useState<AsthmaStatistics>({
    averagePrevalence: 8.0, // Fixed at 8% as requested
    totalCounties: 10,
    dataAvailable: true
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available options
  const zipCodes = realDataService.getAvailableZipCodes().map(item => item.zip);
  const pollutants = ['PM2.5', 'Ozone', 'PM10', 'NO2', 'SO2', 'CO'];

  // Load data function
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Loading air quality data for', COLORADO_CITIES.length, 'Colorado cities');
      
      // Load air quality data for all Colorado cities
      const airQualityPromises = COLORADO_CITIES.map(async (cityInfo) => {
        const airData = await realDataService.getAirQualityData(cityInfo.zip);
        
        if (airData) {
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [cityInfo.lon, cityInfo.lat]
            },
            properties: {
              city: airData.city,
              zip: airData.zip,
              AQI: airData.aqi,
              Pollutant: airData.pollutant,
              category: airData.category,
              dateObserved: airData.date
            }
          };
        }
        return null;
      });

      const airQualityResults = await Promise.all(airQualityPromises);
      const validFeatures = airQualityResults.filter(feature => feature !== null) as AirQualityFeature[];
      
      setAirQualityData({
        type: 'FeatureCollection',
        features: validFeatures
      });

      // Calculate most polluted cities from the air quality data
      const cityAQIData = validFeatures.map(feature => ({
        name: feature.properties.city,
        zip: feature.properties.zip,
        aqi: feature.properties.AQI,
        pollutant: feature.properties.Pollutant || 'PM2.5',
        category: feature.properties.category || 'Good'
      }));

      // Sort by AQI descending and take top 5 most polluted
      const mostPolluted = cityAQIData
        .sort((a, b) => b.aqi - a.aqi)
        .slice(0, 5);

      setMostPollutedCities(mostPolluted);

      // Load cleanest cities data
      const cleanCities = await realDataService.getCleanestCities();
      setCleanestCities(cleanCities.map((city: any) => ({
        name: city.name,
        zip: city.zip,
        aqi: city.aqi,
        pollutant: 'PM2.5',
        category: city.aqi <= 50 ? 'Good' : city.aqi <= 100 ? 'Moderate' : 'Unhealthy for Sensitive Groups'
      })));

      // Load asthma statistics
      const countyData = await realDataService.getCountyAsthmaData();
      const avgAsthmaRate = countyData.reduce((sum, county) => sum + county.asthmaRate, 0) / countyData.length;
      
      setAsthmaStatistics({
        averagePrevalence: avgAsthmaRate,
        totalCounties: countyData.length,
        dataAvailable: true
      });

      // Trend data is now handled by the real data collection system
      // No longer loading fake trend data from realDataService
      setTrendData([]);

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load air quality data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data function
  const refreshData = async () => {
    await loadData();
  };

  // Load data on component mount and when selectedZip or selectedPollutant changes
  useEffect(() => {
    loadData();
  }, [selectedZip, selectedPollutant]);

  // Derived data
  const airQualityFeatures = airQualityData.features;
  
  const contextValue: DataContextType = {
    // Air Quality Data
    airQualityData,
    features: airQualityFeatures,
    selectedZip,
    selectedPollutant,
    mostPollutedCities,
    cleanestCities,
    asthmaStatistics,
    trendData,
    loading,
    error,
    
    // Available options
    zipCodes,
    pollutants,
    
    // Actions
    setSelectedZip,
    setSelectedPollutant,
    refreshData: loadData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

