import {apiRequest } from './firebase'; 


/**
 * Fetches the latest orders from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of the latest orders.
 * @throws {Error} If there's an error fetching the latest orders.
 */
export const getLatestOrders = async () => {
  try {
    const result = await apiRequest('/api/orders/latest');
    return result.latestOrders;
  } catch (error) {
    console.error("Error fetching latest orders:", error);
    return [];
  }
};

/**
 * Fetches the latest sellers from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of the latest sellers.
 * @throws {Error} If there's an error fetching the latest sellers.
 */
export const getLatestSellers = async()=>{
  try{
    const sellers = await(apiRequest('/api/seller/latest'));
    
    return sellers;
  } 
  catch (error) {
    console.error("Error fetching latest sellers", error);
    throw error;
  }
};

/**
 * Fetches the total sales from the API.
 * @returns {Promise<number>} A promise that resolves to the total sales amount.
 * @throws {Error} If there's an error fetching the total sales.
 */
export const getTotalSales = async () => {
  try {
    const result = await apiRequest('/api/sales/total');
    return result.totalSales;
  } catch (error) {
    console.error("Error fetching totalsales:", error);
    throw error;
  }
};


/**
 * Fetches the top sellers from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of top sellers.
 * @throws {Error} If there's an error fetching the top sellers.
 */
export const getTopSellers = async () => {
  try {
    const result = await apiRequest('/api/sellers/best');
    return result;
  } catch (error) {
    console.error("Error fetching top 5 sellers", error);
    throw error;
  }
};

/**
 * Fetches the monthly sales performance data for the last 12 months.
 * @returns {Promise<Array<{ month: string, year: number, total: number }>>} A promise that resolves to an array
 * of monthly sales data, sorted chronologically.
 * @throws {Error} If the API request fails.
 */
export const fetchMonthlySalesPerformance = async () => {
  try {
    const monthlySalesData = await apiRequest('/api/orders/monthly-performance', 'GET');
    return monthlySalesData;
  } catch (error) {
    console.error('Error in fetchMonthlySalesPerformance:', error.message);
    throw new Error(`Could not fetch monthly sales data: ${error.message}`);
  }
};