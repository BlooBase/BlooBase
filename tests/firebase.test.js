import {
  auth,
  db,
  storage,
  doc,
  setDoc,
  signupNormUser,
  addUserToFirestore,
  loginNormUser,
  GoogleSignup,
  GoogleLogin,
  getUserName,
  getUserRole,
  logout,
  getRoleSize,
  getUserAuthProvider,
  updateCredentials,
  deleteAccount,
  getCollectionSize,
  apiRequest,
  uploadFile,
  upsertSellerCard,
  getSellerCard,
  deleteSellerCard,
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from '../src/firebase/firebase';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  updateDoc,
  serverTimestamp,
  getDoc,
  getCountFromServer,
  where,
  query,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Mock Firebase dependencies
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({}),
}));

jest.mock('firebase/auth', () => {
  const authMock = {
    currentUser: null,
  };
  return {
    getAuth: jest.fn().mockReturnValue(authMock),
    createUserWithEmailAndPassword: jest.fn(),
    sendEmailVerification: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    updatePassword: jest.fn(),
    updateEmail: jest.fn(),
    deleteUser: jest.fn(),
    EmailAuthProvider: { credential: jest.fn() },
    reauthenticateWithCredential: jest.fn(),
    signOut: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  getDoc: jest.fn(),
  getCountFromServer: jest.fn(),
  where: jest.fn(),
  query: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock global alert and console
global.alert = jest.fn();
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('Firebase Functions', () => {
  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
    getIdToken: jest.fn().mockResolvedValue('mockToken'),
  };
  const mockDocRef = { id: 'user123' };
  const mockUserData = {
    Email: 'test@example.com',
    Name: 'Test User',
    Role: 'user',
    authProvider: 'Firebase Auth',
    joinedAt: 'timestamp',
  };
  const mockCollectionRef = { id: 'users' };
  const mockQuery = { id: 'query' };
  const mockSnapshot = { data: () => ({ count: 5 }) };

  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser = mockUser;
    doc.mockReturnValue(mockDocRef);
    collection.mockReturnValue(mockCollectionRef);
    query.mockReturnValue(mockQuery);
    getAuth.mockReturnValue(auth);
    getFirestore.mockReturnValue(db);
    getStorage.mockReturnValue(storage);
    serverTimestamp.mockReturnValue('timestamp');
    global.fetch.mockReset();
    global.console.log.mockClear();
    global.console.error.mockClear();
    global.alert.mockClear();
  });

  describe('apiRequest', () => {
    test('makes GET request without auth', async () => {
      auth.currentUser = null;
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      });
      const result = await apiRequest('/test');
      expect(fetch).toHaveBeenCalledWith('https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/test', {
        method: 'GET',
        headers: {},
      });
      expect(result).toEqual({ data: 'test' });
    });

    test('makes POST request with auth and JSON body', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      });
      const result = await apiRequest('/test', 'POST', { key: 'value' });
      expect(fetch).toHaveBeenCalledWith('https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/test', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mockToken',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      });
      expect(result).toEqual({ data: 'test' });
    });

    test('makes POST request with FormData', async () => {
      const formData = new FormData();
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      });
      const result = await apiRequest('/test', 'POST', formData, true);
      expect(fetch).toHaveBeenCalledWith('https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/test', {
        method: 'POST',
        headers: { Authorization: 'Bearer mockToken' },
        body: formData,
      });
      expect(result).toEqual({ data: 'test' });
    });

    test('throws error on non-OK response with JSON error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Bad request' }),
      });
      await expect(apiRequest('/test')).rejects.toThrow('Bad request');
    });

    test('throws error on non-OK response without JSON', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });
      await expect(apiRequest('/test')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('uploadFile', () => {
    test('uploads file and returns path', async () => {
      const file = new File(['content'], 'test.jpg');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'test_folder');
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ path: '/uploads/test.jpg' }),
      });
      const result = await uploadFile(file, 'test_folder');
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(result).toBe('/uploads/test.jpg');
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(uploadFile(new File(['content'], 'test.jpg'), 'test_folder')).rejects.toThrow('User not authenticated');
    });

    test('throws error on upload failure', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Upload failed' }),
      });
      await expect(uploadFile(new File(['content'], 'test.jpg'), 'test_folder')).rejects.toThrow('Upload failed');
    });
  });

  describe('addUserToFirestore', () => {
    test('adds user data via API', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await addUserToFirestore(mockUser.uid, mockUser.email, mockUser.displayName, 'user', 'Firebase Auth');
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mockToken',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            userId: mockUser.uid,
            email: mockUser.email,
            name: mockUser.displayName,
            role: 'user',
            autheProvider: 'Firebase Auth',
          }),
        })
      );
      expect(console.log).toHaveBeenCalledWith('User added via API!');
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'API error' }),
      });
      await expect(addUserToFirestore(mockUser.uid, mockUser.email, mockUser.displayName, 'user', 'Firebase Auth')).rejects.toThrow('API error');
      expect(console.error).toHaveBeenCalledWith('Error adding user via API:', expect.any(Error));
    });
  });

  describe('getUserData', () => {
    test('retrieves user data via API', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      });
      const result = await getUserData();
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.any(Object)
      );
      expect(result).toEqual(mockUserData);
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(getUserData()).rejects.toThrow('User is not authenticated');
    });

    test('throws error on API failure', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'User not found' }),
      });
      await expect(getUserData()).rejects.toThrow('User not found');
      expect(console.error).toHaveBeenCalledWith('Error fetching user data via API:', expect.any(Error));
    });
  });

  describe('getUserName', () => {
    test('retrieves user name', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      });
      const result = await getUserName();
      expect(result).toBe(mockUserData.Name);
    });

    test('returns null on error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      const result = await getUserName();
      expect(console.error).toHaveBeenCalledWith('Error fetching user name via API:', expect.any(Error));
      expect(result).toBeNull();
    });
  });

  describe('getUserRole', () => {
    test('retrieves user role', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      });
      const result = await getUserRole();
      expect(result).toBe(mockUserData.Role);
    });

    test('returns null on error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      const result = await getUserRole();
      expect(console.error).toHaveBeenCalledWith('Error fetching user role via API:', expect.any(Error));
      expect(result).toBeNull();
    });
  });

  describe('getUserAuthProvider', () => {
    test('retrieves auth provider', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      });
      const result = await getUserAuthProvider();
      expect(result).toBe(mockUserData.authProvider);
    });

    test('returns null on error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      const result = await getUserAuthProvider();
      expect(console.error).toHaveBeenCalledWith('Error fetching user auth provider via API:', expect.any(Error));
      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    test('signs out user', async () => {
      signOut.mockResolvedValue();
      await logout();
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(console.log).toHaveBeenCalledWith('User signed out');
    });

    test('handles errors', async () => {
      signOut.mockRejectedValue(new Error('Sign out error'));
      await logout();
      expect(console.error).toHaveBeenCalledWith('Sign-out error:', expect.any(Error));
    });
  });

  describe('getRoleSize', () => {
    test('retrieves count of users with role', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ count: 5 }),
      });
      const result = await getRoleSize('admin');
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/roles/admin/size',
        expect.any(Object)
      );
      expect(result).toBe(5);
    });

    test('returns 0 on error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      const result = await getRoleSize('admin');
      expect(console.error).toHaveBeenCalledWith('Error fetching size of role admin via API:', expect.any(Error));
      expect(result).toBe(0);
    });
  });

  describe('getCollectionSize', () => {
    test('retrieves collection count', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ count: 5 }),
      });
      const result = await getCollectionSize('Products');
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/collections/Products/size',
        expect.any(Object)
      );
      expect(result).toBe(5);
    });

    test('returns 0 on error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      const result = await getCollectionSize('Products');
      expect(console.error).toHaveBeenCalledWith('Error fetching size of collection Products via API:', expect.any(Error));
      expect(result).toBe(0);
    });
  });

  describe('signupNormUser', () => {
    test('creates user and adds to API', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      sendEmailVerification.mockResolvedValue();
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await signupNormUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: 'user',
      });
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userId: mockUser.uid,
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
            autheProvider: 'Firebase Auth',
          }),
        })
      );
      expect(alert).toHaveBeenCalledWith('Account created! Please check your email for verification.');
    });

    test('alerts for mismatched passwords', async () => {
      await signupNormUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'different',
        role: 'user',
      });
      expect(alert).toHaveBeenCalledWith('Passwords do not match');
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test('handles signup errors', async () => {
      createUserWithEmailAndPassword.mockRejectedValue(new Error('Signup error'));
      await signupNormUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: 'user',
      });
      expect(alert).toHaveBeenCalledWith('Signup failed: Signup error');
    });

    test('handles API errors after user creation', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      sendEmailVerification.mockResolvedValue();
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'API error' }),
      });
      await signupNormUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: 'user',
      });
      expect(alert).toHaveBeenCalledWith('Signup failed: API error');
    });
  });

  describe('GoogleSignup', () => {
    test('signs in and adds new user via API', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockResolvedValue({ user: mockUser });
      fetch
        .mockResolvedValueOnce({ ok: false, status: 404, json: jest.fn().mockResolvedValue({ error: 'Not found' }) }) // User does not exist
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ success: true }) }); // Add user
      await GoogleSignup('user');
      expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userId: mockUser.uid,
            email: mockUser.email,
            name: mockUser.displayName,
            role: 'user',
            authProvider: 'Google',
          }),
        })
      );
      expect(alert).toHaveBeenCalledWith('Signed in with Google!');
    });

    test('skips API add for existing user', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockResolvedValue({ user: mockUser });
      fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(mockUserData) });
      await GoogleSignup('user');
      expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
      expect(fetch).not.toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users',
        expect.any(Object)
      );
      expect(alert).toHaveBeenCalledWith('Signed in with Google!');
    });

    test('handles errors', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockRejectedValue(new Error('Google error'));
      await GoogleSignup('user');
      expect(console.error).toHaveBeenCalledWith('Google Sign-in Error:', expect.any(Error));
      expect(alert).toHaveBeenCalledWith('Google Sign-in failed: Google error');
    });
  });

  describe('loginNormUser', () => {
    test('logs in verified user', async () => {
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      const result = await loginNormUser({ email: 'test@example.com', password: 'password' });
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
      expect(alert).toHaveBeenCalledWith('Login successful!');
      expect(result).toBe(mockUser);
    });

    test('rejects unverified user', async () => {
      signInWithEmailAndPassword.mockResolvedValue({ user: { ...mockUser, emailVerified: false } });
      signOut.mockResolvedValue();
      await expect(loginNormUser({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Email not verified');
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(alert).toHaveBeenCalledWith('Please verify your email before logging in.');
    });

    test('handles login errors', async () => {
      signInWithEmailAndPassword.mockRejectedValue(new Error('Login error'));
      await expect(loginNormUser({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Login error');
      expect(console.error).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    });
  });

  describe('updateCredentials', () => {
    test('updates name', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await updateCredentials({ name: 'New Name' });
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'New Name' }),
        })
      );
      expect(alert).toHaveBeenCalledWith('Credentials updated successfully!');
    });

    test('updates email with password', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await updateCredentials({
        email: 'new@example.com',
        password: 'password',
      });
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ email: 'new@example.com', password: 'password' }),
        })
      );
      expect(alert).toHaveBeenCalledWith('Credentials updated successfully!');
    });

    test('updates password', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await updateCredentials({
        password: 'password',
        newpassword: 'newpassword',
      });
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ password: 'password', newpassword: 'newpassword' }),
        })
      );
      expect(alert).toHaveBeenCalledWith('Credentials updated successfully!');
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(updateCredentials({ name: 'New Name' })).rejects.toThrow('User not authenticated');
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Update error' }),
      });
      await expect(updateCredentials({ name: 'New Name' })).rejects.toThrow('Update error');
      expect(alert).toHaveBeenCalledWith('Error updating credentials: Update error');
    });
  });

  describe('deleteAccount', () => {
    test('deletes user via API and Firebase', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      deleteUser.mockResolvedValue();
      await deleteAccount('password');
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ currentPassword: 'password' }),
        })
      );
      expect(deleteUser).toHaveBeenCalledWith(mockUser);
      expect(alert).toHaveBeenCalledWith('Account deleted successfully!');
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(deleteAccount('password')).rejects.toThrow('User not authenticated');
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Delete error' }),
      });
      await expect(deleteAccount('password')).rejects.toThrow('Delete error');
      expect(alert).toHaveBeenCalledWith('Error deleting account: Delete error');
    });
  });

  describe('GoogleLogin', () => {
    test('logs in existing user', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockResolvedValue({ user: mockUser });
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      });
      await GoogleLogin();
      expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
      expect(fetch).toHaveBeenCalledWith(
        `https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/users/${mockUser.uid}`,
        expect.any(Object)
      );
      expect(alert).toHaveBeenCalledWith('Logged in with Google!');
    });

    test('rejects non-existing user', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockResolvedValue({ user: mockUser });
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'User not found' }),
      });
      await GoogleLogin();
      expect(alert).toHaveBeenCalledWith('User does not exist (likely a signup issue).');
    });

    test('handles errors', async () => {
      GoogleAuthProvider.mockReturnValue({ provider: 'google' });
      signInWithPopup.mockRejectedValue(new Error('Google error'));
      await GoogleLogin();
      expect(console.error).toHaveBeenCalledWith('Google Login Error:', expect.any(Error));
      expect(alert).toHaveBeenCalledWith('Google Login failed: Google error');
    });
  });

  describe('upsertSellerCard', () => {
    test('upserts seller card with image path', async () => {
      const cardData = {
        image: '/images/test.jpg',
        color: 'blue',
        description: 'Test card',
        genre: 'test',
        textColor: 'white',
        title: 'Test Card',
      };
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await upsertSellerCard(cardData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/sellers/card',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            ...cardData,
            userId: mockUser.uid,
          }),
        })
      );
    });

    test('upserts seller card with file upload', async () => {
      const file = new File(['content'], 'test.jpg');
      const cardData = {
        image: file,
        color: 'blue',
        description: 'Test card',
        genre: 'test',
        textColor: 'white',
        title: 'Test Card',
      };
      fetch
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ path: '/uploads/test.jpg' }) }) // uploadFile
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ success: true }) }); // upsert
      await upsertSellerCard(cardData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/sellers/card',
        expect.objectContaining({
          body: JSON.stringify({
            ...cardData,
            image: '/uploads/test.jpg',
            userId: mockUser.uid,
          }),
        })
      );
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(upsertSellerCard({})).rejects.toThrow('User not authenticated');
    });
  });

  describe('getSellerCard', () => {
    test('fetches seller card', async () => {
      const cardData = { title: 'Test Card' };
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(cardData),
      });
      const result = await getSellerCard();
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/sellers/card',
        expect.any(Object)
      );
      expect(result).toEqual(cardData);
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
      });
      await expect(getSellerCard()).rejects.toThrow('Not found');
    });
  });

  describe('deleteSellerCard', () => {
    test('deletes seller card', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await deleteSellerCard();
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/sellers/card',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Delete error' }),
      });
      await expect(deleteSellerCard()).rejects.toThrow('Delete error');
    });
  });

  describe('addProduct', () => {
    test('adds product with image file', async () => {
      const productData = {
        image: new File(['content'], 'product.jpg'),
        name: 'Test Product',
        price: 100,
      };
      fetch
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ path: '/uploads/product.jpg' }) }) // uploadFile
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ id: 'product123' }) }); // addProduct
      const result = await addProduct(productData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/products',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Product',
            price: 100,
            image: '/uploads/product.jpg',
          }),
        })
      );
      expect(result).toEqual({ id: 'product123' });
    });

    test('adds product without image', async () => {
      const productData = {
        name: 'Test Product',
        price: 100,
      };
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'product123' }),
      });
      const result = await addProduct(productData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/products',
        expect.objectContaining({
          body: JSON.stringify({
            name: 'Test Product',
            price: 100,
            image: null,
          }),
        })
      );
      expect(result).toEqual({ id: 'product123' });
    });
  });

  describe('getSellerProducts', () => {
    test('fetches seller products', async () => {
      const products = [{ id: 'product123', name: 'Test Product' }];
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(products),
      });
      const result = await getSellerProducts();
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/sellers/products',
        expect.any(Object)
      );
      expect(result).toEqual(products);
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      });
      await expect(getSellerProducts()).rejects.toThrow('Server error');
    });
  });

  describe('updateProduct', () => {
    test('updates product with image file', async () => {
      const productData = {
        id: 'product123',
        image: new File(['content'], 'product.jpg'),
        name: 'Updated Product',
        price: 150,
      };
      fetch
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ path: '/uploads/product.jpg' }) }) // uploadFile
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ success: true }) }); // updateProduct
      await updateProduct(productData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/products/product123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            image: '/uploads/product.jpg',
            name: 'Updated Product',
            price: 150,
          }),
        })
      );
    });

    test('updates product with image URL', async () => {
      const productData = {
        id: 'product123',
        image: '/images/product.jpg',
        name: 'Updated Product',
        price: 150,
      };
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      await updateProduct(productData);
      expect(fetch).toHaveBeenCalledWith(
        'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net/api/products/product123',
        expect.objectContaining({
          body: JSON.stringify({
            image: '/images/product.jpg',
            name: 'Updated Product',
            price: 150,
          }),
        })
      );
    });
  });

  describe('deleteProduct', () => {
    test('deletes product', async () => {
      deleteDoc.mockResolvedValue();
      await deleteProduct('product123');
      expect(doc).toHaveBeenCalledWith(db, 'Products', 'product123');
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    test('throws error if user not authenticated', async () => {
      auth.currentUser = null;
      await expect(deleteProduct('product123')).rejects.toThrow('User not authenticated');
    });

    test('handles Firestore errors', async () => {
      deleteDoc.mockRejectedValue(new Error('Delete error'));
      await expect(deleteProduct('product123')).rejects.toThrow('Delete error');
    });
  });
});