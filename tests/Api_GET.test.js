/**
 * @jest-environment node
 */

const { fetchFromApi } = require('../src/Api_GET'); // Ensure path is correct
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch');

describe('fetchFromApi', () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns JSON data when calling /api/users', async () => {
    // Mock API response
    const mockData = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
    });

    // Call the function
    const data = await fetchFromApi('users');

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users'
    );
    expect(data).not.toBeNull();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data)).toBe(true); // Assuming the response is an array
    expect(data).toEqual(mockData); // Check the exact data
  });

  // Optional: Add a test for error handling
  it('returns null on HTTP error', async () => {
    // Mock an HTTP error
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({}),
    });

    // Spy on console.error to suppress output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Call the function
    const data = await fetchFromApi('users');

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users'
    );
    expect(data).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching users:'),
      expect.any(Error)
    );

    // Clean up
    consoleErrorSpy.mockRestore();
  });
});