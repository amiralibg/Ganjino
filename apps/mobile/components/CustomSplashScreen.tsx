import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashIconDark = require('../assets/icons/splash-icon-dark.png');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashIconLight = require('../assets/icons/splash-icon-light.png');

interface CustomSplashScreenProps {
  onReady: () => void;
}

export function CustomSplashScreen({ onReady }: CustomSplashScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [hasError, setHasError] = useState(false);

  const checkConnectivity = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        setHasError(true);
      } else {
        // Connection is good, proceed with app loading
        // Small delay to show splash screen smoothly
        setTimeout(() => {
          onReady();
        }, 500);
      }
    } catch {
      // If there's an error checking connectivity, proceed anyway
      onReady();
    }
  }, [onReady]);

  useEffect(() => {
    void checkConnectivity();
  }, [checkConnectivity]);

  const handleRetry = () => {
    setHasError(false);
    void checkConnectivity();
  };

  const backgroundColor = isDark ? '#0C0A09' : '#FAFAF9';
  const textColor = isDark ? '#FAFAF9' : '#0C0A09';
  const errorSubtextStyle = [styles.errorSubtext, { color: textColor }, styles.errorSubtextOpacity];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        source={isDark ? splashIconDark : splashIconLight}
        style={styles.logo}
        resizeMode="contain"
      />

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: textColor }]}>No internet connection</Text>
          <Text style={errorSubtextStyle}>Please check your connection and try again</Text>
          <View style={styles.retryButton}>
            <Text style={styles.retryText} onPress={handleRetry}>
              Retry
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    height,
    justifyContent: 'center',
    width,
  },
  errorContainer: {
    alignItems: 'center',
    bottom: 100,
    paddingHorizontal: 40,
    position: 'absolute',
  },
  errorSubtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorSubtextOpacity: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 18,

    marginBottom: 8,
    textAlign: 'center',
  },
  logo: {
    height: width * 0.5,
    maxHeight: 300,
    maxWidth: 300,
    width: width * 0.5,
  },
  retryButton: {
    backgroundColor: '#E6B422',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryText: {
    color: '#0C0A09',
    fontSize: 16,
  },
});
