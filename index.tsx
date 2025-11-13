import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Search, Plane, MapPin, Clock } from 'lucide-react-native';

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
  aircraft_type: string;
}

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    filterFlights();
  }, [searchQuery, flights]);

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .gte('departure_time', new Date().toISOString())
        .order('departure_time', { ascending: true });

      if (error) throw error;

      setFlights(data || []);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterFlights = () => {
    if (!searchQuery.trim()) {
      setFilteredFlights(flights);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = flights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(query) ||
        flight.destination.toLowerCase().includes(query) ||
        flight.airline.toLowerCase().includes(query) ||
        flight.flight_number.toLowerCase().includes(query)
    );
    setFilteredFlights(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFlights();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
};

  const renderFlightCard = ({ item }: { item: Flight }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/flight/${item.id}`)}>
      <View style={styles.cardHeader}>
        <View style={styles.airlineInfo}>
          <Plane color="#0066CC" size={20} />
          <Text style={styles.airline}>{item.airline}</Text>
        </View>
        <Text style={styles.flightNumber}>{item.flight_number}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationCode}>{item.origin}</Text>
          <Text style={styles.time}>{formatTime(item.departure_time)}</Text>
        </View>

        <View style={styles.flightPath}>
          <View style={styles.pathLine} />
          <Plane color="#999" size={16} />
          <View style={styles.pathLine} />
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationCode}>{item.destination}</Text>
          <Text style={styles.time}>{formatTime(item.arrival_time)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.detailsRow}>
          <Clock color="#666" size={14} />
          <Text style={styles.detailText}>
            {calculateDuration(item.departure_time, item.arrival_time)}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detailText}>
            {item.available_seats} seats left
          </Text>
        </View>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Flight</Text>
        <View style={styles.searchContainer}>
          <Search color="#999" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search flights, destinations..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredFlights}
        renderItem={renderFlightCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Plane color="#CCC" size={64} />
            <Text style={styles.emptyText}>No flights found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        }
      />
    </View>
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
  },header: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  airline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  flightNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },alignItems: 'center',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  flightPath: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  pathLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    fontSize: 14,
    color: '#CCC',
    marginHorizontal: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
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

 fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
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
