import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native";
import SessionCard from "../components/SessionCard";
import ActionCard from "../components/ActionCard";
import { useAuth } from "../components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStorage } from "../components/UserStorage";
import axios from "axios";
import * as Location from "expo-location"

export default function HomeScreen({ navigation }) {
  const [role, setRole] = useState("student"); // later from JWT
  const [activeSession, setActiveSession] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [sessionId, setSessionId] = useState();
  
  useEffect(() => {
    const loadUserData = async() => {
      try{
        const user = await UserStorage.getUser();
        if (user) {
          setFirstName(user.firstName);
          setEmail(user.email);
          setRegistrationNumber(user.registrationNumber);
          setToken(user.token)
        
        }

        const response = await fetch('https://wibyyjdukskpqxktpllk.supabase.co/api/class-sessions/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        
        });

        const sessionJson = await response.json();

        if (sessionJson.status === 1) {
          setActiveSession(sessionJson.data);
          setSessionId(sessionJson.data.classSessionId)
        } else {
          setActiveSession(null); // Clear or handle if no active session found
          console.log(sessionJson.message);
        }


      }catch{
        console.error("Error loading active session", error)
      }
    }
    loadUserData();
  }, []);

  const getAndSendLocation = async () => {
    if (!sessionId) {
      Alert.alert("Error", "No active class session ID provided.");
      return;
    }
    if (!registrationNumber || !token) {
      Alert.alert("Error", "User details are still loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // 1. Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "Allow location access to mark attendance.");
        setLoading(false);
        return;
      }

      // 2. Get high accuracy device location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      console.log("Captured Coordinates: ", latitude, longitude);

      // 3. Match the expected payload formatting exactly
      const payload = {
        studentLatitude: latitude.toString(),
        studentLongitude: longitude.toString(),
        classSessionId: sessionId,
        registrationNumber: registrationNumber
      };

      // 4. Send POST request with auth tokens
      const response = await axios.post(
        'https://wibyyjdukskpqxktpllk.supabase.co/api/attendance', // Updated to match your attendance endpoint context
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      Alert.alert("Success", "Attendance marked successfully!");
      navigation.goBack(); // Navigate back to safety after successful validation

    } catch (error) {
      console.error("Attendance Error: ", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Something went wrong verifying your location.";
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }

  
  
  

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back, {firstName || "User"}</Text>
        <Text style={styles.subtitle}>
            {email}
          
        </Text>
      </View>

      {/* ACTIVE SESSION */}
      <Text style={styles.sectionTitle}>Active Class</Text>

      {activeSession ? (
        <SessionCard session={activeSession} role={role} navigation={navigation} />
      ) : (
        <Text style={styles.noSession}>No active session</Text>
      )}

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      

      <View style={styles.actionsRow}>
        {role === "student" ? (
          <>
          <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={getAndSendLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify & Mark Attendance</Text>
        )}
      </TouchableOpacity>

            <ActionCard
              title="Mark Attendance"
              icon="📍"
              onPress={()=> {sessionJson.data}
              }
            />
            <ActionCard
              title="My Attendance"
              icon="📊"
              onPress={() => navigation.navigate("AttendanceHistory")}
            />
          </>
        ) : (
          <>
            <ActionCard
              title="Create Session"
              icon="➕"
              onPress={() => navigation.navigate("CreateSession")}
            />
            <ActionCard
              title="View Attendance"
              icon="📋"
              onPress={() => navigation.navigate("AttendanceHistory")}
            />
          </>
        )}
      </View>

      {/* RECENT ACTIVITY (placeholder) */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.activityBox}>
        <Text style={{ color: "#888" }}>
          No recent activity yet...
        </Text>
      </View>

    </ScrollView>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: "",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#598697",
    marginTop: 5,
  },
  sectionTitle: {
    color: "#E8E9E9",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noSession: {
    color: "#888",
    marginBottom: 10,
  },
  activityBox: {
    backgroundColor: "#1C2D35",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});



{/** 
import { useNavigation } from "@react-navigation/native";
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location"
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/app.config";



export default function DashboardScreen(){
    const navigation = useNavigation();
    const BASE_URL = "http://192.168.100.164:8080/api";
    //const BASE_URL = "http://10.141.198.1:8080/api";

    const [data, setData] = useState([])
    const [units, setUnits] = useState([]); 
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();

    
    const getAndSendLocation = async () =>{
        try{
            //Request permission
            const {status} = await Location.requestForegroundPermissionsAsync();
             
            if(status !== 'granted'){
                Alert.alert("Permission denied", "Allow location access")
                return;
            }

            //Get location
            const location = await Location.getCurrentPositionAsync({})
            const{latitude, longitude} = location.coords

            setLatitude(latitude);
            setLongitude(longitude);

            const response = await axios.post(`${BASE_URL}/attendance`, {
                latitude: latitude,
                longitude: longitude,
                
            })

            console.log("Location: ", latitude, longitude)

            Alert.alert("Success", "Attendance marked!")
        } catch (error){
            console.error(error);
            Alert.alert("Error", "Something went wrong")
        }
    }

    useEffect(() => {
    fetchUnits();
    }, []);

    const fetchUnits = async ()=> {
        try{
            const response = await axios.get(`${BASE_URL}/units`)
            setUnits(response.data.data);
        }
        catch(error){
            console.error("Error fetching units:", error);
        }
    };

    const renderUnit = ({item}) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.unitCode}</Text>
            <Text style={styles.cell}>{item.unitName}</Text>
            <Text style={styles.cell}>{item.lecturer}</Text>
            <Text style={styles.cell}>{item.startTime}</Text>
            <Text style={styles.cell}>{item.endTime}</Text>

            <TouchableOpacity
            style={styles.button}
            >
                <Text style={styles.buttonText} onPress={()=> {getAndSendLocation()}}>Mark</Text>
            </TouchableOpacity>
        </View>
        
    )

    return(
        <>
        <View style={styles.container}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Unit Code</Text>
                                <Text style={styles.headerText}>Unit Name</Text>
                                <Text style={styles.headerText}>Lecturer</Text>
                                <Text style={styles.headerText}>Start Time</Text>
                                <Text style={styles.headerText}>End Time</Text>
                            </View>
        
                            <FlatList
                                data={units}
                                keyExtractor={(item) => item.unitCode}
                                renderItem={renderUnit}
                            />
                        </View>
                    </ScrollView>
        
                </View>
        
        
        </>
    )
}


const styles = StyleSheet.create({
  container: {

    padding: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#598697',
    padding: 10,
  },
  headerText: {
    width: 150, // ✅ fixed width for horizontal scroll
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    width: 150,
    padding: 5 // ✅ must match header
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

*/}