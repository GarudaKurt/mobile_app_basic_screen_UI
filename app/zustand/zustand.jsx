import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database, firestore, auth } from "../config/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { ref, set, onValue } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Zustand store with Firebase authentication and AsyncStorage persistence
export const useAuthStore = create((set) => {
  const store = {
    user: null, // State to hold the current user object
    balance: 0, // New state to hold user balance

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

    // Set balance and persist to storage
    setBalances: async (addedBalance) => {
      set((state) => {
        const updatedBalance = state.balance + addedBalance;
    
        try {
          // Update Firebase Realtime Database
          const userBalanceRef = ref(database, "data/balance");
          set(userBalanceRef, updatedBalance)
            .then(() => console.log("Balance updated successfully in Firebase"))
            .catch((error) => console.error("Error updating balance in Firebase:", error));
    
          // Save balance locally
          AsyncStorage.setItem('balance', JSON.stringify(updatedBalance));
    
          return { balance: updatedBalance };
        } catch (error) {
          console.error('Failed to save balance:', error.message);
          return state;
        }
      });
    },
    

    clearUser: async () => {
      set({ user: null, balance: 0 });
      // Remove user and balance from AsyncStorage
      try {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('balance');
      } catch (error) {
        console.error('Failed to clear user or balance:', error.message);
      }
    },

    // Check if a user is already stored in AsyncStorage and set it to state on app load
    initUserFromStorage: async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          set({ user: JSON.parse(user) });
        }
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) {
          set({ balance: JSON.parse(storedBalance) });
          const stateRef = ref(database, "data/balance");
          set(stateRef, newState)
            .then(() => console.log("State updated successfully"))
            .catch((error) => console.error("Error updating state:", error));
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
        set({ user: null, balance: 0 });
        await AsyncStorage.removeItem('user'); // Remove user from AsyncStorage
        await AsyncStorage.removeItem('balance'); // Clear balance from storage too
        return true;
      } catch (error) {
        console.error('Error during signout:', error.message);
        return false;
      }
    },

    // Persist balance when updated
    persistBalance: async (newBalance) => {
      try {
        set({ balance: newBalance });
        await AsyncStorage.setItem('balance', JSON.stringify(newBalance));
      } catch (error) {
        console.error('Failed to store balance:', error.message);
      }
    }
  };

  // Initialize user and balance from storage immediately
  store.initUserFromStorage();

  return store;
});
