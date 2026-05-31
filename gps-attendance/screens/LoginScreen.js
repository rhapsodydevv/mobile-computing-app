import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStorage } from '../components/UserStorage';
import { supabase } from '../config/supabase'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email: email.trim().toLowerCase(),
        password: password
      };

      // Points data payloads to your production Supabase host instance
      const response = await fetch('https://wibyyjdukskpqxktpllk.supabase.co/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.status === 1) {
        await AsyncStorage.setItem('user', JSON.stringify(json.data));
        await UserStorage.saveUser(json.data);
        
        if (json.data.role === '[STUDENT]') {
          navigation.navigate('Student Dashboard');
        } else {
          navigation.navigate('Admin Dashboard');
        }
        
      } else {
        Alert.alert('Login Failed', json.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not reach server. Please check your connection.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        
        {/* BRAND IDENTITY */}
        <View style={styles.brandContainer}>
          <Text style={styles.title}>GPS Attendance</Text>
          <Text style={styles.subtitle}>Sign in to update your location presence</Text>
        </View>

        {/* FORM CONTAINER */}
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
          </TouchableOpacity>
        </View>

        {/* ROUTING ACTION */}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text></Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  linkHighlight: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});