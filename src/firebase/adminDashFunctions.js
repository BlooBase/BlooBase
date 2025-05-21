import {apiRequest } from './firebase'; 


export const getLatestOrders = async () => {
  try {
    const result = await apiRequest('/api/orders/latest');
    return result.latestOrders;
  } catch (error) {
    console.error("Error fetching latest orders:", error);
    return [];
  }
};

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

export const getTotalSales = async () => {
  try {
    const result = await apiRequest('/api/sales/total');
    return result.totalSales;
  } catch (error) {
    console.error("Error fetching totalsales:", error);
    throw error;
  }
};


export const getTopSellers = async () => {
  try {
    const result = await apiRequest('/api/sellers/best');
    return result;
  } catch (error) {
    console.error("Error fetching top 5 sellers", error);
    throw error;
  }
};
