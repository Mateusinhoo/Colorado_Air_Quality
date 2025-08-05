import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import regionalDataService, { RegionalAirQualityData } from '../../services/regionalDataService';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  darkMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ darkMode = false }) => {
  const { selectedPollutant } = useData();
  const [regionalData, setRegionalData] = useState<RegionalAirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load regional data on component mount
  useEffect(() => {
    const loadRegionalData = async () => {
      try {
        setLoading(true);
        console.log('🗺️ Loading regional data for map...');
        const data = await regionalDataService.getAllRegionalData();
        setRegionalData(data);
        console.log('✅ Regional data loaded for map:', data.length, 'regions');
      } catch (error) {
        console.error('❌ Error loading regional data for map:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegionalData();
  }, []);
  
  // Colorado center coordinates
  const coloradoCenter: [number, number] = [39.55, -105.78];
  
  // Choose tile layer based on dark mode
  const tileUrl = darkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  
  const attribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Helper function to get color based on AQI value
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#a8e05f';
    if (aqi <= 100) return '#fdd74b';
    if (aqi <= 150) return '#fe9b57';
    if (aqi <= 200) return '#fe6a69';
    if (aqi <= 300) return '#a97abc';
    return '#a87383';
  };

  // Helper function to get AQI description
  const getAQIDescription = (aqi: number): string => {
    if (aqi <= 50) return 'Good - Air quality is satisfactory';
    if (aqi <= 100) return 'Moderate - Acceptable for most people';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy - Everyone may experience problems';
    if (aqi <= 300) return 'Very Unhealthy - Health alert';
    return 'Hazardous - Emergency conditions';
  };

  // Helper function to get radius based on AQI value and region size
  const getRegionalRadius = (aqi: number): number => {
    // Base radius for regional circles (larger than zip code markers)
    let baseRadius = 20;
    
    // Adjust radius based on AQI level
    if (aqi <= 50) return baseRadius;
    if (aqi <= 100) return baseRadius + 4;
    if (aqi <= 150) return baseRadius + 8;
    if (aqi <= 200) return baseRadius + 12;
    if (aqi <= 300) return baseRadius + 16;
    return baseRadius + 20;
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg" style={{ zIndex: 1 }}>
      <MapContainer
        center={coloradoCenter}
        zoom={6.5}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        className="rounded-lg"
      >
        <TileLayer
          url={tileUrl}
          attribution={attribution}
        />
        
        <ZoomControl position="topright" />
        
        {/* Loading indicator */}
        {loading && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } shadow-lg z-[1000]`}>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm">Loading regional data...</span>
            </div>
          </div>
        )}
        
        {/* Regional circles */}
        {!loading && regionalData.map((region: RegionalAirQualityData, index: number) => {
          const aqi = region.aqi;
          
          return (
            <CircleMarker
              key={region.regionId}
              center={[region.lat, region.lon]}
              radius={getRegionalRadius(aqi)}
              fillColor={getAQIColor(aqi)}
              color={darkMode ? '#ffffff' : '#000000'}
              weight={2}
              opacity={0.7}
              fillOpacity={0.6}
            >
              <Popup className="rounded-lg shadow-lg">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <h3 className="font-semibold text-lg mb-1">
                    {region.displayName}
                  </h3>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {region.reportingArea}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span 
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getAQIColor(aqi) }}
                    ></span>
                    <span className="font-medium text-lg">
                      AQI: {aqi}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Primary Pollutant: {region.pollutant}
                  </p>
                  <p className={`text-sm mt-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {region.category.replace(' (Fallback)', '')}
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getAQIDescription(aqi)}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last updated: {region.date}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className={`absolute bottom-4 left-4 rounded-lg shadow-md p-3 max-w-xs ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h4 className="font-medium text-sm mb-2">Air Quality Index</h4>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a8e05f] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fdd74b] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe9b57] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe6a69] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a97abc] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a87383] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hazardous (301+)</span>
          </div>
        </div>
      </div>
      
      {/* Regional Coverage Info */}
      <div className={`absolute top-4 left-4 rounded-lg shadow-md p-3 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h4 className="font-medium text-sm mb-1">
          Colorado Regional Coverage
        </h4>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {loading ? 'Loading...' : `${regionalData.length} regions monitored`}
        </div>
        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Click circles for details
        </div>
      </div>
    </div>
  );
};

export default MapView;

