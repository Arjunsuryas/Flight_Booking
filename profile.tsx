import React, { useState, useEffect } from 'react';
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFE6E6',
  },
  signOutButtonText: {
    color: '#CC0000',
    fontSize: 16,
    fontWeight: '600',
  },
});
if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };
 if (loading) {
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User color="#0066CC" size={48} />
          </View>
          <Text style={styles.userName}>{fullName || 'User'}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <User color="#666" size={20} />
              <Text style={styles.label}>Full Name</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Mail color="#666" size={20} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>
<Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Phone color="#666" size={20} />
              <Text style={styles.label}>Phone Number</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save color="#FFFFFF" size={20} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
 <View style={styles.actionSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut color="#CC0000" size={20} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
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
  inputDisabled: {
    backgroundColor: '#F9F9F9',
    color: '#999',
  }, backgroundColor: '#F9F9F9',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFE6E6',
  },
  signOutButtonText: {
    color: '#CC0000',
    fontSize: 16,
    fontWeight: '600',
  },
});

