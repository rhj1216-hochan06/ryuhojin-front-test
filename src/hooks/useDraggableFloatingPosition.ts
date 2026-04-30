import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react';

interface FloatingPositionOptions {
  bottomOffset?: number;
  buttonSize?: number;
  dragThreshold?: number;
  headerSelector?: string;
  margin?: number;
}

interface DragState {
  pointerId: number;
  startY: number;
  startTop: number;
}

const defaultOptions = {
  bottomOffset: 32,
  buttonSize: 52,
  dragThreshold: 5,
  headerSelector: '.site-header',
  margin: 16,
};

const canUseWindow = () => typeof window !== 'undefined';

const getHeaderBottom = (headerSelector: string) => {
  if (!canUseWindow()) {
    return 0;
  }

  return document.querySelector(headerSelector)?.getBoundingClientRect().bottom ?? 0;
};

const getBounds = (
  buttonSize: number,
  margin: number,
  headerSelector: string,
) => {
  if (!canUseWindow()) {
    return { minTop: 0, maxTop: 0 };
  }

  const minTop = getHeaderBottom(headerSelector) + margin;
  const maxTop = window.innerHeight - buttonSize - margin;

  return {
    minTop,
    maxTop: Math.max(minTop, maxTop),
  };
};

const clampTop = (
  value: number,
  buttonSize: number,
  margin: number,
  headerSelector: string,
) => {
  const { minTop, maxTop } = getBounds(buttonSize, margin, headerSelector);

  return Math.min(Math.max(value, minTop), maxTop);
};

const getDefaultTop = (
  bottomOffset: number,
  buttonSize: number,
  margin: number,
  headerSelector: string,
) => {
  if (!canUseWindow()) {
    return 0;
  }

  return clampTop(
    window.innerHeight - buttonSize - bottomOffset,
    buttonSize,
    margin,
    headerSelector,
  );
};

export const useDraggableFloatingPosition = ({
  bottomOffset = defaultOptions.bottomOffset,
  buttonSize = defaultOptions.buttonSize,
  dragThreshold = defaultOptions.dragThreshold,
  headerSelector = defaultOptions.headerSelector,
  margin = defaultOptions.margin,
}: FloatingPositionOptions = {}) => {
  const [top, setTop] = useState(() =>
    getDefaultTop(bottomOffset, buttonSize, margin, headerSelector),
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);
  const shouldSuppressClickRef = useRef(false);
  const latestTopRef = useRef(top);

  useEffect(() => {
    latestTopRef.current = top;
  }, [top]);

  useEffect(() => {
    const handleViewportChange = () => {
      setTop((current) => clampTop(current, buttonSize, margin, headerSelector));
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, [buttonSize, headerSelector, margin]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTop: latestTopRef.current,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const dragState = dragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const distance = event.clientY - dragState.startY;

      if (Math.abs(distance) > dragThreshold) {
        shouldSuppressClickRef.current = true;
        setIsDragging(true);
      }

      setTop(
        clampTop(
          dragState.startTop + distance,
          buttonSize,
          margin,
          headerSelector,
        ),
      );
    },
    [buttonSize, dragThreshold, headerSelector, margin],
  );

  const handlePointerEnd = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  const shouldSuppressClick = useCallback(() => {
    if (!shouldSuppressClickRef.current) {
      return false;
    }

    shouldSuppressClickRef.current = false;
    return true;
  }, []);

  return {
    isDragging,
    onPointerCancel: handlePointerEnd,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerEnd,
    shouldSuppressClick,
    top,
  };
};
