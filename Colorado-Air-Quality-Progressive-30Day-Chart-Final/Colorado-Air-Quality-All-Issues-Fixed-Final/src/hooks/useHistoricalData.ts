// React Hook for Historical Data Management
// Provides easy access to collected historical data and collection status

import { useState, useEffect, useCallback } from 'react';
import { dataCollectionService, TrendDataPoint } from '../services/dataCollectionService';

export interface HistoricalDataStatus {
  isInitialized: boolean;
  isCollecting: boolean;
  lastCollection: string | null;
  totalDays: number;
  totalDataPoints: number;
  isComplete: boolean;
  error: string | null;
}

export interface UseHistoricalDataReturn {
  status: HistoricalDataStatus;
  getTrendData: (zipCode: string) => TrendDataPoint[];
  getAvailableDates: () => string[];
  forceCollection: () => Promise<void>;
  refreshStatus: () => void;
}

export const useHistoricalData = (): UseHistoricalDataReturn => {
  const [status, setStatus] = useState<HistoricalDataStatus>({
    isInitialized: false,
    isCollecting: false,
    lastCollection: null,
    totalDays: 0,
    totalDataPoints: 0,
    isComplete: false,
    error: null
  });

  /**
   * Initialize the data collection service
   */
  const initializeService = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isCollecting: true, error: null }));
      
      await dataCollectionService.initialize();
      
      const collectionStatus = dataCollectionService.getCollectionStatus();
      
      setStatus(prev => ({
        ...prev,
        isInitialized: true,
        isCollecting: false,
        lastCollection: collectionStatus.lastCollection,
        totalDays: collectionStatus.totalDays,
        totalDataPoints: collectionStatus.totalDataPoints,
        isComplete: collectionStatus.isComplete
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
  const getTrendData = useCallback((zipCode: string): TrendDataPoint[] => {
    try {
      return dataCollectionService.getTrendData(zipCode);
    } catch (error) {
      console.error('Error getting trend data:', error);
      return [];
    }
  }, []);

  /**
   * Get available dates with data
   */
  const getAvailableDates = useCallback((): string[] => {
    try {
      return dataCollectionService.getAvailableDates();
    } catch (error) {
      console.error('Error getting available dates:', error);
      return [];
    }
  }, []);

  /**
   * Force data collection (for testing or manual refresh)
   */
  const forceCollection = useCallback(async (): Promise<void> => {
    try {
      setStatus(prev => ({ ...prev, isCollecting: true, error: null }));
      
      await dataCollectionService.collectTodaysData();
      
      const collectionStatus = dataCollectionService.getCollectionStatus();
      
      setStatus(prev => ({
        ...prev,
        isCollecting: false,
        lastCollection: collectionStatus.lastCollection,
        totalDays: collectionStatus.totalDays,
        totalDataPoints: collectionStatus.totalDataPoints,
        isComplete: collectionStatus.isComplete
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
        lastCollection: collectionStatus.lastCollection,
        totalDays: collectionStatus.totalDays,
        totalDataPoints: collectionStatus.totalDataPoints,
        isComplete: collectionStatus.isComplete,
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
    getAvailableDates,
    forceCollection,
    refreshStatus
  };
};

