import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { Coins, Heart, History } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { TEXT } from '@/constants/text';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TabSwitcher() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isProfileScreen = pathname === '/profile';

  const tabs: Array<{ name: string; route: Href; icon: typeof Coins; label: string }> = [
    { name: 'index', route: '/', icon: Coins, label: TEXT.navigation.calculate },
    { name: 'wishlist', route: '/wishlist', icon: Heart, label: TEXT.navigation.wishlist },
    { name: 'savings', route: '/savings', icon: History, label: TEXT.navigation.history },
  ];

  // Helper function to get tab background color
  const getTabBackgroundColor = (isFocused: boolean) => ({
    backgroundColor: isFocused ? theme.colors.primary + '26' : 'transparent',
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      borderColor: theme.colors.borderLight,
      borderRadius: 32,
      borderWidth: 1.5,
      bottom: 42,
      overflow: 'hidden',
      position: 'absolute',
      width: '90%',
    },
    glowOuter: {
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: theme.isDark ? 0.5 : 0.3,
          shadowRadius: 24,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    hiddenContainer: {
      opacity: 0,
      transform: [{ translateY: 80 }],
    },
    hiddenInner: {
      opacity: 0,
    },
    innerContainer: {
      alignItems: 'center',
      backgroundColor: theme.isDark ? theme.colors.cardElevated : theme.colors.cardElevated + 'E0',
      borderRadius: 30,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    text: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 14,

      marginLeft: 6,
    },
  });

  return (
    <View
      pointerEvents={isProfileScreen ? 'none' : 'auto'}
      style={[
        dynamicStyles.container,
        dynamicStyles.glowOuter,
        isProfileScreen && dynamicStyles.hiddenContainer,
      ]}
    >
      <View style={[dynamicStyles.innerContainer, isProfileScreen && dynamicStyles.hiddenInner]}>
        {tabs.map((tab) => {
          const isFocused = pathname === tab.route;
          const Icon = tab.icon;

          const onPress = () => {
            if (!isFocused) {
              router.push(tab.route);
            }
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              key={tab.name}
              onPress={onPress}
              style={[styles.tabItem, getTabBackgroundColor(isFocused)]}
            >
              <Icon
                size={20}
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                strokeWidth={2.5}
              />
              {isFocused && (
                <Animated.Text
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={dynamicStyles.text}
                >
                  {tab.label}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    borderRadius: 28,
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 20,
    transform: [{ scale: 1 }],
  },
});
