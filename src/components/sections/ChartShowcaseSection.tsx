import type { DashboardPayload } from '../../types/dashboard';
import {
  buildBusinessTrendOption,
  buildQualityScatterOption,
  buildWorkflowSankeyOption,
} from '../../features/charts/chartOptions';
import { EChart } from '../../features/charts/EChart';
import { useChartShowcaseData } from '../../features/charts/useChartShowcaseData';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface ChartShowcaseSectionProps {
  section: {
    eyebrow: string;
    title: string;
    description: string;
  };
  payload: DashboardPayload;
}

export const ChartShowcaseSection = ({
  section,
  payload,
}: ChartShowcaseSectionProps) => {
  const chartData = useChartShowcaseData(payload);

  return (
    <Section
      id="charts"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="grid grid--2 chart-grid">
        <Card
          title="Bar + Line"
          description="월별 매출 index, 사용자 수, 전환율을 하나의 option builder에서 생성합니다."
        >
          <EChart
            option={buildBusinessTrendOption(chartData.businessTrend)}
            ariaLabel="Monthly revenue, active users, and conversion rate chart"
          />
        </Card>
        <Card
          title="Scatter Statistics"
          description="기능별 리드타임, 결함률, 복잡도를 scatter로 비교합니다."
        >
          <EChart
            option={buildQualityScatterOption(chartData.qualityDistribution)}
            ariaLabel="Feature quality scatter chart"
          />
        </Card>
        <Card
          className="chart-card--wide"
          title="Sankey Flow"
          description="mock API부터 README까지 이어지는 데이터 흐름을 Sankey로 표현합니다."
        >
          <EChart
            option={buildWorkflowSankeyOption(chartData.workflow)}
            ariaLabel="Dashboard data workflow sankey chart"
            height={340}
          />
        </Card>
      </div>
    </Section>
  );
};

