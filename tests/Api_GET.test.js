/**
 * @jest-environment node
 */

const { fetchFromApi } = require('../src/Api_GET'); // ✅ adjust this path if needed

describe('fetchFromApi', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('returns JSON data when calling /api/users', async () => {
        const data = await fetchFromApi('users'); // This makes a real API call

        expect(typeof data).toBe('object'); // Just test that a JSON object is returned
        expect(data).not.toBeNull(); // Ensure it doesn't return null
        console.log('API returned:\n', JSON.stringify(data, null, 2));
    });
});
