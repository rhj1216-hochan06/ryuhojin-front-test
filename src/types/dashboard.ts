export type Locale = 'ko' | 'en';
export type AppRoutePath = '/' | '/charts' | '/data-grid' | '/timeline';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  path: AppRoutePath;
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

export interface ChartImplementationMetric {
  month: string;
  current: number;
  previous: number;
  reviewScore: number;
}

export interface ChartCapabilityNode {
  name: string;
  value: number;
  children?: ChartCapabilityNode[];
}

export interface ChartCategoryShare {
  name: string;
  value: number;
}

export interface QualityScatterPoint {
  feature: string;
  team: string;
  cycleTimeDays: number;
  defectRate: number;
  complexity: number;
}

export type GenderBoxPlotGender = 'Male' | 'Female';

export interface GenderBoxPlotMetric {
  group: string;
  gender: GenderBoxPlotGender;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
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
  isVisible?: boolean;
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

export type PortfolioGridStatus = 'Stable' | 'Improving' | 'Review';

export type PortfolioGridImpact = 'High' | 'Medium' | 'Low';

export interface PortfolioGridTask {
  id: string;
  name: string;
  owner: string;
  status: PortfolioGridStatus;
  impact: PortfolioGridImpact;
  updatedAt: string;
  notes: string;
}

export interface PortfolioGridRow {
  id: string;
  capability: string;
  category: string;
  owner: string;
  status: PortfolioGridStatus;
  coverage: number;
  updatedAt: string;
  children: PortfolioGridTask[];
}

export interface DashboardPayload {
  kpis: KpiMetric[];
  skills: SkillSummary[];
  monthlyMetrics: MonthlyBusinessMetric[];
  chartImplementationMetrics: ChartImplementationMetric[];
  chartCapabilityTree: ChartCapabilityNode[];
  chartCategoryShare: ChartCategoryShare[];
  qualityPoints: QualityScatterPoint[];
  genderBoxPlotMetrics: GenderBoxPlotMetric[];
  workflow: WorkflowSankeyData;
  roadmapGroups: RoadmapGroup[];
  roadmapItems: RoadmapItem[];
  deliveryRows: DeliveryRow[];
  portfolioGridRows: PortfolioGridRow[];
}

export interface ApiResponse<TData> {
  status: 'success';
  data: TData;
  generatedAt: string;
  latencyMs: number;
}
