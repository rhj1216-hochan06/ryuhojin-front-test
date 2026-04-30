import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchInfiniteRenderRows } from '../mocks/api';
import type { InfiniteRenderRow } from '../types/dashboard';

const INITIAL_PAGE = 1;

interface UseInfiniteMockRowsResult {
  rows: InfiniteRenderRow[];
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  viewportRef: (node: HTMLDivElement | null) => void;
  sentinelRef: (node: HTMLDivElement | null) => void;
}

export const useInfiniteMockRows = (pageSize = 10): UseInfiniteMockRowsResult => {
  const [rows, setRows] = useState<InfiniteRenderRow[]>([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const isRequestingRef = useRef(false);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (isRequestingRef.current) {
        return;
      }

      isRequestingRef.current = true;
      nextPage === INITIAL_PAGE ? setIsInitialLoading(true) : setIsLoadingMore(true);

      try {
        const response = await fetchInfiniteRenderRows(nextPage, pageSize);

        setRows((current) =>
          nextPage === INITIAL_PAGE
            ? response.data.items
            : [...current, ...response.data.items],
        );
        setTotal(response.data.total);
        setHasNextPage(response.data.hasNextPage);
        setPage(nextPage);
      } finally {
        isRequestingRef.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  const loadMore = useCallback(() => {
    if (!hasNextPage || isRequestingRef.current) {
      return;
    }

    void loadPage(page + 1);
  }, [hasNextPage, loadPage, page]);

  const setViewportRef = useCallback((node: HTMLDivElement | null) => {
    setViewportNode(node);
  }, []);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinelNode(node);
  }, []);

  useEffect(() => {
    void loadPage(INITIAL_PAGE);
  }, [loadPage]);

  useEffect(() => {
    if (!viewportNode || !sentinelNode) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: viewportNode,
        rootMargin: '120px 0px',
      },
    );

    observer.observe(sentinelNode);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, sentinelNode, viewportNode]);

  useEffect(() => {
    if (!viewportNode) {
      return undefined;
    }

    const loadWhenNearBottom = () => {
      const remainingScroll =
        viewportNode.scrollHeight - viewportNode.scrollTop - viewportNode.clientHeight;

      if (remainingScroll < 96) {
        loadMore();
      }
    };

    viewportNode.addEventListener('scroll', loadWhenNearBottom, { passive: true });
    loadWhenNearBottom();

    return () => {
      viewportNode.removeEventListener('scroll', loadWhenNearBottom);
    };
  }, [loadMore, viewportNode]);

  useEffect(() => {
    if (!viewportNode || !hasNextPage || isRequestingRef.current) {
      return;
    }

    const isScrollable = viewportNode.scrollHeight > viewportNode.clientHeight + 8;

    if (!isScrollable) {
      loadMore();
    }
  }, [hasNextPage, loadMore, rows.length, viewportNode]);

  return {
    rows,
    total,
    isInitialLoading,
    isLoadingMore,
    hasNextPage,
    viewportRef: setViewportRef,
    sentinelRef,
  };
};
