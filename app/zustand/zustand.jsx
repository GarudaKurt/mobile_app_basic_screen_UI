import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Zustand store with Firebase authentication and AsyncStorage persistence
export const useAuthStore = create((set) => ({
  user: null, // State to hold the current user object

  setUser: async (user) => {
    set({ user });
    // Persist user to AsyncStorage
    if (user) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to store user:', error.message);
      }
    } else {
      try {
        await AsyncStorage.removeItem('user');
      } catch (error) {
        console.error('Failed to remove user:', error.message);
      }
    }
  },

  clearUser: async () => {
    set({ user: null });
    // Remove user from AsyncStorage
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user:', error.message);
    }
  },

  // Check if a user is already stored in AsyncStorage and set it to state on app load
  initUserFromStorage: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        set({ user: JSON.parse(user) });
      }
    } catch (error) {
      console.error('Failed to initialize user from storage:', error.message);
    }
  },

  // Sign up a new user with email and password
  signUp: async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(firestore, "users", userCredential.user.uid);
      const userData = {
        name,
        role,
        email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, userData);

      set({ user: userCredential.user });
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user)); // Store user to AsyncStorage
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  },

  // Log in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user)); // Store user to AsyncStorage
      return true;
    } catch (error) {
      console.error('Error during signin:', error.message);
      return false;
    }
  },

  // Sign out the current user
  logOut: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      await AsyncStorage.removeItem('user'); // Remove user from AsyncStorage
      return true;
    } catch (error) {
      console.error('Error during signout:', error.message);
      return false;
    }
  },
}));
