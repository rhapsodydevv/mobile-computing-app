import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const UserStorage = {

  // Save user
  saveUser: async (data) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
  },

  // Get full user
  getUser: async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Get token only
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  // Clear on logout
  clear: async () => {
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
};