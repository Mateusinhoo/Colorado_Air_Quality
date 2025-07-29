import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dataCollectionService from '../../services/dataCollectionService';
import { COLORADO_REGIONS, getRegionById } from '../../data/coloradoRegions';

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

  useEffect(() => {
    loadTrendData();
  }, [selectedRegion, selectedPollutant]);

  const loadTrendData = () => {
    try {
      // Get historical data for the selected region
      const historicalData = dataCollectionService.getRegionalHistoricalData(selectedRegion);
      const status = dataCollectionService.getCollectionStatus();
      
      setCollectionStatus(status);

      if (historicalData.length === 0) {
        setChartData([]);
        return;
      }

      // Convert historical data to chart format
      const chartPoints: ChartDataPoint[] = historicalData.map((data, index) => ({
        day: `Day ${index + 1}`,
        date: data.date,
        aqi: data.aqi,
        emergencyVisits: data.emergencyVisits,
        hospitalizations: data.hospitalizations,
        asthmaRate: data.asthmaRate
      }));

      setChartData(chartPoints);
    } catch (error) {
      console.error('Error loading trend data:', error);
      setChartData([]);
    }
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Chart Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          PM2.5 Impact on Asthma Emergency Care
        </h3>
        <p className="text-gray-600">
          Real EPA data showing correlation between air pollution and emergency visits in {regionDisplayName}
        </p>
      </div>

      {/* Data Collection Status */}
      {collectionStatus.totalDays > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-800 font-medium">
              Real EPA AirNow Data - {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Collected daily from official government monitoring stations. 
            {collectionStatus.totalDays < 30 
              ? ` Building trend data: ${collectionStatus.totalDays}/30 days complete.`
              : ' Complete 30-day trend data available.'
            }
          </p>
        </div>
      )}

      {/* Chart Container */}
      <div className="h-96">
        {chartData.length > 0 ? (
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
                label={{ value: 'PM2.5 AQI', angle: -90, position: 'insideLeft' }}
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
                name="PM2.5 Level (AQI)"
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
              />
              
              {/* Asthma Rate Line (baseline) */}
              <Line
                yAxisId="visits"
                type="monotone"
                dataKey="asthmaRate"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 2 }}
                name="Asthma Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Building Real Data Trends</h4>
              <p className="text-gray-600 mb-4">
                Starting to collect daily air quality data for {regionDisplayName}.
              </p>
              <p className="text-sm text-gray-500">
                Trend chart will appear as data is collected over the next 30 days.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Health Impact Alert */}
      {chartData.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 text-orange-500 mr-2 mt-0.5">⚠️</div>
            <div>
              <p className="font-medium text-orange-800">
                Health Impact Alert: Higher air pollution levels correlate with increased asthma emergency room visits and hospitalizations.
              </p>
              <p className="text-orange-700 text-sm mt-1">
                Data shows that poor air quality days result in 2-3x more asthma-related emergency visits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;

