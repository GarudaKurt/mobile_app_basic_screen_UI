import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../config/firebaseConfig';
import { doc, setDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,
  userMonitoringCollectionRef: null,
  userMonitoringData: [],
  userName: null,

  setUser: async (user) => {
    set({ user });
    if (user) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        const monitoringRef = collection(firestore, "users", user.uid, "monitoring");
        set({ userMonitoringCollectionRef: monitoringRef });

        await useAuthStore.getState().fetchUserMonitoringData(monitoringRef);
        await useAuthStore.getState().fetchUserName(user.uid);

      } catch (error) {
        console.error('Failed to store user:', error.message);
      }
    } else {
      try {
        await AsyncStorage.removeItem('user');
        set({ userMonitoringCollectionRef: null, userMonitoringData: [], userName: null });
      } catch (error) {
        console.error('Failed to remove user:', error.message);
      }
    }
  },

  fetchUserMonitoringData: async (monitoringRef) => {
    try {
      const querySnapshot = await getDocs(monitoringRef);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ userMonitoringData: data });
    } catch (error) {
      console.error('Error fetching monitoring data:', error.message);
    }
  },

  fetchUserName: async (uid) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({ userName: userData.name });  // Store the user's name
      }
    } catch (error) {
      console.error('Error fetching user name:', error.message);
    }
  },

  getUserEmail: () => {
    return useAuthStore.getState().user?.email || null;
  },

  getUserName: () => {
    return useAuthStore.getState().user?.name || null;
  },

  clearUser: async () => {
    set({ user: null, userMonitoringCollectionRef: null, userMonitoringData: [], userName: null });
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user:', error.message);
    }
  },

  initUserFromStorage: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const monitoringRef = collection(firestore, "users", parsedUser.uid, "monitoring");
        set({ user: parsedUser, userMonitoringCollectionRef: monitoringRef });

        await useAuthStore.getState().fetchUserMonitoringData(monitoringRef);
        await useAuthStore.getState().fetchUserName(parsedUser.uid);
      }
    } catch (error) {
      console.error('Failed to initialize user from storage:', error.message);
    }
  },

  signUp: async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(firestore, "users", userCredential.user.uid);
      const userData = { name, role, email, createdAt: new Date().toISOString() };
      await setDoc(userRef, userData);

      const monitoringRef = collection(firestore, "users", userCredential.user.uid, "monitoring");
      set({ 
        user: userCredential.user,
        userMonitoringCollectionRef: monitoringRef,
        userName: name
      });

      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      await useAuthStore.getState().fetchUserMonitoringData(monitoringRef);
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const monitoringRef = collection(firestore, "users", userCredential.user.uid, "monitoring");
      set({ 
        user: userCredential.user,
        userMonitoringCollectionRef: monitoringRef
      });

      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      await useAuthStore.getState().fetchUserMonitoringData(monitoringRef);
      await useAuthStore.getState().fetchUserName(userCredential.user.uid);
      
      return true;
    } catch (error) {
      console.error('Error during signin:', error.message);
      return false;
    }
  },

  logOut: async () => {
    try {
      await signOut(auth);
      set({ user: null, userMonitoringCollectionRef: null, userMonitoringData: [], userName: null });
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Error during signout:', error.message);
      return false;
    }
  },
}));
