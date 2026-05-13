import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { SankeyCopy } from '../../../../i18n/dictionary';
import type { SankeyLink, WorkflowSankeyData } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import generateOption, {
  getWorkflowLinkColor,
  judgmentFlowColors,
  workflowSourceOrder,
  workflowTargetOrder,
} from './option';

interface FlowSankeyChartProps {
  workflow: WorkflowSankeyData;
  copy: SankeyCopy;
}

const sumBy = (links: SankeyLink[], key: 'source' | 'target', value: string) =>
  links
    .filter((link) => link[key] === value)
    .reduce((total, link) => total + link.value, 0);

const defaultFlowHeight = 214;
const defaultFlowGap = 7.5;
const minimumValueLabelGap = 16;

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

const readPixelVariable = (
  element: HTMLElement,
  variableName: string,
  fallback: number,
) => {
  const value = getComputedStyle(element).getPropertyValue(variableName).trim();
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const getStackMetrics = (
  totalHeight: number,
  gap: number,
  values: number[],
  stackSlotCount?: number,
) => {
  const visibleValues = values.filter((value) => value > 0);
  const totalValue = visibleValues.reduce((total, value) => total + value, 0);
  const visibleSlotCount = stackSlotCount ?? visibleValues.length;
  const availableHeight = Math.max(
    0,
    totalHeight - Math.max(visibleSlotCount - 1, 0) * gap,
  );

  return {
    availableHeight,
    totalValue,
    visibleCount: visibleValues.length,
  };
};

const getProportionalHeight = (
  value: number,
  metrics: ReturnType<typeof getStackMetrics>,
) => {
  if (value <= 0 || metrics.totalValue <= 0 || metrics.visibleCount === 0) {
    return 0;
  }

  if (metrics.visibleCount === 1) {
    return metrics.availableHeight;
  }

  return (value / metrics.totalValue) * metrics.availableHeight;
};

const buildHeightStyle = (height: number): CSSProperties => ({
  flex: '0 0 auto',
  height,
});

const getAdjustedLabelCenters = (
  centers: number[],
  minGap: number,
  minY: number,
  maxY: number,
) => {
  if (centers.length <= 1) {
    return centers;
  }

  const availableSpan = Math.max(maxY - minY, 0);
  const requiredSpan = (centers.length - 1) * minGap;
  const effectiveGap =
    requiredSpan > availableSpan ? availableSpan / (centers.length - 1) : minGap;
  const adjusted = [...centers];

  for (let index = 1; index < adjusted.length; index += 1) {
    adjusted[index] = Math.max(adjusted[index], adjusted[index - 1] + effectiveGap);
  }

  const overflow = adjusted[adjusted.length - 1] - maxY;

  if (overflow > 0) {
    for (let index = 0; index < adjusted.length; index += 1) {
      adjusted[index] -= overflow;
    }
  }

  const underflow = minY - adjusted[0];

  if (underflow > 0) {
    for (let index = 0; index < adjusted.length; index += 1) {
      adjusted[index] += underflow;
    }
  }

  return adjusted;
};

export const FlowSankeyChart = ({ workflow, copy }: FlowSankeyChartProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [flowSize, setFlowSize] = useState({
    gap: defaultFlowGap,
    height: defaultFlowHeight,
  });
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
  const targetValueByKey = Object.fromEntries(
    targetTotals.map((node) => [node.key, node.value]),
  ) as Record<(typeof workflowTargetOrder)[number], number>;
  const sortedLinks = sortLinks(workflow.links).filter((link) => link.value > 0);
  const visibleSourceTotals = sourceTotals.filter((node) => node.value > 0);
  const visibleTargetTotals = targetTotals.filter((node) => node.value > 0);
  const sharedStackSlotCount = Math.max(
    visibleSourceTotals.length,
    visibleTargetTotals.length,
  );
  const linksByTarget = workflowTargetOrder.map((targetKey) => ({
    targetKey,
    links: sortedLinks.filter((link) => link.target === targetKey),
  }));
  const sourceMetrics = getStackMetrics(
    flowSize.height,
    flowSize.gap,
    sourceTotals.map((node) => node.value),
    sharedStackSlotCount,
  );
  const targetMetrics = getStackMetrics(
    flowSize.height,
    flowSize.gap,
    targetTotals.map((node) => node.value),
    sharedStackSlotCount,
  );
  const valueLabelDrafts = linksByTarget
    .filter(({ targetKey }) => targetValueByKey[targetKey] > 0)
    .flatMap(({ targetKey, links }, targetIndex) => {
      const groupTop = linksByTarget
        .filter(({ targetKey: previousTargetKey }) => targetValueByKey[previousTargetKey] > 0)
        .slice(0, targetIndex)
        .reduce(
          (top, { targetKey: previousTargetKey }) =>
            top +
            getProportionalHeight(targetValueByKey[previousTargetKey], targetMetrics) +
            flowSize.gap,
          0,
        );
      const targetValue = targetValueByKey[targetKey];
      const groupHeight = getProportionalHeight(targetValue, targetMetrics);
      let linkTop = 0;

      return links.map((link) => {
        const linkHeight =
          targetValue > 0 ? (link.value / targetValue) * groupHeight : 0;
        const centerY = groupTop + linkTop + linkHeight / 2;

        linkTop += linkHeight;

        return {
          centerY,
          link,
        };
      });
    });
  const adjustedValueLabelCenters = getAdjustedLabelCenters(
    valueLabelDrafts.map((label) => label.centerY),
    minimumValueLabelGap,
    minimumValueLabelGap / 2,
    flowSize.height - minimumValueLabelGap / 2,
  );
  const valueLabels = valueLabelDrafts.map((label, index) => ({
    ...label,
    centerY: adjustedValueLabelCenters[index] ?? label.centerY,
  }));
  const hasVisibleWorkflow =
    workflow.nodes.length > 0 && workflow.links.some((link) => link.value > 0);
  const option = useMemo(
    () => generateOption(workflow, copy.nodeLabels, copy.tooltipUnitLabel),
    [copy.nodeLabels, copy.tooltipUnitLabel, workflow],
  );

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const element = rootRef.current;
    const updateFlowSize = () => {
      setFlowSize({
        gap: readPixelVariable(element, '--flow-sankey-gap', defaultFlowGap),
        height: readPixelVariable(
          element,
          '--flow-sankey-height',
          defaultFlowHeight,
        ),
      });
    };

    const resizeObserver = new ResizeObserver(updateFlowSize);

    updateFlowSize();
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  if (!hasVisibleWorkflow) {
    return (
      <div ref={rootRef} className="flow-sankey-empty" aria-label={copy.ariaLabel}>
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M14 20h10c6 0 8 8 14 8h12" />
          <path d="M14 44h10c6 0 8-8 14-8h12" />
          <path d="M12 16h4v8h-4z" />
          <path d="M48 24h4v8h-4z" />
          <path d="M48 32h4v8h-4z" />
        </svg>
        <strong>{copy.emptyTitle}</strong>
        <p>{copy.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flow-sankey" aria-label={copy.ariaLabel}>
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
            {visibleSourceTotals.map((node) => (
              <div
                key={node.key}
                className="flow-sankey__node"
                style={buildHeightStyle(
                  getProportionalHeight(node.value, sourceMetrics),
                )}
              >
                {copy.nodeLabels[node.key]}
              </div>
            ))}
          </div>
        </div>
        <div className="flow-sankey__center">
          <EChart
            option={option}
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
              {visibleTargetTotals.map((node) => (
                <div
                  key={node.key}
                  className="flow-sankey__node"
                  style={buildHeightStyle(
                    getProportionalHeight(node.value, targetMetrics),
                  )}
                >
                  {copy.nodeLabels[node.key]}
                </div>
              ))}
            </div>
            <div className="flow-sankey__values">
              {valueLabels.map(({ centerY, link }) => (
                <span
                  key={`${link.source}-${link.target}`}
                  className="flow-sankey__value-label"
                  style={{
                    color: getWorkflowLinkColor(link.source, link.target),
                    top: centerY,
                  }}
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
