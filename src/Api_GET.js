const fetch = require('node-fetch');

const BASE_URL = 'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api';

async function fetchFromApi(endpoint) {
    const apiUrl = `${BASE_URL}/${endpoint}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

module.exports = { fetchFromApi };
