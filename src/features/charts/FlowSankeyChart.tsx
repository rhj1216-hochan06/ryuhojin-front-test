import type { CSSProperties } from 'react';
import type { SankeyLink, WorkflowSankeyData } from '../../types/dashboard';
import type { SankeyCopy } from '../../i18n/dictionary';
import {
  buildWorkflowSankeyOption,
  getWorkflowLinkColor,
  judgmentFlowColors,
  workflowSourceOrder,
  workflowTargetOrder,
} from './chartOptions';
import { EChart } from './EChart';

interface FlowSankeyChartProps {
  workflow: WorkflowSankeyData;
  copy: SankeyCopy;
}

const sumBy = (links: SankeyLink[], key: 'source' | 'target', value: string) =>
  links
    .filter((link) => link[key] === value)
    .reduce((total, link) => total + link.value, 0);

const sortLinks = (links: SankeyLink[]) =>
  [...links].sort((first, second) => {
    const targetDiff =
      workflowTargetOrder.indexOf(first.target as typeof workflowTargetOrder[number]) -
      workflowTargetOrder.indexOf(second.target as typeof workflowTargetOrder[number]);

    if (targetDiff !== 0) {
      return targetDiff;
    }

    return (
      workflowSourceOrder.indexOf(first.source as typeof workflowSourceOrder[number]) -
      workflowSourceOrder.indexOf(second.source as typeof workflowSourceOrder[number])
    );
  });

const buildFlexStyle = (value: number): CSSProperties => ({
  flexGrow: Math.max(value, 1),
  flexBasis: 0,
});

export const FlowSankeyChart = ({ workflow, copy }: FlowSankeyChartProps) => {
  const numberFormatter = new Intl.NumberFormat(copy.numberLocale);
  const legendItems = [
    { label: copy.legendItems.veryImproved, color: judgmentFlowColors.veryImproved },
    { label: copy.legendItems.improved, color: judgmentFlowColors.improved },
    { label: copy.legendItems.noChange, color: judgmentFlowColors.noChange },
    { label: copy.legendItems.worsened, color: judgmentFlowColors.worsened },
    { label: copy.legendItems.veryWorsened, color: judgmentFlowColors.veryWorsened },
  ];
  const sourceTotals = workflowSourceOrder.map((source) => ({
    key: source,
    value: sumBy(workflow.links, 'source', source),
  }));
  const targetTotals = workflowTargetOrder.map((target) => ({
    key: target,
    value: sumBy(workflow.links, 'target', target),
  }));
  const sortedLinks = sortLinks(workflow.links).filter((link) => link.value > 0);

  return (
    <div className="flow-sankey" aria-label={copy.ariaLabel}>
      <div className="flow-sankey__legend" aria-label={copy.legendLabel}>
        {legendItems.map((item) => (
          <span key={item.label}>
            <i style={{ background: item.color }} aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flow-sankey__body">
        <div className="flow-sankey__side flow-sankey__side--left">
          <strong className="flow-sankey__year">{copy.previousYear}</strong>
          <div className="flow-sankey__node-stack">
            {sourceTotals.map((node) => (
              <div
                key={node.key}
                className="flow-sankey__node"
                style={buildFlexStyle(node.value)}
              >
                {copy.nodeLabels[node.key]}
              </div>
            ))}
          </div>
        </div>
        <div className="flow-sankey__center">
          <EChart
            option={buildWorkflowSankeyOption(workflow)}
            ariaLabel={copy.ariaLabel}
            fallbackDescription={copy.fallbackDescription}
            height={214}
          />
        </div>
        <div className="flow-sankey__side flow-sankey__side--right">
          <div className="flow-sankey__right-head">
            <strong className="flow-sankey__year">{copy.currentYear}</strong>
            <span>{copy.unitLabel}</span>
          </div>
          <div className="flow-sankey__right-grid">
            <div className="flow-sankey__node-stack">
              {targetTotals.map((node) => (
                <div
                  key={node.key}
                  className="flow-sankey__node"
                  style={buildFlexStyle(node.value)}
                >
                  {copy.nodeLabels[node.key]}
                </div>
              ))}
            </div>
            <div className="flow-sankey__values">
              {sortedLinks.map((link) => (
                <span
                  key={`${link.source}-${link.target}`}
                  style={{ color: getWorkflowLinkColor(link.source, link.target) }}
                >
                  {numberFormatter.format(link.value)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
