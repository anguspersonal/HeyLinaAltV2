/**
 * Type definitions for the Emotional Health Score feature
 */

export interface EmotionalHealthScore {
  overall: number; // 0-1000 scale
  components: {
    selfAwareness: number;
    boundaries: number;
    communication: number;
    attachmentSecurity: number;
    emotionalRegulation: number;
  };
  interpretation: string; // Compassionate explanation
  lastUpdated: string;
}

export interface ScoreDataPoint {
  date: string;
  score: number;
}

export interface ScoreHistory {
  dataPoints: ScoreDataPoint[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface ScoreInsight {
  id: string;
  component: keyof EmotionalHealthScore['components'];
  title: string;
  description: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
}
