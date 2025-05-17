import { cachedSellers } from './retrieveSellers';
import { apiRequest } from "./firebase";

export const retrieveSellersCached = async () => {
  if (cachedSellers) {
    return cachedSellers;
  }
  const fetchedSellers = await apiRequest('/api/sellers');
  cachedSellers = fetchedSellers;
  return cachedSellers;
};