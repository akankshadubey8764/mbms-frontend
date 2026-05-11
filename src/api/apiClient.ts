import axiosInstance from './axiosInstance';

/**
 * apiClient is now a wrapper for axiosInstance to maintain backward compatibility
 * with existing imports while using the new unified axios configuration.
 */
const apiClient = axiosInstance;

export default apiClient;
