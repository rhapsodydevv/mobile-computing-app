import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored data when the app opens
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Function to log in and save data
  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save auth data", error);
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
    } catch (error) {
      console.error("Failed to clear auth data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => useContext(AuthContext);