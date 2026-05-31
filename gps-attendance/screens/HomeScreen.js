import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        
        {/* TOP WELCOME ANCHOR */}
        <View style={styles.heroSection}>
          
          <Text style={styles.mainTitle}>Smart Attendance Verification</Text>
          <Text style={styles.description}>
            Log your lecture attendances instantly 
          </Text>
        </View>

        {/* WORKFLOW ENTRY SELECTIONS */}
        <View style={styles.actionCard}>
          
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Log In to Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.secondaryButtonText}>Create New Student Account</Text>
          </TouchableOpacity>
        </View>

       

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
    paddingHorizontal: 24,
    justifyContent: 'top',
    paddingVertical: 100,
  
  },
  heroSection: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 50
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 22,
    fontWeight: '500',
   
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  footerInfo: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});