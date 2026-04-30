import { useId } from 'react';
import { useDraggableFloatingPosition } from '../../hooks/useDraggableFloatingPosition';

interface FloatingRefreshButtonProps {
  label: string;
  onRefresh: () => void;
}

export const FloatingRefreshButton = ({
  label,
  onRefresh,
}: FloatingRefreshButtonProps) => {
  const tooltipId = useId();
  const {
    isDragging,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shouldSuppressClick,
    top,
  } = useDraggableFloatingPosition();

  const handleClick = () => {
    if (shouldSuppressClick()) {
      return;
    }

    onRefresh();
  };

  return (
    <div
      className={`floating-refresh${isDragging ? ' is-dragging' : ''}`}
      style={{ top }}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        onClick={handleClick}
        onPointerCancel={onPointerCancel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11a8.1 8.1 0 0 0-14.9-4.2L3 9" />
          <path d="M3 4v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 14.9 4.2L21 15" />
          <path d="M16 15h5v5" />
        </svg>
      </button>
      <span id={tooltipId} className="floating-refresh__tooltip" role="tooltip">
        {label}
      </span>
    </div>
  );
};
