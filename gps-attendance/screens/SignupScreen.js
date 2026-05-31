import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  View, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    registrationNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [coursesRawData, setCoursesRawData] = useState([]);
  
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://wibyyjdukskpqxktpllk.supabase.co/api/courses');
      const json = await response.json();
      if (json.status === 1) {
        setCoursesRawData(json.data);
      } else {
        Alert.alert('Error', 'Failed to retrieve academic criteria');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not load courses structure.');
    }
  };

  const getUniqueCourseCodes = () => {
    const uniqueCodes = [...new Set(coursesRawData.map(item => item.courseCode))];
    return uniqueCodes.map(code => ({ label: code, value: code }));
  };

  const getAvailableYears = () => {
    if (!selectedCourseCode) return [];
    const filtered = coursesRawData.filter(item => item.courseCode === selectedCourseCode);
    const uniqueYears = [...new Set(filtered.map(item => item.year))];
    return uniqueYears.map(year => ({ label: `Year ${year}`, value: year }));
  };

  const getAvailableSemesters = () => {
    if (!selectedCourseCode || !selectedYear) return [];
    const filtered = coursesRawData.filter(
      item => item.courseCode === selectedCourseCode && item.year === selectedYear
    );
    const uniqueSemesters = [...new Set(filtered.map(item => item.semester))];
    return uniqueSemesters.map(sem => ({ label: `Semester ${sem}`, value: sem }));
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignup = async () => {
    const emptyFields = Object.values(formData).some(field => field.trim() === '');
    if (emptyFields || !selectedCourseCode || !selectedYear || !selectedSemester) {
      Alert.alert('Error', 'Please complete all form fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstName: formData.firstname.trim(),
        lastName: formData.lastname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        registrationNumber: formData.registrationNumber.trim(),
        courseCode: selectedCourseCode,
        year: selectedYear, 
        semester: selectedSemester
      };

      const response = await fetch('http://192.168.0.104:8080/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.status === 1) {
        Alert.alert('Success', 'Account created successfully! Proceed to login.', [
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Signup Failed', json.message || 'An error occurred.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
        
        <View style={styles.brandContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register your credentials for geofenced tracking</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="First Name"
              placeholderTextColor="#94A3B8"
              value={formData.firstname}
              onChangeText={(val) => handleInputChange('firstname', val)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last Name"
              placeholderTextColor="#94A3B8"
              value={formData.lastname}
              onChangeText={(val) => handleInputChange('lastname', val)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val) => handleInputChange('email', val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            value={formData.password}
            onChangeText={(val) => handleInputChange('password', val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Registration Number"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            value={formData.registrationNumber}
            onChangeText={(val) => handleInputChange('registrationNumber', val)}
          />

          {/* Clean Style Dropdowns */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            itemContainerStyle={styles.dropdownItemContainer}
            activeColor="#EEF2F6"
            itemTextStyle={styles.itemText}
            data={getUniqueCourseCodes()}
            labelField="label"
            valueField="value"
            placeholder="Select Course Code"
            value={selectedCourseCode}
            onChange={item => {
              setSelectedCourseCode(item.value);
              setSelectedYear(null);
              setSelectedSemester(null);
            }}
          />

          <Dropdown
            style={[styles.dropdown, !selectedCourseCode && styles.disabledDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            itemContainerStyle={styles.dropdownItemContainer}
            activeColor="#EEF2F6"
            itemTextStyle={styles.itemText}
            data={getAvailableYears()}
            labelField="label"
            valueField="value"
            placeholder={selectedCourseCode ? "Select Year" : "Choose Course First"}
            value={selectedYear}
            disable={!selectedCourseCode}
            onChange={item => {
              setSelectedYear(item.value);
              setSelectedSemester(null);
            }}
          />

          <Dropdown
            style={[styles.dropdown, !selectedYear && styles.disabledDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            itemContainerStyle={styles.dropdownItemContainer}
            activeColor="#EEF2F6"
            itemTextStyle={styles.itemText}
            data={getAvailableSemesters()}
            labelField="label"
            valueField="value"
            placeholder={selectedYear ? "Select Semester" : "Choose Year First"}
            value={selectedSemester}
            disable={!selectedYear}
            onChange={item => setSelectedSemester(item.value)}
          />

          <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Account</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  scrollContainer: {
    padding: 24,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disabledDropdown: {
    opacity: 0.5,
    backgroundColor: '#F1F5F9',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.08)',
  },
  dropdownItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
    paddingBottom: 16,
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