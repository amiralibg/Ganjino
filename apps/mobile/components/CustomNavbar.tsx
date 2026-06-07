import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Coins, Heart, History } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { TEXT } from '@/constants/text';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors: _descriptors,
  navigation,
}) => {
  const { theme } = useTheme();

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
          // Enhanced glow effect for depth
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
    innerContainer: {
      alignItems: 'center',
      // Layered background for depth
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
      fontSize: 14,

      marginLeft: 6,
    },
  });

  const getIconByRouteName = (routeName: string, color: string) => {
    const size = 20; // Slightly larger icons
    const strokeWidth = 2.5; // Bolder strokes for clarity

    switch (routeName) {
      case 'index':
        return <Coins size={size} color={color} strokeWidth={strokeWidth} />;
      case 'wishlist':
        return <Heart size={size} color={color} strokeWidth={strokeWidth} />;
      case 'history':
        return <History size={size} color={color} strokeWidth={strokeWidth} />;
      default:
        return <Coins size={size} color={color} strokeWidth={strokeWidth} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return TEXT.navigation.calculate;
      case 'wishlist':
        return TEXT.navigation.wishlist;
      case 'history':
        return TEXT.navigation.history;
      default:
        return routeName;
    }
  };

  return (
    <View style={[dynamicStyles.container, dynamicStyles.glowOuter]}>
      <View style={dynamicStyles.innerContainer}>
        {state.routes.map((route, index) => {
          if (['_sitemap', '+not-found', 'profile'].includes(route.name)) return null;

          const label = getLabel(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, getTabBackgroundColor(isFocused)]}
            >
              {getIconByRouteName(
                route.name,
                isFocused ? theme.colors.primary : theme.colors.textSecondary
              )}
              {isFocused && (
                <Animated.Text
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={dynamicStyles.text}
                >
                  {label as string}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    borderRadius: 28,
    flexDirection: 'row',
    fontFamily: 'Vazirmatn_700Bold',
    gap: 8,
    height: 48,
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 20,
    // Add subtle press feedback
    transform: [{ scale: 1 }],
  },
});

export default CustomNavBar;
