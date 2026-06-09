/* eslint-disable react-native/no-inline-styles */
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useSavingsLogs,
  useDeleteSavingsLog,
  useSavingsAnalytics,
} from '@/lib/hooks/useSavingsLogs';
import { useGoals } from '@/lib/hooks/useGoals';
import { use18KGoldPrice, useUSDPrice } from '@/lib/hooks/useGold';
import {
  History as HistoryIcon,
  Plus,
  Trash2,
  DollarSign,
  Coins,
  Banknote,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { showToast } from '@/lib/toast';
import { TEXT, formatNumber, formatDate, formatDecimal } from '@/constants/text';
import { formatGoldWeight } from '@/lib/utils/goldUnits';
import AddSavingsModal from '@/components/AddSavingsModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DepthButton from '@/components/ui/DepthButton';
import AppHeader from '@/components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-gifted-charts';

export default function SavingsScreen() {
  const { data: savingsLogs = [], isLoading } = useSavingsLogs();
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [activeSection, setActiveSection] = useState<'overview' | 'analytics' | 'logs'>('logs');
  const { data: analytics } = useSavingsAnalytics({ period: analyticsPeriod });
  const deleteSavingsLog = useDeleteSavingsLog();
  const { data: _goals = [] } = useGoals();
  const { data: goldPrice } = use18KGoldPrice();
  const { data: usdPrice } = useUSDPrice();
  const { theme } = useTheme();

  // Calm blue accent for dollar — matches AddSavingsModal.
  const DOLLAR_ACCENT = '#4A9FE0';

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    type: 'money' | 'gold' | 'dollar';
  } | null>(null);

  const handleDeleteLog = (logId: string, logType: 'money' | 'gold' | 'dollar') => {
    setDeleteConfirm({ id: logId, type: logType });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteSavingsLog.mutateAsync(deleteConfirm.id);
      showToast.success(TEXT.common.save, TEXT.history.deleted);
      setDeleteConfirm(null);
    } catch {
      showToast.error(TEXT.common.error, TEXT.history.deleteError);
    }
  };

  const totals = useMemo(() => {
    const acc = { money: 0, gold: 0, dollar: 0 };
    savingsLogs.forEach((log) => {
      if (log.type === 'gold') {
        acc.gold += log.amount;
      } else if (log.type === 'dollar') {
        acc.dollar += log.amount;
      } else {
        acc.money += log.amount;
      }
    });
    return acc;
  }, [savingsLogs]);

  // Combined value of every asset converted to Toman at live prices.
  const goldValueToman = goldPrice ? totals.gold * goldPrice.price : 0;
  const dollarValueToman = usdPrice ? totals.dollar * usdPrice.price : 0;
  const combinedTotalToman = totals.money + goldValueToman + dollarValueToman;

  const addButtonStyle = useMemo(() => ({ marginBottom: 20 }), []);

  const summaryRowBorderStyle = useMemo(
    () => ({
      marginBottom: 0,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    }),
    [theme.colors.border]
  );

  // Accent color per asset type
  const getTypeAccent = (logType: 'money' | 'gold' | 'dollar') =>
    logType === 'gold'
      ? theme.colors.primary
      : logType === 'dollar'
        ? DOLLAR_ACCENT
        : theme.colors.success;

  // Helper function for log icon background
  const getLogIconBackground = (logType: 'money' | 'gold' | 'dollar') => ({
    backgroundColor: getTypeAccent(logType) + '20',
  });

  const dynamicStyles = StyleSheet.create({
    analyticsCard: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 20,
      padding: 20,
    },
    analyticsDescription: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 13,
      marginBottom: 12,
      textAlign: 'right',
    },
    analyticsEmpty: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 13,
      paddingVertical: 8,
      textAlign: 'center',
    },
    analyticsTitle: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 18,
      marginBottom: 6,
      textAlign: 'right',
    },
    analyticsTotalLabel: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12,
      marginBottom: 2,
    },
    analyticsTotalValue: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 13,
    },
    analyticsTotals: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    breakdownValueWrap: {
      alignItems: 'flex-start',
    },
    deleteButton: {
      padding: 8,
    },
    emptyContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 16,
      marginTop: 16,
      textAlign: 'center',
    },
    loading: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    logAmount: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 18,
      marginBottom: 2,
      textAlign: 'right',
    },
    logCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row-reverse',
      marginBottom: 12,
      padding: 16,
    },
    logContent: {
      flex: 1,
    },
    logDate: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12,
      textAlign: 'right',
    },
    logIcon: {
      alignItems: 'center',
      borderRadius: 24,
      height: 48,
      justifyContent: 'center',
      marginLeft: 12,
      width: 48,
    },
    logNote: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 13,
      marginTop: 4,
      textAlign: 'right',
    },
    logType: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12,
      marginBottom: 4,
      textAlign: 'right',
    },
    logsList: {
      flex: 1,
      paddingHorizontal: 24,
    },
    periodButton: {
      borderColor: theme.colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary,
    },
    periodButtonText: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 12,
    },
    periodButtonTextActive: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn_700Bold',
    },
    periodSelector: {
      flexDirection: 'row-reverse',
      gap: 8,
      marginBottom: 14,
    },
    sectionButton: {
      borderColor: theme.colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 9,
    },
    sectionButtonActive: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary,
    },
    sectionButtonText: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 12,
    },
    sectionButtonTextActive: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn_700Bold',
    },
    sectionTabs: {
      flexDirection: 'row-reverse',
      gap: 8,
      marginBottom: 14,
      marginTop: 20,
    },
    summaryCard: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 20,
      padding: 20,
    },
    summaryLabel: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 14,
    },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryValue: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 18,
    },
    totalCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.primary,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 12,
      marginTop: 24,
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    totalHint: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 12,
      marginTop: 8,
      textAlign: 'center',
    },
    totalLabel: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 14,
      marginBottom: 8,
    },
    totalUnit: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_500Medium',
      fontSize: 15,
    },
    totalValue: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 30,
    },
  });

  const analyticsChartData =
    analytics?.byPeriod?.reduce<Array<{ value: number; label: string; frontColor: string }>>(
      (acc, item, index) => {
        const value = Number(item.totalAmount || 0);
        if (value <= 0) {
          return acc;
        }

        acc.push({
          value,
          label: index % 2 === 0 ? item._id.period.slice(-5) : '',
          frontColor:
            item._id.type === 'gold'
              ? theme.colors.primary
              : item._id.type === 'dollar'
                ? DOLLAR_ACCENT
                : theme.colors.success,
        });
        return acc;
      },
      []
    ) || [];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />
      <AppHeader />
      <ScrollView
        style={dynamicStyles.logsList}
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={dynamicStyles.sectionTabs}>
          {(
            [
              { key: 'logs', label: TEXT.history.logsTab },
              { key: 'analytics', label: TEXT.history.analyticsTab },
              { key: 'overview', label: TEXT.history.overviewTab },
            ] as const
          ).map((item) => {
            const isActive = activeSection === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[dynamicStyles.sectionButton, isActive && dynamicStyles.sectionButtonActive]}
                onPress={() => setActiveSection(item.key)}
              >
                <Text
                  style={[
                    dynamicStyles.sectionButtonText,
                    isActive && dynamicStyles.sectionButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeSection === 'overview' && (
          <>
            {/* Combined total across all assets, valued in Toman */}
            <View style={dynamicStyles.totalCard}>
              <Text style={dynamicStyles.totalLabel}>{TEXT.history.totalSavings}</Text>
              <Text style={dynamicStyles.totalValue}>
                {formatNumber(combinedTotalToman)}{' '}
                <Text style={dynamicStyles.totalUnit}>{TEXT.common.toman}</Text>
              </Text>
              <Text style={dynamicStyles.totalHint}>{TEXT.history.totalSavingsHint}</Text>
            </View>

            {/* Per-asset breakdown */}
            <View style={dynamicStyles.summaryCard}>
              <View style={dynamicStyles.summaryRow}>
                <Text style={dynamicStyles.summaryValue}>
                  {formatNumber(totals.money)} {TEXT.common.toman}
                </Text>
                <Text style={dynamicStyles.summaryLabel}>{TEXT.history.totalMoney}</Text>
              </View>
              <View style={dynamicStyles.summaryRow}>
                <View style={dynamicStyles.breakdownValueWrap}>
                  <Text style={dynamicStyles.summaryValue}>
                    {formatDecimal(totals.gold)} {TEXT.common.gram}
                  </Text>
                  {goldPrice && (
                    <Text style={dynamicStyles.summaryLabel}>
                      ({formatNumber(goldValueToman)} {TEXT.common.toman})
                    </Text>
                  )}
                </View>
                <Text style={dynamicStyles.summaryLabel}>{TEXT.history.gold}</Text>
              </View>
              <View style={dynamicStyles.summaryRow}>
                <View style={dynamicStyles.breakdownValueWrap}>
                  <Text style={dynamicStyles.summaryValue}>
                    {formatNumber(totals.dollar)} {TEXT.common.dollar}
                  </Text>
                  {usdPrice && (
                    <Text style={dynamicStyles.summaryLabel}>
                      ({formatNumber(dollarValueToman)} {TEXT.common.toman})
                    </Text>
                  )}
                </View>
                <Text style={dynamicStyles.summaryLabel}>{TEXT.history.dollar}</Text>
              </View>
              <View style={[dynamicStyles.summaryRow, summaryRowBorderStyle]}>
                <Text style={dynamicStyles.summaryValue}>{formatNumber(savingsLogs.length)}</Text>
                <Text style={dynamicStyles.summaryLabel}>{TEXT.history.totalEntries}</Text>
              </View>
            </View>
          </>
        )}

        {activeSection === 'analytics' && (
          <View style={dynamicStyles.analyticsCard}>
            <Text style={dynamicStyles.analyticsTitle}>{TEXT.history.analyticsTitle}</Text>
            <Text style={dynamicStyles.analyticsDescription}>
              {TEXT.history.analyticsDescription}
            </Text>

            <View style={dynamicStyles.periodSelector}>
              {(
                [
                  { key: 'day', label: TEXT.history.periodDay },
                  { key: 'week', label: TEXT.history.periodWeek },
                  { key: 'month', label: TEXT.history.periodMonth },
                ] as Array<{ key: 'day' | 'week' | 'month'; label: string }>
              ).map((item) => {
                const isActive = analyticsPeriod === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      dynamicStyles.periodButton,
                      isActive && dynamicStyles.periodButtonActive,
                    ]}
                    onPress={() => setAnalyticsPeriod(item.key)}
                  >
                    <Text
                      style={[
                        dynamicStyles.periodButtonText,
                        isActive && dynamicStyles.periodButtonTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {analytics ? (
              <>
                <View style={dynamicStyles.analyticsTotals}>
                  <View>
                    <Text style={dynamicStyles.analyticsTotalLabel}>{TEXT.history.totalMoney}</Text>
                    <Text style={dynamicStyles.analyticsTotalValue}>
                      {formatNumber(analytics.totals.money)} {TEXT.common.toman}
                    </Text>
                  </View>
                  <View>
                    <Text style={dynamicStyles.analyticsTotalLabel}>{TEXT.history.gold}</Text>
                    <Text style={dynamicStyles.analyticsTotalValue}>
                      {formatDecimal(analytics.totals.gold)} {TEXT.common.gram}
                    </Text>
                  </View>
                  <View>
                    <Text style={dynamicStyles.analyticsTotalLabel}>{TEXT.history.dollar}</Text>
                    <Text style={dynamicStyles.analyticsTotalValue}>
                      {formatNumber(analytics.totals.dollar)} {TEXT.common.dollar}
                    </Text>
                  </View>
                  <View>
                    <Text style={dynamicStyles.analyticsTotalLabel}>
                      {TEXT.history.totalEntries}
                    </Text>
                    <Text style={dynamicStyles.analyticsTotalValue}>
                      {formatNumber(analytics.totals.entries)}
                    </Text>
                  </View>
                </View>

                {analyticsChartData.length > 0 ? (
                  <BarChart
                    data={analyticsChartData}
                    height={140}
                    barWidth={16}
                    spacing={14}
                    yAxisColor="transparent"
                    xAxisColor={theme.colors.border}
                    yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                    hideRules
                    roundedTop
                    roundedBottom
                  />
                ) : (
                  <Text style={dynamicStyles.analyticsEmpty}>{TEXT.history.analyticsNoData}</Text>
                )}
              </>
            ) : (
              <Text style={dynamicStyles.analyticsEmpty}>{TEXT.history.analyticsNoData}</Text>
            )}
          </View>
        )}

        {/* Add Button */}
        <DepthButton
          onPress={() => setAddModalVisible(true)}
          variant="primary"
          size="large"
          style={addButtonStyle}
          icon={<Plus size={20} color={'#3A2906'} strokeWidth={2.5} />}
          iconPosition="left"
        >
          {TEXT.history.addSavings}
        </DepthButton>

        {activeSection === 'logs' &&
          (isLoading ? (
            <View style={dynamicStyles.loading}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : savingsLogs.length === 0 ? (
            <View style={dynamicStyles.emptyContainer}>
              <HistoryIcon size={64} color={theme.colors.textSecondary} />
              <Text style={dynamicStyles.emptyText}>{TEXT.history.noLogs}</Text>
            </View>
          ) : (
            savingsLogs.map((log) => {
              const goldFormatted = formatGoldWeight(log.amount);
              const accent = getTypeAccent(log.type);

              return (
                <View key={log._id} style={dynamicStyles.logCard}>
                  <View style={[dynamicStyles.logIcon, getLogIconBackground(log.type)]}>
                    {log.type === 'gold' ? (
                      <Coins size={24} color={accent} strokeWidth={2.5} />
                    ) : log.type === 'dollar' ? (
                      <DollarSign size={24} color={accent} strokeWidth={2.5} />
                    ) : (
                      <Banknote size={24} color={accent} strokeWidth={2.5} />
                    )}
                  </View>
                  <View style={dynamicStyles.logContent}>
                    <Text style={dynamicStyles.logType}>
                      {log.type === 'gold'
                        ? TEXT.history.goldSaved
                        : log.type === 'dollar'
                          ? TEXT.history.dollarSaved
                          : TEXT.history.moneySaved}
                    </Text>
                    <Text style={dynamicStyles.logAmount}>
                      {log.type === 'money'
                        ? `${formatNumber(log.amount)} ${TEXT.common.toman}`
                        : log.type === 'dollar'
                          ? `${formatNumber(log.amount)} ${TEXT.common.dollar}`
                          : `${formatDecimal(goldFormatted.primary.value)} ${goldFormatted.primary.unit}`}
                    </Text>
                    {log.type === 'gold' && goldPrice && (
                      <Text style={dynamicStyles.logNote}>
                        {formatNumber(log.amount * goldPrice.price)} {TEXT.common.toman}
                      </Text>
                    )}
                    {log.type === 'dollar' && usdPrice && (
                      <Text style={dynamicStyles.logNote}>
                        {formatNumber(log.amount * usdPrice.price)} {TEXT.common.toman}
                      </Text>
                    )}
                    {log.note && (
                      <Text style={dynamicStyles.logNote} numberOfLines={1}>
                        {log.note}
                      </Text>
                    )}
                    {log.goalId && (
                      <Text style={dynamicStyles.logNote} numberOfLines={1}>
                        {TEXT.history.for}: {log.goalId.name}
                      </Text>
                    )}
                    <Text style={dynamicStyles.logDate}>{formatDate(log.date)}</Text>
                  </View>
                  <TouchableOpacity
                    style={dynamicStyles.deleteButton}
                    onPress={() => handleDeleteLog(log._id, log.type)}
                  >
                    <Trash2 size={20} color={theme.colors.error} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              );
            })
          ))}
      </ScrollView>

      <AddSavingsModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />

      <ConfirmDialog
        visible={deleteConfirm !== null}
        title={TEXT.history.deleteTitle}
        message={TEXT.history.deleteConfirm}
        loading={deleteSavingsLog.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
});
