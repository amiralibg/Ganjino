import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ElevatedCard from './ElevatedCard';
import { Trash2, Plus, Clock, Calendar } from 'lucide-react-native';
import DepthButton from './DepthButton';
import { englishToPersian } from '@/utils/numbers';

interface WishlistCardProps {
  goalName: string;
  price: string;
  goldEquivalent: string;
  savedGold: string;
  remaining: string;
  progress: number;
  timeline?: string | null;
  onAddGold: () => void;
  onDelete: () => void;
  goalReached: boolean;
  savedAmountInToman?: number;
  remainingInToman?: number;
}

export default function WishlistCard({
  goalName,
  price,
  goldEquivalent,
  savedGold,
  remaining,
  progress,
  timeline,
  onAddGold,
  onDelete,
  goalReached,
  savedAmountInToman,
  remainingInToman,
}: WishlistCardProps) {
  const { theme } = useTheme();

  // Helper to format Toman values
  const formatToman = (value: number | undefined) => {
    if (value === undefined) return null;
    return `${englishToPersian(Math.round(value).toLocaleString())} تومان`;
  };

  return (
    <ElevatedCard
      elevation="elevated"
      shadowLevel="medium"
      style={[styles.card, { marginBottom: theme.spacing.md }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={20} color={theme.colors.error} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text
          style={[
            styles.goalName,
            {
              color: theme.colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {goalName}
        </Text>
      </View>

      {/* Price */}
      <Text
        style={[
          styles.price,
          {
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
          },
        ]}
      >
        {price}
      </Text>

      {/* Gold Info Container with elevated background */}
      <View
        style={[
          styles.goldInfoContainer,
          {
            backgroundColor: theme.colors.backgroundTertiary,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
          },
        ]}
      >
        <View style={styles.goldRow}>
          <Text style={[styles.goldValue, { color: theme.colors.primary }]}>{goldEquivalent}</Text>
          <Text style={[styles.goldLabel, { color: theme.colors.textSecondary }]}>معادل طلا</Text>
        </View>
        <View style={styles.goldRow}>
          <View style={styles.goldValueContainer}>
            <Text style={[styles.goldValue, { color: theme.colors.success }]}>{savedGold}</Text>
            {savedAmountInToman && (
              <Text style={[styles.goldSubValue, { color: theme.colors.textTertiary }]}>
                ({formatToman(savedAmountInToman)})
              </Text>
            )}
          </View>
          <Text style={[styles.goldLabel, { color: theme.colors.textSecondary }]}>ذخیره شده</Text>
        </View>
        <View style={styles.goldRow}>
          <View style={styles.goldValueContainer}>
            <Text style={[styles.goldValue, { color: theme.colors.textTertiary }]}>
              {remaining}
            </Text>
            {remainingInToman && (
              <Text style={[styles.goldSubValue, { color: theme.colors.textTertiary }]}>
                ({formatToman(remainingInToman)})
              </Text>
            )}
          </View>
          <Text style={[styles.goldLabel, { color: theme.colors.textSecondary }]}>باقی مانده</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text
          style={[
            styles.progressText,
            {
              color: theme.colors.primary,
              marginLeft: theme.spacing.sm,
            },
          ]}
        >
          {englishToPersian(progress.toFixed(0))}٪
        </Text>
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: theme.colors.backgroundTertiary,
              borderRadius: theme.radius.sm,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.sm,
              },
            ]}
          />
        </View>
      </View>

      {/* Timeline */}
      {!goalReached &&
        (timeline ? (
          <View
            style={[
              styles.timelineContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: theme.colors.successLight,
                borderColor: theme.colors.success,
                borderWidth: 1,
                borderRadius: theme.radius.md,
                padding: theme.spacing.sm,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <Text style={[styles.timelineText, { color: theme.colors.success }]}>{timeline}</Text>
            <Clock size={16} color={theme.colors.success} strokeWidth={2.5} />
          </View>
        ) : (
          <View
            style={[
              styles.timelineContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: theme.colors.backgroundTertiary,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: theme.radius.md,
                padding: theme.spacing.sm,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <Text style={[styles.timelineText, { color: theme.colors.textTertiary }]}>
              اول درآمد ماهانهت رو وارد کن تا زمان‌بندی تخمینی رو ببینی
            </Text>
            <Calendar size={16} color={theme.colors.textTertiary} strokeWidth={2.5} />
          </View>
        ))}

      {/* Goal Reached Badge */}
      {goalReached ? (
        <View
          style={[
            styles.goalBadge,
            {
              backgroundColor: theme.colors.successLight,
              borderRadius: theme.radius.md,
              padding: theme.spacing.sm,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          <Text style={[styles.goalText, { color: theme.colors.success }]}>به هدف رسیدی! 🎉</Text>
        </View>
      ) : (
        <DepthButton
          onPress={onAddGold}
          variant="primary"
          size="medium"
          style={{ marginTop: theme.spacing.md }}
          icon={<Plus size={18} color={theme.isDark ? '#0A0A0A' : '#FFFFFF'} strokeWidth={2.5} />}
          iconPosition="left"
        >
          اضافه کردن طلا
        </DepthButton>
      )}
    </ElevatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  deleteButton: {
    flex: 1,
    padding: 4,
  },
  goalBadge: {
    alignItems: 'center',
  },
  goalName: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 22,
  },
  goalText: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 15,
  },
  goldInfoContainer: {
    // Styles applied inline
  },
  goldLabel: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 14,
  },
  goldRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goldSubValue: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  goldValue: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 14,
  },
  goldValueContainer: {
    alignItems: 'flex-start',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 18,
    textAlign: 'right',
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 15,
    marginRight: 8,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    overflow: 'hidden',
  },
  timelineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  timelineText: {
    fontFamily: 'Vazirmatn_600SemiBold',
    fontSize: 14,
    textAlign: 'right',
  },
});
