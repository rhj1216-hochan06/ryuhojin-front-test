export type Locale = 'ko' | 'en';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: 'up' | 'down' | 'flat';
}

export interface SkillSummary {
  id: string;
  category: string;
  level: number;
  highlights: string[];
}

export interface MonthlyBusinessMetric {
  month: string;
  revenue: number;
  activeUsers: number;
  conversionRate: number;
}

export interface QualityScatterPoint {
  feature: string;
  team: string;
  cycleTimeDays: number;
  defectRate: number;
  complexity: number;
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface WorkflowSankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export type RoadmapStatus = 'done' | 'active' | 'planned';

export interface RoadmapGroup {
  id: number;
  title: string;
  owner: string;
}

export interface RoadmapItem {
  id: number;
  group: number;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: RoadmapStatus;
}

export interface DeliveryRow {
  id: string;
  project: string;
  domain: string;
  status: 'Stable' | 'Improving' | 'Watch';
  leadTimeDays: number;
  chartCoverage: number;
  apiContract: string;
  updatedAt: string;
}

export interface DashboardPayload {
  kpis: KpiMetric[];
  skills: SkillSummary[];
  monthlyMetrics: MonthlyBusinessMetric[];
  qualityPoints: QualityScatterPoint[];
  workflow: WorkflowSankeyData;
  roadmapGroups: RoadmapGroup[];
  roadmapItems: RoadmapItem[];
  deliveryRows: DeliveryRow[];
}

export interface ApiResponse<TData> {
  status: 'success';
  data: TData;
  generatedAt: string;
  latencyMs: number;
}

