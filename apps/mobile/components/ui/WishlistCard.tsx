import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash2, Plus, Clock } from 'lucide-react-native';
import GoldRing from './GoldRing';
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

  const formatToman = (value: number | undefined) => {
    if (value === undefined) return null;
    return `${englishToPersian(Math.round(value).toLocaleString())} تومان`;
  };

  const styles = StyleSheet.create({
    addText: {
      color: theme.colors.primaryDark,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 13.5,
    },
    body: {
      padding: 18,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius['2xl'],
      borderWidth: 1,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.small,
    },
    deleteButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.errorLight,
      borderRadius: theme.radius.md,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    footer: {
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      flexDirection: 'row-reverse',
    },
    footerCell: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row-reverse',
      gap: 7,
      justifyContent: 'center',
      paddingVertical: 13,
    },
    footerDivider: {
      borderLeftColor: theme.colors.border,
      borderLeftWidth: 1,
    },
    fullCell: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      gap: 7,
      justifyContent: 'center',
      paddingVertical: 14,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
    },
    name: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 19,
      textAlign: 'right',
    },
    price: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12.5,
      marginTop: 2,
      textAlign: 'right',
    },
    progressRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 16,
      marginTop: 16,
    },
    reachedText: {
      color: theme.colors.success,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 14,
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12.5,
    },
    statRow: {
      alignItems: 'baseline',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statSub: {
      color: theme.colors.textTertiary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 10.5,
    },
    statValue: {
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 14,
    },
    statsColumn: {
      flex: 1,
      gap: 10,
    },
    timeText: {
      color: theme.colors.successDeep,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 13.5,
    },
    titleBlock: {
      flex: 1,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {goalName}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              {price}
            </Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.8}>
            <Trash2 size={18} color={theme.colors.error} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Ring + stats */}
        <View style={styles.progressRow}>
          <GoldRing pct={progress} size={76} label="رسیده" />
          <View style={styles.statsColumn}>
            <View style={styles.statRow}>
              <View>
                <Text style={[styles.statValue, { color: theme.colors.successDeep }]}>
                  {savedGold}
                </Text>
                {savedAmountInToman !== undefined && (
                  <Text style={styles.statSub}>{formatToman(savedAmountInToman)}</Text>
                )}
              </View>
              <Text style={styles.statLabel}>ذخیره‌شده</Text>
            </View>
            <View style={styles.statRow}>
              <View>
                <Text style={[styles.statValue, { color: theme.colors.primaryDark }]}>
                  {remaining}
                </Text>
                {remainingInToman !== undefined && (
                  <Text style={styles.statSub}>{formatToman(remainingInToman)}</Text>
                )}
              </View>
              <Text style={styles.statLabel}>باقی‌مانده</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      {goalReached ? (
        <View style={[styles.footer, styles.fullCell]}>
          <Text style={styles.reachedText}>به هدف رسیدی! 🎉</Text>
        </View>
      ) : (
        <View style={styles.footer}>
          {timeline && (
            <View style={[styles.footerCell, styles.footerDivider]}>
              <Clock size={17} color={theme.colors.successDeep} strokeWidth={2} />
              <Text style={styles.timeText} numberOfLines={1}>
                {timeline}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.footerCell} onPress={onAddGold} activeOpacity={0.7}>
            <Plus size={17} color={theme.colors.primaryDark} strokeWidth={2.4} />
            <Text style={styles.addText}>اضافه کردن طلا</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
