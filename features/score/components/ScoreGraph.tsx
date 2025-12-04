import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import type { ScoreHistory } from '../types';

interface ScoreGraphProps {
  history: ScoreHistory;
}

type TimeRange = 'week' | 'month' | 'all';

export function ScoreGraph({ history }: ScoreGraphProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  if (!history || !history.dataPoints || history.dataPoints.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          Not enough data yet. Keep chatting with Lina to see your progress over time.
        </ThemedText>
      </View>
    );
  }

  // Filter data points based on time range
  const filterDataPoints = () => {
    const now = new Date();
    const dataPoints = [...history.dataPoints].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (timeRange === 'all') {
      return dataPoints;
    }

    const daysToShow = timeRange === 'week' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - daysToShow * 24 * 60 * 60 * 1000);

    return dataPoints.filter((point) => new Date(point.date) >= cutoffDate);
  };

  const filteredData = filterDataPoints();

  if (filteredData.length === 0) {
    return (
      <View style={styles.container}>
        <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No data available for this time range.
          </ThemedText>
        </View>
      </View>
    );
  }

  // Calculate graph dimensions
  const screenWidth = Dimensions.get('window').width;
  const graphWidth = screenWidth - spacing.lg * 2 - 40; // Account for padding and margins
  const graphHeight = 200;
  const padding = 40;

  // Find min and max scores for scaling
  const scores = filteredData.map((d) => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 100; // Avoid division by zero

  // Calculate points for the line
  const points = filteredData.map((point, index) => {
    const x = padding + (index / (filteredData.length - 1 || 1)) * (graphWidth - padding * 2);
    const y =
      graphHeight -
      padding -
      ((point.score - minScore) / scoreRange) * (graphHeight - padding * 2);
    return { x, y, score: point.score, date: point.date };
  });

  // Create path for the line
  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Determine trend color
  const trendColor =
    history.trend === 'improving'
      ? colors.accent.lime
      : history.trend === 'declining'
        ? colors.accent.orange
        : colors.accent.gold;

  return (
    <View style={styles.container}>
      {/* Time Range Selector */}
      <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />

      {/* Trend Indicator */}
      <View style={styles.trendContainer}>
        <View style={[styles.trendDot, { backgroundColor: trendColor }]} />
        <ThemedText style={styles.trendText}>
          {history.trend === 'improving'
            ? 'Improving'
            : history.trend === 'declining'
              ? 'Needs attention'
              : 'Stable'}
        </ThemedText>
      </View>

      {/* Graph */}
      <View style={styles.graphContainer}>
        <Svg width={graphWidth} height={graphHeight}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (graphHeight - padding * 2);
            return (
              <Line
                key={ratio}
                x1={padding}
                y1={y}
                x2={graphWidth - padding}
                y2={y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={1}
              />
            );
          })}

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((ratio) => {
            const y = padding + (1 - ratio) * (graphHeight - padding * 2);
            const score = Math.round(minScore + ratio * scoreRange);
            return (
              <SvgText
                key={ratio}
                x={padding - 10}
                y={y + 5}
                fill={colors.text.tertiary}
                fontSize={10}
                textAnchor="end"
              >
                {score}
              </SvgText>
            );
          })}

          {/* Line path */}
          <Path d={linePath} stroke={trendColor} strokeWidth={2} fill="none" />

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={trendColor}
              stroke={colors.background.primary}
              strokeWidth={2}
            />
          ))}

          {/* X-axis labels (show first, middle, and last) */}
          {[0, Math.floor(points.length / 2), points.length - 1].map((index) => {
            if (index >= points.length) return null;
            const point = points[index];
            return (
              <SvgText
                key={index}
                x={point.x}
                y={graphHeight - 10}
                fill={colors.text.tertiary}
                fontSize={10}
                textAnchor="middle"
              >
                {formatDate(point.date)}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatItem label="Current" value={filteredData[filteredData.length - 1].score} />
        <StatItem label="Average" value={Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)} />
        <StatItem label="Peak" value={maxScore} />
      </View>
    </View>
  );
}

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

function TimeRangeSelector({ selected, onSelect }: TimeRangeSelectorProps) {
  const ranges: TimeRange[] = ['week', 'month', 'all'];

  return (
    <View style={styles.selectorContainer}>
      {ranges.map((range) => (
        <TouchableOpacity
          key={range}
          style={[styles.selectorButton, selected === range && styles.selectorButtonActive]}
          onPress={() => onSelect(range)}
        >
          <ThemedText
            style={[
              styles.selectorButtonText,
              selected === range && styles.selectorButtonTextActive,
            ]}
          >
            {range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : 'All Time'}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 3,
  },

  // Empty State
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Time Range Selector
  selectorContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: colors.accent.gold,
  },
  selectorButtonText: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectorButtonTextActive: {
    color: colors.background.primary,
  },

  // Trend Indicator
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  trendText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
  },

  // Graph
  graphContainer: {
    marginBottom: spacing.lg,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.heading.h3.fontSize,
    fontWeight: typography.heading.h3.fontWeight as any,
    color: colors.text.primary,
  },
});
