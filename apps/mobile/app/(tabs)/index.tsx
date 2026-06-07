import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { use18KGoldPrice } from '@/lib/hooks/useGold';
import { Plus, Coins, TrendingUp } from 'lucide-react-native';
import AddGoalModal from '@/components/AddGoalModal';
import GoldPriceChart from '@/components/GoldPriceChart';
import { useTheme } from '@/contexts/ThemeContext';
import { TEXT, formatNumber } from '@/constants/text';
import StatCard from '@/components/ui/StatCard';
import DepthButton from '@/components/ui/DepthButton';
import AppHeader from '@/components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function CalculateScreen() {
  const { data: goldPrice, isLoading } = use18KGoldPrice();
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <AppHeader />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                styles.fontRegular,
                { color: theme.colors.textSecondary },
              ]}
            >
              {TEXT.calculate.fetchingGoldPrice}
            </Text>
          </View>
        ) : goldPrice ? (
          <>
            {/* Redesigned Gold Price Card with StatCard */}
            <StatCard
              icon={<Coins size={40} color={theme.colors.primary} strokeWidth={2.5} />}
              label={TEXT.calculate.goldPrice}
              value={`${formatNumber(goldPrice.price)} تومان`}
              subtext={TEXT.calculate.perGram}
              variant="primary"
              style={{ marginBottom: theme.spacing.lg }}
            />

            {/* Price trend indicator */}
            <View
              style={[
                styles.trendCard,
                {
                  backgroundColor: theme.colors.backgroundTertiary, // Cleaner look than elevated
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.lg,
                  borderColor: theme.colors.borderLight,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.trendHeader}>
                <TrendingUp size={20} color={theme.colors.success} strokeWidth={2.5} />
                <Text
                  style={[
                    styles.trendText,
                    styles.fontRegular,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {TEXT.calculate.priceMovement}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Coins size={48} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text
              style={[styles.errorText, styles.fontRegular, { color: theme.colors.textSecondary }]}
            >
              {TEXT.calculate.goldPriceError}
            </Text>
          </View>
        )}

        {/* Gold Price Chart */}
        {goldPrice && <GoldPriceChart days={30} />}

        {/* Redesigned Button with DepthButton */}
        <DepthButton
          onPress={() => setModalVisible(true)}
          disabled={!goldPrice}
          variant="primary"
          size="large"
          style={{ marginTop: theme.spacing.lg }}
          icon={<Plus size={24} color={theme.isDark ? '#0A0A0A' : '#FFFFFF'} strokeWidth={2.5} />}
          iconPosition="left"
        >
          {TEXT.calculate.addNewGoal}
        </DepthButton>
      </ScrollView>

      <AddGoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        goldPrice={goldPrice?.price}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  fontRegular: {
    fontFamily: 'Vazirmatn_400Regular',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  trendCard: {
    // Styles applied inline
  },
  trendHeader: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
  },
  trendText: {
    fontSize: 15,
  },
});
