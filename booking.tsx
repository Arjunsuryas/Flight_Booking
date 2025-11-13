import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Plane, Calendar, MapPin, X } from 'lucide-react-native';

interface Booking {
  id: string;
  booking_reference: string;
  passenger_name: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
  flights: {
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: string;
 };
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.flightInfo}>
        <Text style={styles.airline}>
          {item.flights.airline} {item.flights.flight_number}
        </Text>
        <View style={styles.routeRow}>
          <Text style={styles.locationCode}>{item.flights.origin}</Text>
          <Plane color="#999" size={16} style={styles.planeIcon} />
          <Text style={styles.locationCode}>{item.flights.destination}</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Calendar color="#666" size={16} />
          <Text style={styles.detailText}>
            {formatDate(item.flights.departure_time)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>
            {formatTime(item.flights.departure_time)} - {formatTime(item.flights.arrival_time)}
          </Text>
        </View>
      </View>

      <View style={styles.passengerSection}>
        <Text style={styles.label}>Passenger</Text>
        <Text style={styles.value}>{item.passenger_name}</Text>
        <View style={styles.seatPrice}>
          <View>
            <Text style={styles.label}>Seat</Text>
            <Text style={styles.value}>{item.seat_number}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.price}>${item.total_price}</Text>
          </View>
        </View>
      </View>

      {item.status === 'confirmed' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item)}>
          <X color="#CC0000" size={18} />
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }
 try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      Alert.alert('Success', 'Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#00AA00';
      case 'cancelled':
        return '#CC0000';
      case 'completed':
        return '#666';
      default:
        return '#999';
    }
  };
const renderBookingCard = ({ item }: { item: Booking }) => (
          ]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.flightInfo}>
        <Text style={styles.airline}>
          {item.flights.airline} {item.flights.flight_number}
        </Text>
        <View style={styles.routeRow}>
          <Text style={styles.locationCode}>{item.flights.origin}</Text>
          <Plane color="#999" size={16} style={styles.planeIcon} />
          <Text style={styles.locationCode}>{item.flights.destination}</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Calendar color="#666" size={16} />
          <Text style={styles.detailText}>
            {formatDate(item.flights.departure_time)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>
            {formatTime(item.flights.departure_time)} - {formatTime(item.flights.arrival_time)}
          </Text>
        </View>
      </View>

      <View style={styles.passengerSection}>
        <Text style={styles.label}>Passenger</Text>
        <Text style={styles.value}>{item.passenger_name}</Text>
        <View style={styles.seatPrice}>
          <View>
            <Text style={styles.label}>Seat</Text>
            <Text style={styles.value}>{item.seat_number}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.price}>${item.total_price}</Text>
          </View>
        </View>
      </View>

      {item.status === 'confirmed' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item)}>
          <X color="#CC0000" size={18} />
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }
if (loading) {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  passengerSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  seatPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFE6E6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CC0000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
if (loading) {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  passengerSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  seatPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFE6E6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CC0000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
