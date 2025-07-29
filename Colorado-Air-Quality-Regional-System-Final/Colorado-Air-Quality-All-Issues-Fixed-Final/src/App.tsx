import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import dataCollectionService from './services/dataCollectionService';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import AsthmaEducation from './components/AsthmaEducation';
import InstagramBanner from './components/InstagramBanner';
import InSimpleTerms from './components/InSimpleTerms';
import StatCard from './components/stats/StatCard';
import AboutMe from './components/AboutMe';
import './App.css';
import { getAllRegionDisplayNames } from './data/coloradoRegions';

const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const [homeSubTab, setHomeSubTab] = React.useState('map');
  
  const { 
    selectedRegion, 
    selectedPollutant, 
    setSelectedRegion, 
    setSelectedPollutant,
    mostPollutedRegions,
    cleanestRegions,
    regions,
    refreshData
  } = useData();

  // Initialize data collection on app start
  useEffect(() => {
    console.log('🚀 Initializing Colorado Air Quality Dashboard with Regional System');
    dataCollectionService.initializeAutomaticCollection();
  }, []);

  // AQI color helper function
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00e400';      // Good - Green
    if (aqi <= 100) return '#ffff00';     // Moderate - Yellow
    if (aqi <= 150) return '#ff7e00';     // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return '#ff0000';     // Unhealthy - Red
    if (aqi <= 300) return '#8f3f97';     // Very Unhealthy - Purple
    return '#7e0023';                     // Hazardous - Maroon
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Instagram Banner */}
      <InstagramBanner />
      
      {/* Header */}
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Section */}
      <Hero 
        onExploreMap={() => {
          setActiveTab('home');
          setHomeSubTab('map');
        }}
        onLearnMore={() => setActiveTab('asthma-education')}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                value="471"
                label="Monitoring Stations"
                icon={<span>🏭</span>}
              />
              <StatCard
                value="7.8%"
                label="Avg. Asthma Rate"
                icon={<span>🫁</span>}
              />
              <StatCard
                value="24/7"
                label="Real-time Updates"
                icon={<span>⏰</span>}
              />
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
                <button
                  onClick={() => setHomeSubTab('map')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    homeSubTab === 'map'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                  }`}
                >
                  🗺️ Map
                </button>
                <button
                  onClick={() => setHomeSubTab('trends')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    homeSubTab === 'trends'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                  }`}
                >
                  📊 Trends
                </button>
              </div>
            </div>

            {/* Content based on selected tab */}
            {homeSubTab === 'map' && (
              <div className="animate-fade-in" id="map-section">
                <h2 className="text-2xl font-bold mb-6 text-center">Colorado Air Quality Map</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                  Interactive map showing air quality levels across Colorado regions. Larger circles indicate higher pollution levels. 
                  Color indicates AQI category.
                </p>
                
                <div className="mb-8">
                  <MapView darkMode={darkMode} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Most Polluted Regions</h3>
                    <div className="space-y-3">
                      {mostPollutedRegions.length > 0 ? mostPollutedRegions.map((region, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-medium">{region.name}</div>
                              <div className="text-sm text-gray-500">Pop: {region.population.toLocaleString()}</div>
                            </div>
                          </div>
                          <span 
                            className="px-2 py-1 rounded text-sm font-medium text-white"
                            style={{ backgroundColor: getAQIColor(region.aqi) }}
                          >
                            {region.aqi}
                          </span>
                        </div>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400">Loading regional data...</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Cleanest Regions</h3>
                    <div className="space-y-3">
                      {cleanestRegions.length > 0 ? cleanestRegions.map((region: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-medium">{region.name}</div>
                              <div className="text-sm text-gray-500">Pop: {region.population.toLocaleString()}</div>
                            </div>
                          </div>
                          <span 
                            className="px-2 py-1 rounded text-sm font-medium text-white"
                            style={{ backgroundColor: getAQIColor(region.aqi) }}
                          >
                            {region.aqi}
                          </span>
                        </div>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400">Loading regional data...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {homeSubTab === 'trends' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-center">Pollution Trend Analysis</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                  Recent air quality levels for selected Colorado regions and pollutants. Interactive and zoomable charts.
                </p>
                
                <div className="mb-8">
                  <div className="card mb-8">
                    <div className="flex flex-wrap items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Filter Options</h3>
                      <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                        <select 
                          className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.displayName}
                            </option>
                          ))}
                        </select>
                        <select 
                          className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                          value={selectedPollutant}
                          onChange={(e) => setSelectedPollutant(e.target.value)}
                        >
                          <option value="PM2.5">PM2.5</option>
                          <option value="PM10">PM10</option>
                          <option value="O3">O3</option>
                          <option value="NO2">NO2</option>
                          <option value="SO2">SO2</option>
                          <option value="CO">CO</option>
                        </select>
                      </div>
                    </div>
                    
                    <TrendChart 
                      selectedRegion={selectedRegion} 
                      selectedPollutant={selectedPollutant} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'asthma' && (
          <AsthmaEducation darkMode={darkMode} />
        )}

        {activeTab === 'about' && (
          <AboutMe 
            darkMode={darkMode} 
            onNavigateToInSimpleTerms={() => setActiveTab('simple')}
          />
        )}

        {activeTab === 'simple' && (
          <InSimpleTerms darkMode={darkMode} />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;

