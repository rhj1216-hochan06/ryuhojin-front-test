import { useState } from 'react';
import type { DashboardPayload } from '../../types/dashboard';
import type {
  ChartCardCopy,
  ChartOptionLabels,
  SankeyCopy,
  SectionCopy,
} from '../../i18n/dictionary';
import {
  buildCapabilityTreemapOption,
  buildCategoryShareOption,
  buildBusinessTrendOption,
  buildGenderBoxPlotOption,
  buildImplementationTrendOption,
  buildQualityScatterOption,
  getGenderBoxPlotFocusKey,
  type ChartLegendSelection,
} from '../../features/charts/chartOptions';
import { EChart, type ChartSize } from '../../features/charts/EChart';
import { FlowSankeyChart } from '../../features/charts/FlowSankeyChart';
import { useChartShowcaseData } from '../../features/charts/useChartShowcaseData';
import { Card } from '../ui/Card';
import { FloatingRefreshButton } from '../ui/FloatingRefreshButton';
import { Section } from '../ui/Section';

interface ChartShowcaseSectionProps {
  section: SectionCopy;
  refreshLabel: string;
  chartCards: {
    businessTrend: ChartCardCopy;
    implementationTrend: ChartCardCopy;
    qualityScatter: ChartCardCopy;
    genderBoxPlot: ChartCardCopy;
    capabilityTreemap: ChartCardCopy;
    categoryShare: ChartCardCopy;
    sankey: {
      title: string;
      description: string;
    };
  };
  chartOptionLabels: ChartOptionLabels;
  sankeyCopy: SankeyCopy;
  payload: DashboardPayload;
}

export const ChartShowcaseSection = ({
  section,
  refreshLabel,
  chartCards,
  chartOptionLabels,
  sankeyCopy,
  payload,
}: ChartShowcaseSectionProps) => {
  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  const chartData = useChartShowcaseData(payload, chartRefreshKey);
  const [businessTrendLegendSelection, setBusinessTrendLegendSelection] =
    useState<ChartLegendSelection>({});
  const [genderBoxPlotLegendSelection, setGenderBoxPlotLegendSelection] =
    useState<ChartLegendSelection>({});
  const [genderBoxPlotFocusKey, setGenderBoxPlotFocusKey] = useState<string | null>(
    null,
  );
  const [categoryShareSize, setCategoryShareSize] = useState<ChartSize>();
  const refreshCharts = () => setChartRefreshKey((current) => current + 1);

  return (
    <>
      <FloatingRefreshButton label={refreshLabel} onRefresh={refreshCharts} />
      <Section
        id="charts"
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      >
        <div className="grid grid--2 chart-grid">
          <Card
            title={chartCards.businessTrend.title}
            description={chartCards.businessTrend.description}
          >
            <EChart
              option={buildBusinessTrendOption(
                chartData.businessTrend,
                chartOptionLabels.businessTrend,
                businessTrendLegendSelection,
              )}
              ariaLabel={chartCards.businessTrend.ariaLabel}
              fallbackDescription={chartCards.businessTrend.fallbackDescription}
              onLegendSelectChanged={setBusinessTrendLegendSelection}
            />
          </Card>
          <Card
            title={chartCards.implementationTrend.title}
            description={chartCards.implementationTrend.description}
          >
            <EChart
              option={buildImplementationTrendOption(
                chartData.implementationTrend,
                chartOptionLabels.implementationTrend,
              )}
              ariaLabel={chartCards.implementationTrend.ariaLabel}
              fallbackDescription={chartCards.implementationTrend.fallbackDescription}
            />
          </Card>
          <Card
            title={chartCards.capabilityTreemap.title}
            description={chartCards.capabilityTreemap.description}
          >
            <EChart
              option={buildCapabilityTreemapOption(chartData.capabilityTree)}
              ariaLabel={chartCards.capabilityTreemap.ariaLabel}
              fallbackDescription={chartCards.capabilityTreemap.fallbackDescription}
            />
          </Card>
          <Card
            title={chartCards.qualityScatter.title}
            description={chartCards.qualityScatter.description}
          >
            <EChart
              option={buildQualityScatterOption(
                chartData.qualityDistribution,
                chartOptionLabels.qualityScatter,
              )}
              ariaLabel={chartCards.qualityScatter.ariaLabel}
              fallbackDescription={chartCards.qualityScatter.fallbackDescription}
            />
          </Card>
          <Card
            title={chartCards.genderBoxPlot.title}
            description={chartCards.genderBoxPlot.description}
          >
            <EChart
              option={buildGenderBoxPlotOption(
                chartData.genderBoxPlot,
                chartOptionLabels.genderBoxPlot,
                genderBoxPlotLegendSelection,
                genderBoxPlotFocusKey,
              )}
              ariaLabel={chartCards.genderBoxPlot.ariaLabel}
              fallbackDescription={chartCards.genderBoxPlot.fallbackDescription}
              onLegendSelectChanged={setGenderBoxPlotLegendSelection}
              onMouseOver={(params) =>
                setGenderBoxPlotFocusKey(getGenderBoxPlotFocusKey(params))
              }
              onMouseOut={() => setGenderBoxPlotFocusKey(null)}
            />
          </Card>
          <Card
            title={chartCards.categoryShare.title}
            description={chartCards.categoryShare.description}
          >
            <EChart
              option={buildCategoryShareOption(
                chartData.categoryShare,
                chartOptionLabels.categoryShare,
                categoryShareSize,
              )}
              ariaLabel={chartCards.categoryShare.ariaLabel}
              fallbackDescription={chartCards.categoryShare.fallbackDescription}
              onSizeChange={setCategoryShareSize}
            />
          </Card>
          <Card
            className="chart-card--wide"
            title={chartCards.sankey.title}
            description={chartCards.sankey.description}
          >
            <FlowSankeyChart workflow={chartData.workflow} copy={sankeyCopy} />
          </Card>
        </div>
      </Section>
    </>
  );
};
