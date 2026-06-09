import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';
import { englishToPersian } from '@/utils/numbers';

interface GoldRingProps {
  pct: number;
  size?: number;
  label?: string;
}

/**
 * GoldRing - a gold-fill circular progress ring (طلا progress signifier).
 */
export default function GoldRing({ pct, size = 76, label }: GoldRingProps) {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(100, pct));
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={theme.colors.primaryLight} />
            <Stop offset="1" stopColor={theme.colors.primary} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.cardElevated}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#goldRing)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.pct, { color: theme.colors.text }]}>
          {englishToPersian(String(Math.round(clamped)))}
          <Text style={styles.pctSign}>٪</Text>
        </Text>
        {label && (
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  label: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 9,
    marginTop: 1,
  },
  pct: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 17,
  },
  pctSign: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 11,
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
