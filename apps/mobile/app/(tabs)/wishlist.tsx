import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGoals, useUpdateGoal, useDeleteGoal } from '@/lib/hooks/useGoals';
import { use18KGoldPrice } from '@/lib/hooks/useGold';
import { Heart, Coins, Plus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { showToast } from '@/lib/toast';
import { TEXT, formatNumber, formatDecimal } from '@/constants/text';
import { formatGoldWeight } from '@/lib/utils/goldUnits';
import { persianToEnglish } from '@/utils/numbers';
import type { SavingsTimeline } from '@/lib/api/goals';
import WishlistCard from '@/components/ui/WishlistCard';
import GlassInput from '@/components/ui/GlassInput';
import DepthButton from '@/components/ui/DepthButton';
import AppHeader from '@/components/AppHeader';
import AddGoalModal from '@/components/AddGoalModal';
import AppBottomSheet from '@/components/ui/AppBottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { LinearGradient } from 'expo-linear-gradient';

export default function WishlistScreen() {
  const { data: goals = [], isLoading } = useGoals();
  const { data: goldPrice } = use18KGoldPrice();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const { theme } = useTheme();

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goldAmount, setGoldAmount] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const wishlistItems = goals.filter((g) => g.isWishlisted);

  const calculateProgress = (saved: number, total: number) => {
    return Math.min((saved / total) * 100, 100);
  };

  const formatTimeline = (timeline: SavingsTimeline | null | undefined): string | null => {
    if (!timeline) return null;

    if (timeline.monthsToSave === 0) {
      return TEXT.timeline.goalReached;
    }

    const years = Math.floor(timeline.monthsToSave / 12);
    const months = Math.floor(timeline.monthsToSave % 12);

    if (years > 0) {
      return TEXT.timeline.yearsToSave(years, months);
    }

    if (months > 0) {
      return TEXT.timeline.monthsToSave(months);
    }

    return TEXT.timeline.daysToSave(timeline.daysToSave);
  };

  const handleGoldAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.\u06F0-\u06F9\u0660-\u0669]/g, '');
    const parts = cleaned.split('.');
    let final = parts[0];
    if (parts.length > 1) {
      final = parts[0] + '.' + parts.slice(1).join('');
    }
    setGoldAmount(final);
  };

  const handleAddGold = async (goalId: string, currentAmount: number) => {
    // Convert Persian to English before parsing
    const addAmount = parseFloat(persianToEnglish(goldAmount));

    if (isNaN(addAmount) || addAmount <= 0) {
      showToast.error(TEXT.common.error, TEXT.wishlist.enterValidAmount);
      return;
    }

    const newAmount = currentAmount + addAmount;

    try {
      await updateGoal.mutateAsync({
        id: goalId,
        data: { savedGoldAmount: newAmount },
      });
      showToast.success(TEXT.common.success, TEXT.wishlist.goldUpdated);
      setEditingGoalId(null);
      setGoldAmount('');
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        TEXT.wishlist.updateError;
      showToast.error(TEXT.common.error, errorMessage);
    }
  };

  const handleDeleteItem = (goalId: string, goalName: string) => {
    setDeleteConfirm({ id: goalId, name: goalName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteGoal.mutateAsync(deleteConfirm.id);
      showToast.success(TEXT.common.success, TEXT.common.delete);
      setDeleteConfirm(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        TEXT.wishlist.deleteError;
      showToast.error(TEXT.common.error, errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />
      <AppHeader />

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingBottom: 140 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
      >
        {/* Add New Goal Button */}
        <DepthButton
          onPress={() => setAddModalVisible(true)}
          variant="primary"
          size="large"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ marginBottom: 20 }}
          icon={<Plus size={20} color={'#3A2906'} strokeWidth={2.5} />}
          iconPosition="left"
        >
          {TEXT.wishlist.addNewGoal}
        </DepthButton>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : wishlistItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text
              style={[styles.emptyText, styles.fontRegular, { color: theme.colors.textSecondary }]}
            >
              {TEXT.wishlist.noItems}
            </Text>
          </View>
        ) : (
          wishlistItems.map((item) => {
            const progress = calculateProgress(item.savedGoldAmount, item.goldEquivalent);
            const remaining = Math.max(0, item.goldEquivalent - item.savedGoldAmount);

            const goldEquivalentFormatted = formatGoldWeight(item.goldEquivalent);
            const savedGoldFormatted = formatGoldWeight(item.savedGoldAmount);
            const remainingFormatted = formatGoldWeight(remaining);

            // Use current price if available, otherwise fallback to creation price
            const displayPrice = item.currentPriceInToman ?? item.price;
            const priceLabel = item.currentPriceInToman
              ? `${formatNumber(displayPrice)} ${TEXT.wishlist.toman} (قیمت امروز)`
              : `${formatNumber(displayPrice)} ${TEXT.wishlist.toman}`;

            return (
              <WishlistCard
                key={item._id}
                goalName={item.name}
                price={priceLabel}
                goldEquivalent={`${formatDecimal(goldEquivalentFormatted.primary.value)} ${goldEquivalentFormatted.primary.unit}`}
                savedGold={`${formatDecimal(savedGoldFormatted.primary.value)} ${savedGoldFormatted.primary.unit}`}
                remaining={`${formatDecimal(remainingFormatted.primary.value)} ${remainingFormatted.primary.unit}`}
                progress={progress}
                timeline={formatTimeline(item.timeline)}
                onAddGold={() => {
                  setEditingGoalId(item._id);
                  setGoldAmount('');
                }}
                onDelete={() => handleDeleteItem(item._id, item.name)}
                goalReached={progress >= 100}
                savedAmountInToman={item.savedAmountInToman}
                remainingInToman={item.remainingInToman}
              />
            );
          })
        )}
      </KeyboardAwareScrollView>

      <AppBottomSheet
        visible={editingGoalId !== null}
        onClose={() => setEditingGoalId(null)}
        title={TEXT.wishlist.addGold}
        scrollable={false}
        footer={
          <DepthButton
            onPress={() => {
              const goal = goals.find((g) => g._id === editingGoalId);
              if (goal) {
                void handleAddGold(editingGoalId!, goal.savedGoldAmount);
              }
            }}
            disabled={updateGoal.isPending || !goldAmount}
            variant="primary"
            size="large"
          >
            {updateGoal.isPending ? TEXT.common.loading : TEXT.wishlist.save}
          </DepthButton>
        }
      >
        <Text style={[styles.sheetLabel, { color: theme.colors.text }]}>
          {TEXT.wishlist.goldAmount}
        </Text>
        <GlassInput
          icon={<Coins size={20} color={theme.colors.textSecondary} strokeWidth={2.5} />}
          placeholder="0"
          value={goldAmount}
          onChangeText={handleGoldAmountChange}
          keyboardType="decimal-pad"
        />
      </AppBottomSheet>

      <ConfirmDialog
        visible={deleteConfirm !== null}
        title={TEXT.wishlist.removeGoal}
        message={TEXT.wishlist.removeConfirm(deleteConfirm?.name || '')}
        confirmLabel={TEXT.wishlist.remove}
        cancelLabel={TEXT.wishlist.cancel}
        loading={deleteGoal.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      <AddGoalModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        goldPrice={goldPrice?.price}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
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
  sheetLabel: {
    fontFamily: 'Vazirmatn_500Medium',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'right',
  },
});
