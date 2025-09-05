import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import dataCollectionService from './services/dataCollectionService';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import StatCard from './components/stats/StatCard';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import AsthmaEducation from './components/AsthmaEducation';
import AboutMe from './components/AboutMe';
import InSimpleTerms from './components/InSimpleTerms';
import InstagramBanner from './components/InstagramBanner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './App.css';
import { getAllRegionDisplayNames } from './data/coloradoRegions';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [homeSubTab, setHomeSubTab] = useState('map');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Enhanced asthma data for interactive charts
  const asthmaCountyData = [
    { county: 'Denver', asthmaRate: 12.3, emergencyVisits: 245, population: 715522 },
    { county: 'Jefferson', asthmaRate: 9.8, emergencyVisits: 189, population: 582910 },
    { county: 'Arapahoe', asthmaRate: 10.5, emergencyVisits: 198, population: 655070 },
    { county: 'Adams', asthmaRate: 11.2, emergencyVisits: 223, population: 508347 },
    { county: 'Boulder', asthmaRate: 8.9, emergencyVisits: 156, population: 330758 },
    { county: 'El Paso', asthmaRate: 10.1, emergencyVisits: 201, population: 730395 },
    { county: 'Larimer', asthmaRate: 9.3, emergencyVisits: 167, population: 359066 },
    { county: 'Douglas', asthmaRate: 8.2, emergencyVisits: 142, population: 357978 }
  ];

  const ageGroupData = [
    { ageGroup: '0-4 years', percentage: 18.5, color: '#FF6B6B' },
    { ageGroup: '5-17 years', percentage: 15.2, color: '#4ECDC4' },
    { ageGroup: '18-34 years', percentage: 8.9, color: '#45B7D1' },
    { ageGroup: '35-64 years', percentage: 9.7, color: '#96CEB4' },
    { ageGroup: '65+ years', percentage: 7.3, color: '#FFEAA7' }
  ];

  const seasonalData = [
    { month: 'Jan', emergencyVisits: 180, airQuality: 45 },
    { month: 'Feb', emergencyVisits: 165, airQuality: 42 },
    { month: 'Mar', emergencyVisits: 195, airQuality: 52 },
    { month: 'Apr', emergencyVisits: 220, airQuality: 58 },
    { month: 'May', emergencyVisits: 240, airQuality: 65 },
    { month: 'Jun', emergencyVisits: 285, airQuality: 78 },
    { month: 'Jul', emergencyVisits: 310, airQuality: 85 },
    { month: 'Aug', emergencyVisits: 295, airQuality: 82 },
    { month: 'Sep', emergencyVisits: 250, airQuality: 68 },
    { month: 'Oct', emergencyVisits: 210, airQuality: 55 },
    { month: 'Nov', emergencyVisits: 185, airQuality: 48 },
    { month: 'Dec', emergencyVisits: 175, airQuality: 44 }
  ];

  const asthmaStatistics = {
    averagePrevalence: 8.0,
    totalCounties: 8
  };

  // Initialize data collection on app start
  useEffect(() => {
    console.log('Initializing Colorado Air Quality Dashboard with Regional System');
    dataCollectionService.initializeAutomaticCollection();
  }, []);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle Hero button navigation
  const handleExploreMap = () => {
    setActiveTab('home');
    setHomeSubTab('map');
    setTimeout(() => {
      const mapElement = document.getElementById('map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Learn More button navigation
  const handleLearnMore = () => {
    setActiveTab('asthma');
    setTimeout(() => {
      const asthmaElement = document.getElementById('asthma-section');
      if (asthmaElement) {
        asthmaElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Helper function to get AQI color
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00e400';       // Good - Green
    if (aqi <= 100) return '#ffaa00';      // Moderate - Better Orange/Yellow (not too light)
    if (aqi <= 150) return '#ff7e00';      // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return '#ff0000';      // Unhealthy - Red
    if (aqi <= 300) return '#8f3f97';      // Very Unhealthy - Purple
    return '#7e0023';                      // Hazardous - Maroon
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Instagram Banner - Scrolls with page */}
      <InstagramBanner />
      
      {/* Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      
      <main>
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero onExploreMap={handleExploreMap} onLearnMore={handleLearnMore} />
            
            {/* Stats Section */}
            <section className="container mx-auto px-4 py-8 -mt-10 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  value="471" 
                  label="Monitoring Stations" 
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  }
                />
                <StatCard 
                  value={`${asthmaStatistics.averagePrevalence.toFixed(1)}%`}
                  label="Avg. Asthma Rate" 
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
                <StatCard 
                  value="24/7" 
                  label="Real-time Updates" 
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard 
                  value="PM2.5" 
                  label="Primary Pollutant" 
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  }
                />
              </div>
            </section>
            
            {/* Home Sub-Tab Navigation */}
            <section className="container mx-auto px-4 py-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setHomeSubTab('map')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'map'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Map
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setHomeSubTab('trends')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'trends'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Trends
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setHomeSubTab('asthma')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'asthma'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      Asthma
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setHomeSubTab('about')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'about'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About
                    </div>
                  </button>
                </nav>
              </div>
            </section>
            
            {/* Home Sub-Tab Content */}
            <section className="container mx-auto px-4 py-8">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  <span className="ml-3 text-lg">Loading air quality data...</span>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700">Error loading data. Please try again.</span>
                    <button 
                      onClick={refreshData}
                      className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              
              {!loading && (
                <>
                  {homeSubTab === 'map' && (
                    <div className="animate-fade-in" id="map-section">
                      <h2 className="text-2xl font-bold mb-6 text-center">Colorado Air Quality Map</h2>
                      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                        Interactive map showing air quality levels across Colorado regions. Larger circles indicate higher pollution levels. 
                        Color indicates AQI category.
                      </p>
                      
                      <div className="mb-8">
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Most Polluted Regions</h3>
                          <div className="space-y-3">
                            {mostPollutedRegions.length > 0 ? mostPollutedRegions.map((region, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100">
                                <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <div className="font-medium">{region.displayName}</div>
                                    <div className="text-sm text-gray-500">
                                      Population: {region.population ? region.population.toLocaleString() : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                                <span 
                                  className="px-3 py-1 rounded text-sm font-medium text-white"
                                  style={{ backgroundColor: getAQIColor(region.aqi) }}
                                >
                                  {region.aqi}
                                </span>
                              </div>
                            )) : (
                              <p className="text-gray-500">Loading regional data...</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Cleanest Regions</h3>
                          <div className="space-y-3">
                            {cleanestRegions.length > 0 ? cleanestRegions.map((region: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100">
                                <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <div className="font-medium">{region.displayName}</div>
                                    <div className="text-sm text-gray-500">
                                      Population: {region.population ? region.population.toLocaleString() : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                                <span 
                                  className="px-3 py-1 rounded text-sm font-medium text-white"
                                  style={{ backgroundColor: getAQIColor(region.aqi) }}
                                >
                                  {region.aqi}
                                </span>
                              </div>
                            )) : (
                              <p className="text-gray-500">Loading regional data...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {homeSubTab === 'trends' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold mb-6 text-center">Air Quality Trends</h2>
                      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                        Track air quality changes over time for different Colorado regions. Data is collected daily and shows 30-day trends.
                      </p>
                      
                      <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Region
                            </label>
                            <select
                              value={selectedRegion}
                              onChange={(e) => setSelectedRegion(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                  {region.displayName}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Pollutant
                            </label>
                            <select
                              value={selectedPollutant}
                              onChange={(e) => setSelectedPollutant(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="PM2.5">PM2.5</option>
                              <option value="O3">Ozone (O3)</option>
                              <option value="PM10">PM10</option>
                              <option value="NO2">NO2</option>
                            </select>
                          </div>
                        </div>
                        
                        <TrendChart 
                          selectedRegion={selectedRegion} 
                          selectedPollutant={selectedPollutant} 
                        />
                      </div>
                    </div>
                  )}
                  
                  {homeSubTab === 'asthma' && (
                    <div className="animate-fade-in" id="asthma-section">
                      <h2 className="text-2xl font-bold mb-6 text-center">Colorado Asthma Analytics Dashboard</h2>
                      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                        Comprehensive asthma statistics, emergency room visits, and health impact analysis for Colorado communities.
                      </p>
                      
                      {/* Key Statistics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {asthmaStatistics.averagePrevalence.toFixed(1)}%
                          </div>
                          <div className="text-gray-600 font-medium">Average Asthma Rate</div>
                          <div className="text-xs text-gray-500 mt-1">Statewide prevalence</div>
                        </div>
                        
                        <div className="card text-center bg-gradient-to-br from-red-50 to-red-100">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            2,847
                          </div>
                          <div className="text-gray-600 font-medium">Annual ER Visits</div>
                          <div className="text-xs text-gray-500 mt-1">Asthma-related emergencies</div>
                        </div>
                        
                        <div className="card text-center bg-gradient-to-br from-orange-50 to-orange-100">
                          <div className="text-3xl font-bold text-orange-600 mb-2">
                            1,234
                          </div>
                          <div className="text-gray-600 font-medium">Hospitalizations</div>
                          <div className="text-xs text-gray-500 mt-1">Severe asthma cases</div>
                        </div>
                        
                        <div className="card text-center bg-gradient-to-br from-green-50 to-green-100">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {asthmaStatistics.totalCounties}
                          </div>
                          <div className="text-gray-600 font-medium">Counties Monitored</div>
                          <div className="text-xs text-gray-500 mt-1">Data coverage</div>
                        </div>
                      </div>

                      {/* Interactive Charts Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* County Comparison Chart */}
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Asthma Rates by County
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={asthmaCountyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="county" 
                                stroke="#6b7280"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis 
                                stroke="#6b7280"
                                tick={{ fontSize: 12 }}
                                label={{ 
                                  value: 'Asthma Rate (%)', 
                                  angle: -90, 
                                  position: 'insideLeft',
                                  style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
                                }}
                              />
                              <Tooltip 
                                formatter={(value, name) => [
                                  name === 'asthmaRate' ? `${value}%` : value,
                                  name === 'asthmaRate' ? 'Asthma Rate' : 'Emergency Visits'
                                ]}
                                labelFormatter={(label) => `County: ${label}`}
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Legend />
                              <Bar dataKey="asthmaRate" fill="#3B82F6" name="Asthma Rate (%)" />
                              <Bar dataKey="emergencyVisits" fill="#EF4444" name="Monthly ER Visits" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Age Group Distribution */}
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Asthma by Age Group
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={ageGroupData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ ageGroup, percentage }) => `${ageGroup}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="percentage"
                              >
                                {ageGroupData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Asthma Rate']}
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Seasonal Trends Chart */}
                      <div className="card mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Seasonal Asthma Emergency Visits vs Air Quality
                        </h3>
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="month" 
                              stroke="#6b7280"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              yAxisId="left"
                              stroke="#6b7280"
                              tick={{ fontSize: 12 }}
                              label={{ 
                                value: 'Emergency Visits', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
                              }}
                            />
                            <YAxis 
                              yAxisId="right"
                              orientation="right"
                              stroke="#6b7280"
                              tick={{ fontSize: 12 }}
                              label={{ 
                                value: 'Air Quality Index', 
                                angle: 90, 
                                position: 'insideRight',
                                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
                              }}
                            />
                            <Tooltip 
                              formatter={(value, name) => [
                                value,
                                name === 'emergencyVisits' ? 'Emergency Visits' : 'Air Quality Index'
                              ]}
                              labelFormatter={(label) => `Month: ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="emergencyVisits" fill="#DC2626" name="Emergency Visits" />
                            <Bar yAxisId="right" dataKey="airQuality" fill="#F59E0B" name="Air Quality Index" />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800 font-medium">
                            Key Insight: Summer months show the highest correlation between poor air quality and asthma emergency visits, 
                            with July and August experiencing peak emergency room visits coinciding with elevated air pollution levels.
                          </p>
                        </div>
                      </div>

                      {/* Data Table */}
                      <div className="card">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Detailed County Statistics
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  County
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Population
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Asthma Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Monthly ER Visits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  People with Asthma
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {asthmaCountyData.map((county, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {county.county}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {county.population.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {county.asthmaRate}%
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      {county.emergencyVisits}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {Math.round(county.population * county.asthmaRate / 100).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {homeSubTab === 'about' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold mb-6 text-center">About This Project</h2>
                      <div className="max-w-3xl mx-auto">
                        <div className="card mb-8">
                          <h3 className="text-lg font-semibold mb-4">Project Purpose</h3>
                          <p className="mb-4">
                            The Colorado Air & Asthma Tracker is designed to visualize the relationship between air quality and asthma rates 
                            across Colorado. By providing real-time air pollution data alongside health statistics, we aim to help residents 
                            make informed decisions about their respiratory health.
                          </p>
                          <p>
                            This interactive dashboard focuses on tracking PM2.5 and O₃ (ozone) levels, which are key pollutants 
                            associated with respiratory issues and asthma exacerbation.
                          </p>
                        </div>
                        
                        <div className="card mb-8">
                          <h3 className="text-lg font-semibold mb-4">Data Sources & Resources</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Air Quality Data:</strong> <a href="https://www.airnow.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">EPA AirNow API</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Asthma Statistics:</strong> <a href="https://ephtracking.cdc.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">CDC Environmental Health Tracking Network</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Geographic Data:</strong> <a href="https://www.census.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">US Census Bureau</a></span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {/* Asthma Education Tab */}
        {activeTab === 'asthma-education' && (
          <section className="container mx-auto px-4 py-8">
            <AsthmaEducation 
              onNavigateToMap={() => {
                setActiveTab('home');
                setHomeSubTab('map');
                setTimeout(() => {
                  const mapElement = document.getElementById('map-section');
                  if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            />
          </section>
        )}

        {/* About Me Tab */}
        {activeTab === 'about-me' && (
          <section className="container mx-auto px-4 py-8">
            <AboutMe 
              onNavigateToInSimpleTerms={() => setActiveTab('in-simple-terms')}
            />
          </section>
        )}

        {/* In Simple Terms Tab */}
        {activeTab === 'in-simple-terms' && (
          <section className="container mx-auto px-4 py-8">
          </section>
        )}
      </main>

      {/* Footer with Instagram Icon */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Colorado Air & Asthma Tracker
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Monitoring air quality and asthma rates across Colorado
              </p>
            </div>
            
            <div className="flex space-x-6">
              {/* GitHub Icon */}
              <a 
                href="https://github.com/Mateusinhoo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              
              {/* LinkedIn Icon */}
              <a 
                href="https://www.linkedin.com/in/mateus-di-francesco/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Instagram Icon */}
              <a 
                href="https://www.instagram.com/asthma.colorado/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Colorado Air & Asthma Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
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

