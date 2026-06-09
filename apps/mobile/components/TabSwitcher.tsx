import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { NavSavingsIcon, NavHeartIcon, NavGoldIcon } from '@/components/icons/NavIcons';

type NavIconComponent = typeof NavSavingsIcon;

interface NavTab {
  name: string;
  route: Href;
  Icon: NavIconComponent;
}

// Dark warm-brown icon color sitting on the gold active circle
const ACTIVE_ICON_COLOR = '#3A2906';

// Spring used for the liquid glide/morph of the pills and gold blob
const LIQUID = LinearTransition.springify().damping(17).stiffness(170).mass(0.9);

export default function TabSwitcher() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isProfileScreen = pathname === '/profile';

  // Visual order, right → left in RTL: savings · goals · gold
  const tabs: NavTab[] = [
    { name: 'savings', route: '/savings', Icon: NavSavingsIcon },
    { name: 'wishlist', route: '/wishlist', Icon: NavHeartIcon },
    { name: 'index', route: '/', Icon: NavGoldIcon },
  ];

  const isActive = (route: Href) => {
    if (route === '/') return pathname === '/' || pathname === '/index';
    return pathname === route;
  };

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => isActive(t.route))
  );
  const before = tabs.slice(0, activeIndex); // lower index → rightmost in RTL
  const after = tabs.slice(activeIndex + 1);
  const activeTab = tabs[activeIndex];

  // Squash-then-bloom pulse on the gold blob each time the active tab changes,
  // giving the "liquid separating from the pill" feel.
  const blobScale = useSharedValue(1);
  useEffect(() => {
    blobScale.value = withSequence(
      withTiming(0.78, { duration: 110 }),
      withSpring(1, { damping: 8, stiffness: 130, mass: 0.7 })
    );
  }, [pathname, blobScale]);
  const blobAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: blobScale.value }] }));

  const navigate = (route: Href, active: boolean) => {
    if (!active) router.push(route);
  };

  const dynamicStyles = StyleSheet.create({
    blob: {
      alignItems: 'center',
      borderRadius: theme.radius.full,
      height: 60,
      justifyContent: 'center',
      width: 60,
    },
    container: {
      alignItems: 'center',
      bottom: 32,
      flexDirection: 'row-reverse',
      gap: 12,
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
    },
    hidden: {
      opacity: 0,
      transform: [{ translateY: 90 }],
    },
    pill: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      flexDirection: 'row-reverse',
      gap: 4,
      padding: 7,
    },
    slot: {
      alignItems: 'center',
      borderRadius: theme.radius.full,
      height: 46,
      justifyContent: 'center',
      width: 46,
    },
  });

  const renderPill = (items: NavTab[], key: string) => {
    if (items.length === 0) return null;
    return (
      <Animated.View
        key={key}
        layout={LIQUID}
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(140)}
        style={dynamicStyles.pill}
      >
        {items.map((tab) => {
          const { Icon, route, name } = tab;
          return (
            <TouchableOpacity
              key={name}
              activeOpacity={0.7}
              onPress={() => navigate(route, false)}
              style={dynamicStyles.slot}
            >
              <Icon size={26} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  };

  const ActiveIcon = activeTab.Icon;

  return (
    <Animated.View
      pointerEvents={isProfileScreen ? 'none' : 'auto'}
      layout={LIQUID}
      style={[dynamicStyles.container, isProfileScreen && dynamicStyles.hidden]}
    >
      {/* before-pill (rightmost in RTL) */}
      {renderPill(before, 'pill-right')}

      {/* gold blob — glides between positions, with a squash/bloom pulse */}
      <Animated.View key="blob" layout={LIQUID} style={blobAnimStyle}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigate(activeTab.route, true)}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={dynamicStyles.blob}
          >
            <ActiveIcon size={26} color={ACTIVE_ICON_COLOR} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* after-pill (leftmost in RTL) */}
      {renderPill(after, 'pill-left')}
    </Animated.View>
  );
}
