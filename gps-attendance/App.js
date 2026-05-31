import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen';
import SignupScreen from './screens/SignupScreen';
import StudentDashboardScreen from './screens/Student/StudentDashboardScreen';
import MyUnitsScreen from './screens/Student/MyUnitsScreen';
import HomeScreen from './screens/HomeScreen';

import AdminDashboardScreen from './screens/Admin/AdminDashboard';
import AttendanceHistoryScreen from './screens/Student/AttendanceHistoryScreen';
import StudentAnalyticsScreen from './screens/Student/StudentAnalyticsScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          
          
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Signup" component={SignupScreen}/>
          <Stack.Screen name="Student Dashboard" component={StudentDashboardScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="My Units" component={MyUnitsScreen}/>
          <Stack.Screen name="Analytics" component={StudentAnalyticsScreen}/>
          <Stack.Screen name="History" component={AttendanceHistoryScreen}/>
          <Stack.Screen name="Admin Dashboard" component={AdminDashboardScreen}/>
        
          
        
          
        </Stack.Navigator>
      </NavigationContainer>
    /**
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    */
  );
}


