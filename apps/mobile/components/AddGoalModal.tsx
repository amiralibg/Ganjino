import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coins, Clock } from 'lucide-react-native';
import { useCreateGoal } from '@/lib/hooks/useGoals';
import { useProfile } from '@/lib/hooks/useProfile';
import { useTheme } from '@/contexts/ThemeContext';
import { showToast } from '@/lib/toast';
import { formatGoldWeight } from '@/lib/utils/goldUnits';
import GlassInput from './ui/GlassInput';
import DepthButton from './ui/DepthButton';
import StatCard from './ui/StatCard';
import ThemedSwitch from './ui/ThemedSwitch';
import AppBottomSheet from './ui/AppBottomSheet';
import { TEXT, formatNumber, formatDecimal } from '@/constants/text';
import { persianToEnglish, formatPriceInput } from '@/utils/numbers';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goldPrice?: number;
}

export default function AddGoalModal({ visible, onClose, goldPrice }: AddGoalModalProps) {
  const createGoal = useCreateGoal();
  const { data: profile } = useProfile();
  const { theme } = useTheme();

  const [goalName, setGoalName] = useState('');
  const [goalPrice, setGoalPrice] = useState('');
  const [wishlistEnabled, setWishlistEnabled] = useState(true);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [recurringDay, setRecurringDay] = useState('1');

  const handlePriceChange = (text: string) => {
    setGoalPrice(formatPriceInput(text));
  };

  const getPriceValue = useCallback((): number => {
    const englishPrice = persianToEnglish(goalPrice);
    const cleanedPrice = englishPrice.replace(/[^\d]/g, '');
    return parseInt(cleanedPrice) || 0;
  }, [goalPrice]);

  const goldEquivalent = goalPrice && goldPrice ? getPriceValue() / goldPrice : 0;
  const goldWeightFormatted = goldEquivalent > 0 ? formatGoldWeight(goldEquivalent) : null;

  // Timeline estimate from the user's monthly savings settings.
  const timelineEstimate = useMemo(() => {
    if (!profile || !goldPrice || !goalPrice || goldEquivalent <= 0) {
      return null;
    }

    const salary = profile.monthlySalary;
    const savingsPercentage = profile.monthlySavingsPercentage;
    if (salary <= 0 || savingsPercentage <= 0) {
      return null;
    }

    const price = getPriceValue();
    const monthlySavings = (salary * savingsPercentage) / 100;
    const monthsToSave = price / monthlySavings;

    const years = Math.floor(monthsToSave / 12);
    const months = Math.floor(monthsToSave % 12);

    let timelineText = '';
    if (monthsToSave === 0) {
      timelineText = TEXT.timeline.goalReached;
    } else if (years > 0) {
      timelineText = TEXT.timeline.yearsToSave(years, months);
    } else if (months > 0) {
      timelineText = TEXT.timeline.monthsToSave(months);
    } else {
      const days = Math.ceil(monthsToSave * 30);
      timelineText = TEXT.timeline.daysToSave(days);
    }

    return { monthsToSave, monthlySavings, timelineText };
  }, [profile, goldPrice, goalPrice, goldEquivalent, getPriceValue]);

  const handleAddGoal = async () => {
    if (!goalName || !goalPrice) {
      showToast.error(TEXT.common.error, TEXT.calculate.enterGoalAndPrice);
      return;
    }

    const price = getPriceValue();
    if (isNaN(price) || price <= 0) {
      showToast.error(TEXT.common.error, TEXT.calculate.enterValidPrice);
      return;
    }

    try {
      await createGoal.mutateAsync({
        name: goalName,
        price,
        isWishlisted: wishlistEnabled,
        savedGoldAmount: 0,
        recurringPlan: {
          enabled: recurringEnabled,
          frequency: recurringFrequency,
          dayOfWeek:
            recurringFrequency === 'weekly'
              ? Number(persianToEnglish(recurringDay || '0'))
              : undefined,
          dayOfMonth:
            recurringFrequency === 'monthly'
              ? Number(persianToEnglish(recurringDay || '1'))
              : undefined,
          reminderHour: 20,
        },
      });

      showToast.success(
        TEXT.calculate.goalAdded,
        wishlistEnabled ? TEXT.calculate.addedToWishlist : TEXT.calculate.goalSaved
      );
      resetForm();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string }; message?: string } })?.response?.data
          ?.error ||
        (error as { message?: string })?.message ||
        TEXT.calculate.addGoalError;
      showToast.error(TEXT.common.error, errorMessage);
    }
  };

  const resetForm = () => {
    setGoalName('');
    setGoalPrice('');
    setWishlistEnabled(true);
    setRecurringEnabled(false);
    setRecurringFrequency('monthly');
    setRecurringDay('1');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const styles = StyleSheet.create({
    helpText: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 13,
      lineHeight: 19,
      marginTop: 4,
      textAlign: 'right',
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'right',
    },
    segment: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    segmentButton: {
      flex: 1,
    },
    toggleRow: {
      alignItems: 'center',
      backgroundColor: theme.colors.inset,
      borderColor: theme.colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    toggleTextWrap: {
      flex: 1,
      marginRight: 12,
    },
    toggleTitle: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 15,
      textAlign: 'right',
    },
  });

  const footer = (
    <DepthButton
      onPress={handleAddGoal}
      disabled={!goalName || goldEquivalent <= 0 || createGoal.isPending}
      variant="primary"
      size="large"
    >
      {createGoal.isPending ? TEXT.common.loading : TEXT.common.save}
    </DepthButton>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={handleClose}
      title={TEXT.calculate.newGoal}
      footer={footer}
    >
      {/* Goal name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{TEXT.calculate.goalName}</Text>
        <GlassInput
          placeholder={TEXT.calculate.goalNamePlaceholder}
          value={goalName}
          onChangeText={setGoalName}
        />
      </View>

      {/* Price */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{TEXT.calculate.price}</Text>
        <GlassInput
          icon={<Coins size={20} color={theme.colors.textSecondary} strokeWidth={2.5} />}
          placeholder="0"
          value={goalPrice}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
        />
      </View>

      {/* Live gold equivalent */}
      {goldWeightFormatted && (
        <StatCard
          icon={<Coins size={32} color={theme.colors.primary} strokeWidth={2.5} />}
          label={TEXT.calculate.goldEquivalent}
          value={`${formatDecimal(goldWeightFormatted.primary.value)} ${goldWeightFormatted.primary.unit}`}
          subtext={
            goldWeightFormatted.secondary
              ? `(${formatDecimal(goldWeightFormatted.secondary.value)} ${goldWeightFormatted.secondary.unit})`
              : undefined
          }
          variant="primary"
          style={styles.inputGroup}
        />
      )}

      {/* Timeline estimate */}
      {timelineEstimate && (
        <StatCard
          icon={<Clock size={28} color={theme.colors.success} strokeWidth={2.5} />}
          label={TEXT.timeline.canBuy}
          value={timelineEstimate.timelineText}
          subtext={`${formatNumber(timelineEstimate.monthlySavings)} ${TEXT.wishlist.toman} / ${TEXT.common.month}`}
          variant="success"
          style={styles.inputGroup}
        />
      )}

      {/* Add to wishlist toggle */}
      <View style={styles.toggleRow}>
        <ThemedSwitch value={wishlistEnabled} onValueChange={setWishlistEnabled} />
        <View style={styles.toggleTextWrap}>
          <Text style={styles.toggleTitle}>{TEXT.calculate.addToWishlist}</Text>
          <Text style={styles.helpText}>{TEXT.calculate.wishlistHelp}</Text>
        </View>
      </View>

      {/* Recurring reminder toggle */}
      <View style={styles.toggleRow}>
        <ThemedSwitch value={recurringEnabled} onValueChange={setRecurringEnabled} />
        <View style={styles.toggleTextWrap}>
          <Text style={styles.toggleTitle}>{TEXT.calculate.recurringPlan}</Text>
        </View>
      </View>

      {recurringEnabled && (
        <View style={styles.inputGroup}>
          <View style={styles.segment}>
            <DepthButton
              onPress={() => setRecurringFrequency('monthly')}
              variant={recurringFrequency === 'monthly' ? 'primary' : 'outline'}
              size="medium"
              style={styles.segmentButton}
            >
              {TEXT.calculate.monthlyPlan}
            </DepthButton>
            <DepthButton
              onPress={() => setRecurringFrequency('weekly')}
              variant={recurringFrequency === 'weekly' ? 'primary' : 'outline'}
              size="medium"
              style={styles.segmentButton}
            >
              {TEXT.calculate.weeklyPlan}
            </DepthButton>
          </View>
          <Text style={styles.label}>
            {recurringFrequency === 'monthly'
              ? TEXT.calculate.dayOfMonth
              : TEXT.calculate.dayOfWeek}
          </Text>
          <GlassInput
            placeholder={recurringFrequency === 'monthly' ? '1-28' : '0-6'}
            value={recurringDay}
            onChangeText={setRecurringDay}
            keyboardType="numeric"
          />
        </View>
      )}
    </AppBottomSheet>
  );
}
