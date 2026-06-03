import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { UserStorage } from '../../components/UserStorage';

export default function AdminDashboardScreen({ navigation }) {
  // State for layout & existing data logs
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form payload hooks matching backend payload directly
  const [unitCode, setUnitCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [startTime, setStartTime] = useState('2026-05-24T15:00:00');
  const [endTime, setEndTime] = useState('2026-05-25T00:00:00');

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  // View active sessions list
  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const user = await UserStorage.getUser();
      const response = await fetch('https://mobile-computing-app-production.up.railway.app/api/class-sessions/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();
      if (json.status === 1) {
        // Fallback or setup logic handling if structural data array wrapper exists
        setSessions(Array.isArray(json.data) ? json.data : [json.data].filter(Boolean));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not sync current active system state.');
    } finally {
      setLoading(false);
    }
  };

  // POST Request Action to push data
  const handleCreateSession = async () => {
    if (!unitCode || !roomName || !startTime || !endTime) {
      Alert.alert('Validation Error', 'Please complete all form fields.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await UserStorage.getUser();

      const payload = {
        unitCode: unitCode.trim().toUpperCase(),
        roomName: roomName.trim().toUpperCase(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      };

      const response = await fetch('https://mobile-computing-app-production.up.railway.app/api/class-sessions/new-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.status === 1) {
        Alert.alert('Success', json.message || 'Class session spawned successfully!');
        
        // Push the newly instantiated data trace immediately to UI list view state
        setSessions((prev) => [json.data, ...prev]);
        
        // Reset state & exit form contextual modal container
        setUnitCode('');
        setRoomName('');
        setModalOpen(false);
      } else {
        Alert.alert('Creation Failed', json.message || 'Check backend structural constraints.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not establish structural communication channel.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.unitCodeText}>{item.unitCode}</Text>
          <Text style={styles.unitNameText}>{item.unit?.unitName || 'Instructor Session'}</Text>
        </View>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.metaDivider} />

      <View style={styles.cardDetailsGrid}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>ROOM</Text>
          <Text style={styles.detailValue}>{item.classroomName || item.roomName}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>RADIUS</Text>
          <Text style={styles.detailValue}>{item.classroom?.radius || '50'}m</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>COURSE CODE</Text>
          <Text style={styles.detailValue}>{item.unit?.courseCode || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* ADMINISTRATIVE MAIN SCREEN CONTENT CONTAINER */}
      <View style={styles.mainContainer}>
        
        {/* TOP TITLE AREA */}
        <View style={styles.headerDashboard}>
          <View>
            <Text style={styles.badgeTop}>🔐 SECURITY ADMIN</Text>
            <Text style={styles.panelTitle}>Operations Hub</Text>
          </View>
          <TouchableOpacity style={styles.actionAddButton} onPress={() => setModalOpen(true)}>
            <Text style={styles.actionAddButtonText}>+ New Session</Text>
          </TouchableOpacity>
        </View>

        {/* ADMIN ANALYTICS GRID TRACKERS */}
        <View style={styles.statsPanel}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{sessions.length}</Text>
            <Text style={styles.statSubText}>Active Geofences</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: '#EEF2F6' }]}>
            <Text style={[styles.statNum, { color: '#4F46E5' }]}>OK</Text>
            <Text style={styles.statSubText}>API Link Status</Text>
          </View>
        </View>

        <Text style={styles.listSectionTitle}>Live Monitoring Queues</Text>

        {/* LIVE TRACKING RENDER FLOW */}
        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item, index) => item.classSessionId || index.toString()}
            renderItem={renderSessionItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No tracking configurations active.</Text>
                <Text style={styles.emptySub}>Tap "+ New Session" to create data configurations.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* COMPONENT CREATION MODAL CONTAINER */}
      <Modal animationType="slide" transparent={true} visible={modalOpen}>
        <View style={styles.overlayModalContainer}>
          <View style={styles.modalFormCard}>
            
            <View style={styles.modalTopHeader}>
              <Text style={styles.modalHeadingText}>Spawn Class Geofence</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Text style={styles.closeIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView bounces={false} style={styles.formScrollContainer}>
              <Text style={styles.formLabel}>Unit Code</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. SMA213"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={unitCode}
                onChangeText={setUnitCode}
              />

              <Text style={styles.formLabel}>Room / Classroom Location Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. HRD-201"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={roomName}
                onChangeText={roomName => setRoomName(roomName)}
              />

              <Text style={styles.formLabel}>Start Timestamp (ISO-8601)</Text>
              <TextInput
                style={styles.formInput}
                value={startTime}
                onChangeText={setStartTime}
              />

              <Text style={styles.formLabel}>End Timestamp (ISO-8601)</Text>
              <TextInput
                style={styles.formInput}
                value={endTime}
                onChangeText={setEndTime}
              />

              <TouchableOpacity 
                style={[styles.formSubmitButton, submitting && styles.disabledBtn]} 
                onPress={handleCreateSession}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.formSubmitButtonText}>Instantiate Live Boundary</Text>
                )}
              </TouchableOpacity>
            </ScrollView>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeTop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  actionAddButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionAddButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statsPanel: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  statSubText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unitCodeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  unitNameText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    verticalMargin: 12,
    marginVertical: 12,
  },
  cardDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  overlayModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    justifyContent: 'flex-end',
  },
  modalFormCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeadingText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeIconText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  formScrollContainer: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
    fontWeight: '500',
  },
  formSubmitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  formSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});