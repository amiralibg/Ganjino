import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { User, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TEXT } from '@/constants/text';
import { BlurView } from 'expo-blur';

export default function AppHeader() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Determine which screen we're on
  const getScreenInfo = () => {
    if (pathname === '/wishlist') {
      return {
        title: TEXT.wishlist.title,
        subtitle: TEXT.wishlist.subtitle,
      };
    } else if (pathname === '/savings') {
      return {
        title: TEXT.history.title,
        subtitle: TEXT.history.subtitle,
      };
    } else if (pathname === '/history') {
      return {
        title: TEXT.history.title,
        subtitle: TEXT.history.subtitle,
      };
    } else if (pathname === '/profile') {
      return {
        title: TEXT.profile.title,
        subtitle: TEXT.profile.subtitle,
      };
    } else {
      // Default to calculate screen
      return {
        title: TEXT.calculate.title,
        subtitle: TEXT.calculate.subtitle,
      };
    }
  };

  const screenInfo = getScreenInfo();
  const isProfileScreen = pathname === '/profile';

  return (
    <View style={styles.container}>
      <BlurView
        intensity={isDark ? 50 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.headerContent,
          {
            backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            borderColor: theme.colors.glassBorder,
            borderBottomWidth: 1,
          },
        ]}
      >
        <View style={styles.titleContainer}>
           <Text style={[styles.title, styles.fontBold, { color: theme.colors.text }]}>
            {screenInfo.title}
          </Text>
          {screenInfo.subtitle && (
            <Text
              style={[styles.subtitle, styles.fontRegular, { color: theme.colors.textSecondary }]}
            >
              {screenInfo.subtitle}
            </Text>
          )}
        </View>

        <View style={styles.actionContainer}>
          {isProfileScreen && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: theme.colors.backgroundQuaternary,
                },
              ]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          {!isProfileScreen && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: theme.colors.backgroundQuaternary,
                },
              ]}
              onPress={() => router.push('/profile')}
            >
              <User size={22} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    justifyContent: 'center',
    paddingLeft: 16,
  },
  container: {
    overflow: 'hidden',
    zIndex: 100,
  },
  fontBold: {
    fontFamily: 'Vazirmatn_700Bold',
  },
  fontRegular: {
    fontFamily: 'Vazirmatn_400Regular',
  },
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row-reverse', // Persian layout
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    textAlign: 'right',
  },
  titleContainer: {
    flex: 1,
  },
});
