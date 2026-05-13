import type { PropsWithChildren } from 'react';

interface ChartModuleFrameProps {
  isEmpty: boolean;
  emptyMessage: string;
}

export const ChartModuleFrame = ({
  isEmpty,
  emptyMessage,
  children,
}: PropsWithChildren<ChartModuleFrameProps>) => (
  <div className="chart-module">
    {isEmpty ? (
      <div className="chart-empty-state" role="status">
        <span aria-hidden="true" />
        <strong>{emptyMessage}</strong>
      </div>
    ) : (
      children
    )}
  </div>
);
