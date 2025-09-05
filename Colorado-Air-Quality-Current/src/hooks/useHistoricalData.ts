// React Hook for Historical Data Management
// Provides easy access to collected historical data and collection status

import { useState, useEffect, useCallback } from 'react';
import dataCollectionService from '../services/dataCollectionService';

// Define TrendDataPoint interface locally
export interface TrendDataPoint {
  date: string;
  aqi: number;
  pollutant: string;
  category: string;
}

export interface HistoricalDataStatus {
  isInitialized: boolean;
  isCollecting: boolean;
  lastCollection: string | null;
  totalDays: number;
  regionsWithData: number;
  error: string | null;
}

export interface UseHistoricalDataReturn {
  status: HistoricalDataStatus;
  getTrendData: (regionId: string) => TrendDataPoint[];
  initializeService: () => Promise<void>;
  forceCollection: () => Promise<void>;
  refreshStatus: () => void;
}

export const useHistoricalData = (): UseHistoricalDataReturn => {
  const [status, setStatus] = useState<HistoricalDataStatus>({
    isInitialized: false,
    isCollecting: false,
    lastCollection: null,
    totalDays: 0,
    regionsWithData: 0,
    error: null
  });

  /**
   * Initialize the data collection service
   */
  const initializeService = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isCollecting: true, error: null }));
      
      await dataCollectionService.initializeAutomaticCollection();
      
      const collectionStatus = dataCollectionService.getCollectionStatus();
      
      setStatus(prev => ({
        ...prev,
        isInitialized: true,
        isCollecting: false,
        lastCollection: collectionStatus.lastCollectionDate,
        totalDays: collectionStatus.totalDays,
        regionsWithData: collectionStatus.regionsWithData
      }));
      
    } catch (error) {
      console.error('Error initializing data collection service:', error);
      setStatus(prev => ({
        ...prev,
        isCollecting: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  /**
   * Get trend data for a specific zip code
   */
  const getTrendData = useCallback((regionId: string): TrendDataPoint[] => {
    try {
      const regionalData = dataCollectionService.getRegionalHistoricalData(regionId);
      return regionalData.map(data => ({
        date: data.date,
        aqi: data.aqi,
        pollutant: data.pollutant,
        category: data.category
      }));
    } catch (error) {
      console.error('Error getting trend data:', error);
      return [];
    }
  }, []);

  /**
   * Force data collection (for testing or manual refresh)
   */
  const forceCollection = useCallback(async (): Promise<void> => {
    try {
      setStatus(prev => ({ ...prev, isCollecting: true, error: null }));
      
      await dataCollectionService.collectDailyRegionalData();
      
      const collectionStatus = dataCollectionService.getCollectionStatus();
      
      setStatus(prev => ({
        ...prev,
        isInitialized: true,
        lastCollection: collectionStatus.lastCollectionDate,
        totalDays: collectionStatus.totalDays,
        regionsWithData: collectionStatus.regionsWithData
      }));
      
    } catch (error) {
      console.error('Error during forced collection:', error);
      setStatus(prev => ({
        ...prev,
        isCollecting: false,
        error: error instanceof Error ? error.message : 'Collection failed'
      }));
    }
  }, []);

  /**
   * Refresh status information
   */
  const refreshStatus = useCallback(() => {
    try {
      const collectionStatus = dataCollectionService.getCollectionStatus();
      
      setStatus(prev => ({
        ...prev,
        lastCollection: collectionStatus.lastCollectionDate,
        totalDays: collectionStatus.totalDays,
        regionsWithData: collectionStatus.regionsWithData,
        error: null
      }));
      
    } catch (error) {
      console.error('Error refreshing status:', error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Status refresh failed'
      }));
    }
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeService();
  }, [initializeService]);

  /**
   * Set up periodic status refresh
   */
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [refreshStatus]);

  return {
    status,
    getTrendData,
    initializeService,
    forceCollection,
    refreshStatus
  };
};