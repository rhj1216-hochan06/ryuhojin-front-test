import { useState, type ChangeEvent } from 'react';
import type {
  ChartCardScenarioId,
  ChartCardScenarioMap,
  ChartShowcaseCardKey,
  DashboardPayload,
  GlobalChartScenarioId,
} from '../../types/dashboard';
import type {
  ChartCardCopy,
  ChartOptionLabels,
  ChartScenarioCopy,
  SankeyCopy,
  SectionCopy,
} from '../../i18n/dictionary';
import { BusinessTrendChart } from '../../features/charts/chartModules/BusinessTrendChart';
import { CapabilityTreemapChart } from '../../features/charts/chartModules/CapabilityTreemapChart';
import { CategoryShareChart } from '../../features/charts/chartModules/CategoryShareChart';
import { FlowSankeyChart } from '../../features/charts/chartModules/FlowSankeyChart';
import { GenderBoxPlotChart } from '../../features/charts/chartModules/GenderBoxPlotChart';
import { ImplementationTrendChart } from '../../features/charts/chartModules/ImplementationTrendChart';
import { QualityScatterChart } from '../../features/charts/chartModules/QualityScatterChart';
import { useChartShowcaseData } from '../../features/charts/useChartShowcaseData';
import { Card } from '../ui/Card';
import { FloatingRefreshButton } from '../ui/FloatingRefreshButton';
import { Section } from '../ui/Section';

interface ChartShowcaseSectionProps {
  section: SectionCopy;
  refreshLabel: string;
  chartScenarios: ChartScenarioCopy;
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

const globalChartScenarioIds: readonly GlobalChartScenarioId[] = ['normal', 'empty'];

const chartCardScenarioIds: Record<
  ChartShowcaseCardKey,
  readonly ChartCardScenarioId[]
> = {
  businessTrend: ['normal', 'missingXAxis', 'zeroValues'],
  implementationTrend: ['normal', 'missingXAxis', 'zeroValues'],
  capabilityTreemap: ['normal'],
  qualityScatter: ['normal'],
  genderBoxPlot: ['normal', 'outlierHeavyBoxplot'],
  categoryShare: ['normal', 'zeroValues', 'singleSlice'],
  sankey: ['normal', 'zeroValues', 'smallSankeyValues'],
};

export const ChartShowcaseSection = ({
  section,
  refreshLabel,
  chartScenarios,
  chartCards,
  chartOptionLabels,
  sankeyCopy,
  payload,
}: ChartShowcaseSectionProps) => {
  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  const [globalChartScenario, setGlobalChartScenario] =
    useState<GlobalChartScenarioId>('normal');
  const [chartCardScenarios, setChartCardScenarios] =
    useState<ChartCardScenarioMap>({});
  const chartData = useChartShowcaseData(
    payload,
    chartRefreshKey,
    globalChartScenario,
    chartCardScenarios,
  );
  const refreshCharts = () => setChartRefreshKey((current) => current + 1);
  const selectedScenarioCopy = chartScenarios.options[globalChartScenario];
  const handleGlobalScenarioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGlobalChartScenario(event.target.value as GlobalChartScenarioId);
  };
  const handleCardScenarioChange =
    (cardKey: ChartShowcaseCardKey) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextScenario = event.target.value as ChartCardScenarioId;

      setChartCardScenarios((current) => ({
        ...current,
        [cardKey]: nextScenario,
      }));
    };
  const renderCardScenarioControl = (cardKey: ChartShowcaseCardKey) => {
    if (globalChartScenario !== 'normal') {
      return null;
    }

    const scenarioIds = chartCardScenarioIds[cardKey];

    if (scenarioIds.length <= 1) {
      return null;
    }

    return (
      <label className="chart-card-scenario-control">
        <span>{chartScenarios.cardLabel}</span>
        <select
          value={chartCardScenarios[cardKey] ?? 'normal'}
          onChange={handleCardScenarioChange(cardKey)}
        >
          {scenarioIds.map((scenarioId) => (
            <option key={scenarioId} value={scenarioId}>
              {chartScenarios.edgeCaseOptions[scenarioId].label}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <>
      <FloatingRefreshButton label={refreshLabel} onRefresh={refreshCharts} />
      <Section
        id="charts"
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        actions={
          <div className="chart-scenario-control">
            <label>
              <span>{chartScenarios.label}</span>
              <select value={globalChartScenario} onChange={handleGlobalScenarioChange}>
                {globalChartScenarioIds.map((scenarioId) => (
                  <option key={scenarioId} value={scenarioId}>
                    {chartScenarios.options[scenarioId].label}
                  </option>
                ))}
              </select>
            </label>
            <p>{selectedScenarioCopy.description}</p>
          </div>
        }
      >
        <div className="grid grid--2 chart-grid">
          <Card
            title={chartCards.businessTrend.title}
            description={chartCards.businessTrend.description}
            aside={renderCardScenarioControl('businessTrend')}
          >
            <BusinessTrendChart
              metrics={chartData.businessTrend}
              labels={chartOptionLabels.businessTrend}
              copy={chartCards.businessTrend}
              isEmpty={chartData.businessTrend.length === 0}
            />
          </Card>
          <Card
            title={chartCards.implementationTrend.title}
            description={chartCards.implementationTrend.description}
            aside={renderCardScenarioControl('implementationTrend')}
          >
            <ImplementationTrendChart
              metrics={chartData.implementationTrend}
              labels={chartOptionLabels.implementationTrend}
              copy={chartCards.implementationTrend}
              isEmpty={chartData.implementationTrend.length === 0}
            />
          </Card>
          <Card
            title={chartCards.capabilityTreemap.title}
            description={chartCards.capabilityTreemap.description}
            aside={renderCardScenarioControl('capabilityTreemap')}
          >
            <CapabilityTreemapChart
              nodes={chartData.capabilityTree}
              emptyLabel={chartOptionLabels.categoryShare.emptyLabel}
              copy={chartCards.capabilityTreemap}
              isEmpty={chartData.capabilityTree.length === 0}
            />
          </Card>
          <Card
            title={chartCards.qualityScatter.title}
            description={chartCards.qualityScatter.description}
            aside={renderCardScenarioControl('qualityScatter')}
          >
            <QualityScatterChart
              points={chartData.qualityDistribution}
              labels={chartOptionLabels.qualityScatter}
              copy={chartCards.qualityScatter}
              isEmpty={chartData.qualityDistribution.length === 0}
            />
          </Card>
          <Card
            title={chartCards.genderBoxPlot.title}
            description={chartCards.genderBoxPlot.description}
            aside={renderCardScenarioControl('genderBoxPlot')}
          >
            <GenderBoxPlotChart
              metrics={chartData.genderBoxPlot}
              labels={chartOptionLabels.genderBoxPlot}
              copy={chartCards.genderBoxPlot}
              isEmpty={chartData.genderBoxPlot.length === 0}
            />
          </Card>
          <Card
            title={chartCards.categoryShare.title}
            description={chartCards.categoryShare.description}
            aside={renderCardScenarioControl('categoryShare')}
          >
            <CategoryShareChart
              shares={chartData.categoryShare}
              labels={chartOptionLabels.categoryShare}
              copy={chartCards.categoryShare}
              isEmpty={chartData.categoryShare.length === 0}
            />
          </Card>
          <Card
            className="chart-card--wide"
            title={chartCards.sankey.title}
            description={chartCards.sankey.description}
            aside={renderCardScenarioControl('sankey')}
          >
            <FlowSankeyChart workflow={chartData.workflow} copy={sankeyCopy} />
          </Card>
        </div>
      </Section>
    </>
  );
};
