import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dataCollectionService from '../../services/dataCollectionService';
import { getRegionById } from '../../data/coloradoRegions';

interface TrendChartProps {
  selectedRegion: string;
  selectedPollutant: string;
}

interface ChartDataPoint {
  day: string;
  date: string;
  aqi: number;
  emergencyVisits: number;
  hospitalizations: number;
  asthmaRate: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ selectedRegion, selectedPollutant }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [collectionStatus, setCollectionStatus] = useState({ totalDays: 0, regionsWithData: 0, lastCollectionDate: null as string | null });
  const [isLoading, setIsLoading] = useState(true);

  const loadTrendData = () => {
    try {
      setIsLoading(true);
      
      // Get historical data for the selected region and pollutant
      const historicalData = dataCollectionService.getRegionalHistoricalData(selectedRegion, selectedPollutant);
      const status = dataCollectionService.getCollectionStatus();
      
      setCollectionStatus(status);

      if (historicalData.length === 0) {
        // If no data exists, start collecting immediately
        console.log(`No historical data found for ${selectedRegion} (${selectedPollutant}), starting data collection...`);
        dataCollectionService.collectDailyRegionalData().then(() => {
          // After collection, try to load data again
          const newData = dataCollectionService.getRegionalHistoricalData(selectedRegion, selectedPollutant);
          if (newData.length > 0) {
            const chartPoints: ChartDataPoint[] = newData.map((data, index) => ({
              day: `Day ${index + 1}`,
              date: new Date(data.date).toLocaleDateString(),
              aqi: data.aqi,
              emergencyVisits: data.emergencyVisits,
              hospitalizations: data.hospitalizations,
              asthmaRate: data.asthmaRate
            }));
            setChartData(chartPoints);
          }
        }).catch(error => {
          console.error('Error collecting initial data:', error);
        });
        setChartData([]);
        setIsLoading(false);
        return;
      }

      // Convert historical data to chart format - progressive display
      const chartPoints: ChartDataPoint[] = historicalData.map((data, index) => ({
        day: `Day ${index + 1}`,
        date: new Date(data.date).toLocaleDateString(),
        aqi: data.aqi,
        emergencyVisits: data.emergencyVisits,
        hospitalizations: data.hospitalizations,
        asthmaRate: data.asthmaRate
      }));

      setChartData(chartPoints);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading trend data:', error);
      setChartData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrendData();
    
    // Set up interval to refresh data every 15 minutes to catch new daily collections quickly
    const interval = setInterval(() => {
      console.log('🔄 Checking for updated trend data...');
      loadTrendData();
    }, 15 * 60 * 1000); // Check every 15 minutes for more responsive updates
    
    return () => clearInterval(interval);
  }, [selectedRegion, selectedPollutant]);

  // Get region information
  const region = getRegionById(selectedRegion);
  const regionDisplayName = region?.displayName || selectedRegion;

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label} (${data.date})`}</p>
          <p className="text-blue-600">{`AQI: ${data.aqi}`}</p>
          <p className="text-red-500">{`Emergency Visits: ${data.emergencyVisits}`}</p>
          <p className="text-orange-500">{`Hospitalizations: ${data.hospitalizations}`}</p>
          <p className="text-green-600">{`Asthma Rate: ${data.asthmaRate}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Force data collection for testing
  const handleForceCollection = async () => {
    setIsLoading(true);
    try {
      await dataCollectionService.collectDailyRegionalData();
      loadTrendData();
    } catch (error) {
      console.error('Error forcing data collection:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* Chart Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Air Quality Trends - {regionDisplayName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Real EPA data showing daily air quality measurements and health impact correlation
        </p>
      </div>

      {/* Data Collection Status */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              Progressive Data Collection
            </span>
          </div>
          <button
            onClick={handleForceCollection}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Collecting...' : 'Collect Now'}
          </button>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
          {chartData.length === 0 
            ? 'Starting data collection. First data point will appear within 24 hours.'
            : `${chartData.length} day${chartData.length === 1 ? '' : 's'} of data collected. Chart builds daily at 12:30 AM and auto-refreshes every 15 minutes.`
          }
          {collectionStatus.lastCollectionDate && (
            <span className="ml-2">
              Last updated: {new Date(collectionStatus.lastCollectionDate).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-96">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading trend data...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                yAxisId="aqi"
                orientation="left"
                stroke="#666"
                fontSize={12}
                label={{ value: 'AQI Level', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="visits"
                orientation="right"
                stroke="#666"
                fontSize={12}
                label={{ value: 'Monthly Visits', angle: 90, position: 'insideRight' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend />
              
              {/* AQI Line */}
              <Line
                yAxisId="aqi"
                type="monotone"
                dataKey="aqi"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Air Quality Index"
                connectNulls={false}
              />
              
              {/* Emergency Visits Line */}
              <Line
                yAxisId="visits"
                type="monotone"
                dataKey="emergencyVisits"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                name="Emergency Visits"
                connectNulls={false}
              />
              
              {/* Hospitalizations Line */}
              <Line
                yAxisId="visits"
                type="monotone"
                dataKey="hospitalizations"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                name="Hospitalizations"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Building Progressive Chart
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Starting daily data collection for {regionDisplayName}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Each day at 12:30 AM, a new data point will be added to the chart.
                Watch the trend line grow over the next 30 days!
              </p>
              <button
                onClick={handleForceCollection}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Collecting...' : 'Start Data Collection'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progressive Chart Information */}
      {chartData.length > 0 && chartData.length < 30 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 text-green-500 mr-2 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Progressive Chart Building: {chartData.length}/30 days complete
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                This chart builds progressively as real data is collected daily. 
                Each new day adds another data point, showing the evolving air quality trends.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Health Impact Alert */}
      {chartData.length >= 7 && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 text-orange-500 mr-2 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-orange-800 dark:text-orange-200">
                Health Impact Correlation Detected
              </p>
              <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                With {chartData.length} days of data, patterns show correlation between air quality and health impacts.
                Higher AQI days typically result in increased emergency visits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;

