import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plane,
  Clock,
  Calendar,
  Users,
  ArrowLeft,
  MapPin,
} from 'lucide-react-native';

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  total_seats: number;
  aircraft_type: string;
}

export default function FlightDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);  const [booking, setBooking] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  useEffect(() => {
    fetchFlight();
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setPassengerName(data.full_name || '');
      setPassengerEmail(data.email || '');
      setPassengerPhone(data.phone || '');
    }
  };

  const fetchFlight = async () => {
    try {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setFlight(data);
    } catch (error) {
      console.error('Error fetching flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSeatNumber = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const number = Math.floor(Math.random() * 30) + 1;
    return `${number}${row}`;
  };

const handleBooking = async () => {
    if (!flight || !user) return;

    if (!passengerName || !passengerEmail || !passengerPhone) {
      Alert.alert('Error', 'Please fill in all passenger details');
      return;
    }

    if (flight.available_seats <= 0) {
      Alert.alert('Error', 'No available seats on this flight');
      return;
    }

    setBooking(true);

    try {
      const { data: refData } = await supabase.rpc('generate_booking_reference');
      const bookingReference =
        refData || `BK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        flight_id: flight.id,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_phone: passengerPhone,
        seat_number: generateSeatNumber(),
        booking_reference: bookingReference,
        total_price: flight.price,
        status: 'confirmed',
      });

      if (bookingError) throw bookingError;

      const { error: updateError } = await supabase
        .from('flights')
        .update({ available_seats: flight.available_seats - 1 })
        .eq('id', flight.id);

      if (updateError) throw updateError;
  Alert.alert('Success', 'Booking confirmed!', [
      setBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const diff = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (!flight) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Flight not found</Text>
      </View>
    );
  }

  return (<View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.flightCard}>
          <View style={styles.flightHeader}>
            <View style={styles.airlineInfo}>
              <Plane color="#0066CC" size={24} />
              <View>
                <Text style={styles.airline}>{flight.airline}</Text>
                <Text style={styles.flightNumber}>{flight.flight_number}</Text>
              </View>
            </View>
          </View>

          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <Text style={styles.locationCode}>{flight.origin}</Text>
              <Text style={styles.dateText}>{formatDate(flight.departure_time)}</Text>
              <Text style={styles.timeText}>{formatTime(flight.departure_time)}</Text>
            </View>

            <View style={styles.routeMiddle}>
              <View style={styles.routeLine} />
              <View style={styles.durationBadge}>
                <Clock color="#666" size={14} />
                <Text style={styles.durationText}>
                  {calculateDuration(flight.departure_time, flight.arrival_time)}
                </Text>
              </View>
              <View style={styles.routeLine} />
            </View>

            <View style={styles.routePoint}>
              <Text style={styles.locationCode}>{flight.destination}</Text>
              <Text style={styles.dateText}>{formatDate(flight.arrival_time)}</Text>
              <Text style={styles.timeText}>{formatTime(flight.arrival_time)}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Users color="#666" size={20} />
              <Text style={styles.detailLabel}>Available Seats</Text>
              <Text style={styles.detailValue}>
                {flight.available_seats} / {flight.total_seats}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Plane color="#666" size={20} />
              <Text style={styles.detailLabel}>Aircraft</Text>
              <Text style={styles.detailValue}>{flight.aircraft_type}</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceValue}>${flight.price}</Text>
          </View>
        </View>

        <View style={styles.passengerForm}>
          <Text style={styles.formTitle}>Passenger Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter passenger name"
              placeholderTextColor="#999"
              value={passengerName}
               <View style={styles.priceSection}>
        <View style={styles.passengerForm}>
          <Text style={styles.formTitle}>Passenger Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter passenger name"
              placeholderTextColor="#999"
              value={passengerName}
              onChangeText={setPassengerName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              value={passengerEmail}
              onChangeText={setPassengerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={passengerPhone}
              onChangeText={setPassengerPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, booking && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={booking || flight.available_seats <= 0}>
          {booking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>
              {flight.available_seats <= 0 ? 'Sold Out' : 'Book Flight'}
            </Text>
          )}
        </TouchableOpacity>  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  flightCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  flightHeader: {
    marginBottom: 24,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  airline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  flightNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  routeSection: { marginBottom: 24,
  routeMiddle: {
    alignItems: 'center',
    marginVertical: 8,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceLabel: {
    fontSize: 16,
    color: '#6666priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066CC',
  },
  passengerForm: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#0066CC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});


  const [booking, setBooking] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
