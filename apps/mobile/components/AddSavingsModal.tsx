import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Banknote, Coins, DollarSign } from 'lucide-react-native';
import { useCreateSavingsLog } from '@/lib/hooks/useSavingsLogs';
import { useGoals } from '@/lib/hooks/useGoals';
import { use18KGoldPrice, useUSDPrice } from '@/lib/hooks/useGold';
import { useTheme } from '@/contexts/ThemeContext';
import { showToast } from '@/lib/toast';
import { TEXT, formatNumber } from '@/constants/text';
import { parsePersianNumber, formatPriceInput } from '@/utils/numbers';
import GlassInput from './ui/GlassInput';
import DepthButton from './ui/DepthButton';
import AppBottomSheet from './ui/AppBottomSheet';

interface AddSavingsModalProps {
  visible: boolean;
  onClose: () => void;
}

type SavingsType = 'money' | 'gold' | 'dollar';

// Calm blue accent for dollar — distinct from the green (money) and gold (طلا) accents.
const DOLLAR_ACCENT = '#4A9FE0';

export default function AddSavingsModal({ visible, onClose }: AddSavingsModalProps) {
  const createSavingsLog = useCreateSavingsLog();
  const { data: goals = [] } = useGoals();
  const { data: goldPrice } = use18KGoldPrice();
  const { data: usdPrice } = useUSDPrice();
  const { theme } = useTheme();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedType, setSelectedType] = useState<SavingsType>('gold');
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>();

  const typeOptions = useMemo(
    () => [
      { key: 'gold' as const, label: TEXT.history.gold, Icon: Coins, accent: theme.colors.primary },
      {
        key: 'dollar' as const,
        label: TEXT.history.dollar,
        Icon: DollarSign,
        accent: DOLLAR_ACCENT,
      },
      {
        key: 'money' as const,
        label: TEXT.history.money,
        Icon: Banknote,
        accent: theme.colors.success,
      },
    ],
    [theme.colors.success, theme.colors.primary]
  );

  const activeAccent =
    typeOptions.find((option) => option.key === selectedType)?.accent ?? theme.colors.primary;

  // Live Toman equivalent for gold/dollar entries.
  const numericAmount = parsePersianNumber(amount);
  const tomanEquivalent = useMemo(() => {
    if (numericAmount <= 0) return null;
    if (selectedType === 'gold' && goldPrice?.price) return numericAmount * goldPrice.price;
    if (selectedType === 'dollar' && usdPrice?.price) return numericAmount * usdPrice.price;
    return null;
  }, [numericAmount, selectedType, goldPrice?.price, usdPrice?.price]);

  const amountLabel =
    selectedType === 'money'
      ? TEXT.history.amount
      : selectedType === 'gold'
        ? TEXT.history.goldAmount
        : TEXT.history.dollarAmount;

  const amountPlaceholder =
    selectedType === 'money'
      ? TEXT.history.amountPlaceholder
      : selectedType === 'gold'
        ? TEXT.history.goldAmountPlaceholder
        : TEXT.history.dollarAmountPlaceholder;

  const AmountIcon =
    selectedType === 'money' ? Banknote : selectedType === 'gold' ? Coins : DollarSign;

  const handleAmountChange = (text: string) => {
    // Money is an integer Toman price → group with thousand separators.
    if (selectedType === 'money') {
      setAmount(formatPriceInput(text));
      return;
    }
    // Gold (grams) / dollar can be fractional → keep a single decimal point.
    const cleaned = text.replace(/[^0-9.۰-۹٠-٩]/g, '');
    const parts = cleaned.split('.');
    let final = parts[0];
    if (parts.length > 1) {
      final = parts[0] + '.' + parts.slice(1).join('');
    }
    setAmount(final);
  };

  const handleAddSavings = async () => {
    const parsedAmount = parsePersianNumber(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast.error(TEXT.common.error, TEXT.history.enterValidAmount);
      return;
    }

    try {
      const result = await createSavingsLog.mutateAsync({
        amount: parsedAmount,
        type: selectedType,
        goalId: selectedGoalId,
        goalAllocations: selectedGoalId ? [{ goalId: selectedGoalId, amount: parsedAmount }] : [],
        note: note || undefined,
      });

      showToast.success(
        TEXT.common.success,
        result.queued ? TEXT.history.savingsQueued : TEXT.history.savingsAdded
      );
      resetForm();
      onClose();
    } catch {
      showToast.error(TEXT.common.error, TEXT.history.addError);
    }
  };

  const resetForm = () => {
    setAmount('');
    setNote('');
    setSelectedGoalId(undefined);
    setSelectedType('money');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const dynamicStyles = StyleSheet.create({
    goalChip: {
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 8,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    goalChipText: {
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 13,
      textAlign: 'right',
    },
    previewPill: {
      alignSelf: 'flex-end',
      backgroundColor: activeAccent + '14',
      borderRadius: 999,
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    previewText: {
      color: activeAccent,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 14,
      textAlign: 'right',
    },
    typeButton: {
      alignItems: 'center',
      borderRadius: 12,
      flex: 1,
      gap: 6,
      justifyContent: 'center',
      paddingVertical: 12,
    },
    typeButtonText: {
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 13,
    },
    typeSelector: {
      backgroundColor: theme.colors.inset,
      borderColor: theme.colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row-reverse',
      gap: 4,
      marginBottom: 8,
      padding: 4,
    },
  });

  const footer = (
    <DepthButton
      onPress={handleAddSavings}
      disabled={createSavingsLog.isPending || !amount}
      variant="primary"
      size="large"
    >
      {createSavingsLog.isPending ? TEXT.common.loading : TEXT.common.save}
    </DepthButton>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={handleClose}
      title={TEXT.history.addSavings}
      footer={footer}
    >
      {/* Type Selector */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{TEXT.history.savingsType}</Text>
        <View style={dynamicStyles.typeSelector}>
          {typeOptions.map((option) => {
            const isActive = selectedType === option.key;
            const color = isActive ? option.accent : theme.colors.textSecondary;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  dynamicStyles.typeButton,
                  // eslint-disable-next-line react-native/no-inline-styles
                  isActive && {
                    backgroundColor: option.accent + '1A',
                    borderWidth: 1,
                    borderColor: option.accent,
                  },
                ]}
                onPress={() => setSelectedType(option.key)}
              >
                <option.Icon size={20} color={color} strokeWidth={2.2} />
                <Text style={[dynamicStyles.typeButtonText, { color }]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{amountLabel}</Text>
        <GlassInput
          icon={<AmountIcon size={20} color={theme.colors.textSecondary} strokeWidth={2.5} />}
          placeholder={amountPlaceholder}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
        />
        {tomanEquivalent !== null && (
          <View style={dynamicStyles.previewPill}>
            <Text style={dynamicStyles.previewText}>
              {TEXT.history.equivalentValue} {formatNumber(tomanEquivalent)} {TEXT.common.toman}
            </Text>
          </View>
        )}
      </View>

      {/* Goal Allocation */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {TEXT.history.goalAllocation}
        </Text>
        <TouchableOpacity
          onPress={() => setSelectedGoalId(undefined)}
          style={[
            dynamicStyles.goalChip,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: selectedGoalId ? theme.colors.border : theme.colors.primary,
              backgroundColor: selectedGoalId ? 'transparent' : theme.colors.primary + '20',
            },
          ]}
        >
          <Text
            style={[
              dynamicStyles.goalChipText,
              { color: selectedGoalId ? theme.colors.textSecondary : theme.colors.primary },
            ]}
          >
            {TEXT.history.noGoalAllocation}
          </Text>
        </TouchableOpacity>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal._id}
            onPress={() => setSelectedGoalId(goal._id)}
            style={[
              dynamicStyles.goalChip,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderColor:
                  selectedGoalId === goal._id ? theme.colors.primary : theme.colors.border,
                backgroundColor:
                  selectedGoalId === goal._id ? theme.colors.primary + '20' : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                dynamicStyles.goalChipText,
                {
                  color:
                    selectedGoalId === goal._id ? theme.colors.primary : theme.colors.textSecondary,
                },
              ]}
            >
              {goal.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Note Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {TEXT.history.note} ({TEXT.history.optional})
        </Text>
        <GlassInput
          placeholder={TEXT.history.notePlaceholder}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Vazirmatn_500Medium',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'right',
  },
});
