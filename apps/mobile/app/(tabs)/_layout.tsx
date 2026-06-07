import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppHeader from '@/components/AppHeader';
import TabSwitcher from '@/components/TabSwitcher';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          header: () => <AppHeader />,
          gestureEnabled: false, // Disable swipe-back gesture for all tab screens
          animation: 'none', // Disable animation between tab screens
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="wishlist"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="savings"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            gestureEnabled: true, // Enable gesture only for profile (has back button)
            animation: 'slide_from_right', // Profile slides in from right
          }}
        />
      </Stack>
      <TabSwitcher />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});
