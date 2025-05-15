//this page tests the firebase functions from firebase.js
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
    currentUser: null, // Initialize with null, can be set in tests
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
    auth.currentUser = mockUser; // Set mock user
    doc.mockReturnValue(mockDocRef);
    collection.mockReturnValue(mockCollectionRef);
    query.mockReturnValue(mockQuery);
    getAuth.mockReturnValue(auth);
    getFirestore.mockReturnValue(db);
    getStorage.mockReturnValue(storage);
    serverTimestamp.mockReturnValue('timestamp');
    global.console.log.mockClear();
    global.console.error.mockClear();
    global.alert.mockClear();
  });

  test('addUserToFirestore adds user data to Firestore', async () => {
    setDoc.mockResolvedValue();
    await addUserToFirestore(mockUser.uid, mockUser.email, mockUser.displayName, 'user', 'Firebase Auth');
    expect(doc).toHaveBeenCalledWith(db, 'Users', mockUser.uid);
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      Email: mockUser.email,
      Name: mockUser.displayName,
      joinedAt: 'timestamp',
      authProvider: 'Firebase Auth',
      Role: 'user',
    });
    expect(console.log).toHaveBeenCalledWith('User added to Firestore!');
  });

  test('addUserToFirestore handles errors', async () => {
    setDoc.mockRejectedValue(new Error('Firestore error'));
    await addUserToFirestore(mockUser.uid, mockUser.email, mockUser.displayName, 'user', 'Firebase Auth');
    expect(console.error).toHaveBeenCalledWith('Error adding user to Firestore:', expect.any(Error));
  });

  test('getUserData retrieves user data', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockUserData });
    const result = await getUserData();
    expect(doc).toHaveBeenCalledWith(db, 'Users', mockUser.uid);
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(result).toEqual(mockUserData);
  });

  test('getUserData throws error if user not authenticated', async () => {
    auth.currentUser = null;
    await expect(getUserData()).rejects.toThrow('User is not authenticated');
  });

  test('getUserData throws error if document does not exist', async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    await expect(getUserData()).rejects.toThrow('User document does not exist in Firestore');
  });

  test('getUserName retrieves user name', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockUserData });
    const result = await getUserName();
    expect(result).toBe(mockUserData.Name);
  });

  test('getUserName returns null on error', async () => {
    getDoc.mockRejectedValue(new Error('Firestore error'));
    const result = await getUserName();
    expect(console.error).toHaveBeenCalledWith('Error fetching user name:', expect.any(Error));
    expect(result).toBeNull();
  });

  test('getUserRole retrieves user role', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockUserData });
    const result = await getUserRole();
    expect(result).toBe(mockUserData.Role);
  });

  test('getUserRole returns null on error', async () => {
    getDoc.mockRejectedValue(new Error('Firestore error'));
    const result = await getUserRole();
    expect(console.error).toHaveBeenCalledWith('Error fetching user name:', expect.any(Error));
    expect(result).toBeNull();
  });

  test('getUserAuthProvider retrieves auth provider', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockUserData });
    const result = await getUserAuthProvider();
    expect(result).toBe(mockUserData.authProvider);
  });

  test('getUserAuthProvider returns null on error', async () => {
    getDoc.mockRejectedValue(new Error('Firestore error'));
    const result = await getUserAuthProvider();
    expect(console.error).toHaveBeenCalledWith('Error fetching user auth provider:', expect.any(Error));
    expect(result).toBeNull();
  });

  test('logout signs out user', async () => {
    signOut.mockResolvedValue();
    await logout();
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(console.log).toHaveBeenCalledWith('User signed out');
  });

  test('logout handles errors', async () => {
    signOut.mockRejectedValue(new Error('Sign out error'));
    await logout();
    expect(console.error).toHaveBeenCalledWith('Sign-out error:', expect.any(Error));
  });

  test('getRoleSize retrieves count of users with role', async () => {
    where.mockReturnValue({ role: 'admin' });
    getCountFromServer.mockResolvedValue(mockSnapshot);
    const result = await getRoleSize('admin');
    expect(collection).toHaveBeenCalledWith(db, 'Users');
    expect(where).toHaveBeenCalledWith('Role', '==', 'admin');
    expect(query).toHaveBeenCalledWith(mockCollectionRef, { role: 'admin' });
    expect(getCountFromServer).toHaveBeenCalledWith(mockQuery);
    expect(result).toBe(5);
  });

  test('getCollectionSize retrieves collection count', async () => {
    getCountFromServer.mockResolvedValue(mockSnapshot);
    const result = await getCollectionSize('Products');
    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(query).toHaveBeenCalledWith(mockCollectionRef);
    expect(getCountFromServer).toHaveBeenCalledWith(mockQuery);
    expect(result).toBe(5);
  });

  test('signupNormUser creates user and adds to Firestore', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    sendEmailVerification.mockResolvedValue();
    setDoc.mockResolvedValue();
    signupNormUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      role: 'user',
    });
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      Email: 'test@example.com',
      Name: 'Test User',
      joinedAt: 'timestamp',
      authProvider: 'Firebase Auth',
      Role: 'user',
    });
    expect(alert).toHaveBeenCalledWith('Account created! Please check your email for verification.');
  });

  test('signupNormUser returns error for mismatched passwords', async () => {
    const result = signupNormUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'different',
      role: 'user',
    });
    expect(result).toEqual({ success: false, message: 'Passwords do not match' });
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test('signupNormUser handles signup errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Signup error'));
    signupNormUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      role: 'user',
    });
    expect(alert).toHaveBeenCalledWith('Signup failed: Signup error');
  });

  test('signupNormUser handles verification email errors', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    sendEmailVerification.mockRejectedValue(new Error('Verification error'));
    signupNormUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      role: 'user',
    });
    expect(console.error).toHaveBeenCalledWith('Error sending verification email:', expect.any(Error));
    expect(alert).toHaveBeenCalledWith('Error sending verification email.');
  });

  test('GoogleSignup signs in and adds new user to Firestore', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockResolvedValue({
      user: mockUser,
      _tokenResponse: { isNewUser: true },
    });
    setDoc.mockResolvedValue();
    await GoogleSignup('user');
    expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      Email: mockUser.email,
      Name: mockUser.displayName,
      joinedAt: 'timestamp',
      authProvider: 'Google',
      Role: 'user',
    });
    expect(alert).toHaveBeenCalledWith('Signed in with Google!');
  });

  test('GoogleSignup skips Firestore for existing user', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockResolvedValue({
      user: mockUser,
      _tokenResponse: { isNewUser: false },
    });
    await GoogleSignup('user');
    expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
    expect(setDoc).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Signed in with Google!');
  });

  test('GoogleSignup handles errors', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockRejectedValue(new Error('Google error'));
    await GoogleSignup('user');
    expect(console.error).toHaveBeenCalledWith('Google Sign-in Error:', expect.any(Error));
    expect(alert).toHaveBeenCalledWith('Google Sign-in failed: Google error');
  });

  test('loginNormUser logs in verified user', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    const result = await loginNormUser({ email: 'test@example.com', password: 'password' });
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(alert).toHaveBeenCalledWith('Login successful!');
    expect(result).toBe(mockUser);
  });

  test('loginNormUser rejects unverified user', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { ...mockUser, emailVerified: false } });
    signOut.mockResolvedValue();
    await expect(loginNormUser({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Email not verified');
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(alert).toHaveBeenCalledWith('Please verify your email before logging in.');
  });

  test('loginNormUser handles login errors', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Login error'));
    await expect(loginNormUser({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Login error');
    expect(console.error).toHaveBeenCalledWith('Login failed:', expect.any(Error));
  });

  test('updateCredentials updates name only', async () => {
    updateDoc.mockResolvedValue();
    await updateCredentials({ name: 'New Name' });
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { Name: 'New Name' });
    expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
    expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    expect(updateEmail).not.toHaveBeenCalled();
    expect(updatePassword).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Name updated in Firestore.');
  });

  test('updateCredentials updates email only', async () => {
    updateDoc.mockResolvedValue();
    EmailAuthProvider.credential.mockReturnValue({ credential: 'cred' });
    reauthenticateWithCredential.mockResolvedValue();
    updateEmail.mockResolvedValue();
    await updateCredentials({
      email: 'new@example.com',
      password: 'password',
    });
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockUser.email, 'password');
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockUser, { credential: 'cred' });
    expect(updateEmail).toHaveBeenCalledWith(mockUser, 'new@example.com');
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { Email: 'new@example.com' });
    expect(updatePassword).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Email updated.');
  });

  test('updateCredentials updates password only', async () => {
    updateDoc.mockResolvedValue();
    EmailAuthProvider.credential.mockReturnValue({ credential: 'cred' });
    reauthenticateWithCredential.mockResolvedValue();
    updatePassword.mockResolvedValue();
    await updateCredentials({
      password: 'password',
      newpassword: 'newpassword',
    });
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockUser.email, 'password');
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockUser, { credential: 'cred' });
    expect(updatePassword).toHaveBeenCalledWith(mockUser, 'newpassword');
    expect(updateEmail).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalledWith(mockDocRef, expect.any(Object));
    expect(console.log).toHaveBeenCalledWith('Password updated.');
  });

  test('updateCredentials skips email update if same as current', async () => {
    updateDoc.mockResolvedValue();
    await updateCredentials({
      email: mockUser.email,
      password: 'password',
    });
    expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
    expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    expect(updateEmail).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test('updateCredentials handles errors', async () => {
    updateDoc.mockRejectedValue(new Error('Update error'));
    await expect(updateCredentials({ name: 'New Name' })).rejects.toThrow('Update error');
    expect(console.error).toHaveBeenCalledWith('Error updating credentials:', expect.any(Error));
  });

  test('updateCredentials handles reauthentication errors', async () => {
    EmailAuthProvider.credential.mockReturnValue({ credential: 'cred' });
    reauthenticateWithCredential.mockRejectedValue(new Error('Reauth error'));
    await expect(
      updateCredentials({
        email: 'new@example.com',
        password: 'password',
      })
    ).rejects.toThrow('Reauth error');
    expect(console.error).toHaveBeenCalledWith('Error updating credentials:', expect.any(Error));
  });

  test('deleteAccount deletes user and Firestore document', async () => {
    EmailAuthProvider.credential.mockReturnValue({ credential: 'cred' });
    reauthenticateWithCredential.mockResolvedValue();
    deleteDoc.mockResolvedValue();
    deleteUser.mockResolvedValue();
    await deleteAccount('password');
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockUser.email, 'password');
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockUser, { credential: 'cred' });
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
  });

  test('deleteAccount throws error if user not authenticated', async () => {
    auth.currentUser = null;
    await expect(deleteAccount('password')).rejects.toThrow('User not authenticated');
    expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
  });

  test('deleteAccount handles reauthentication errors', async () => {
    EmailAuthProvider.credential.mockReturnValue({ credential: 'cred' });
    reauthenticateWithCredential.mockRejectedValue(new Error('Reauth error'));
    await expect(deleteAccount('password')).rejects.toThrow('Reauth error');
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  test('GoogleLogin logs in existing user', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockUserData });
    await GoogleLogin();
    expect(signInWithPopup).toHaveBeenCalledWith(auth, { provider: 'google' });
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(alert).toHaveBeenCalledWith('Logged in with Google!');
  });

  test('GoogleLogin rejects non-existing user', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValue({ exists: () => false });
    await GoogleLogin();
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(alert).toHaveBeenCalledWith('User does not exist');
  });

  test('GoogleLogin handles errors', async () => {
    GoogleAuthProvider.mockReturnValue({ provider: 'google' });
    signInWithPopup.mockRejectedValue(new Error('Google error'));
    await GoogleLogin();
    expect(console.error).toHaveBeenCalledWith('Google Login Error:', expect.any(Error));
    expect(alert).toHaveBeenCalledWith('Google Login failed: Google error');
  });
});