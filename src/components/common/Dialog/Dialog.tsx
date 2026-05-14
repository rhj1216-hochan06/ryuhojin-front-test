import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  titleId: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  surfaceClassName?: string;
  closeOnOverlayClick?: boolean;
}

export const Dialog = ({
  open,
  titleId,
  closeLabel,
  onClose,
  children,
  className,
  surfaceClassName,
  closeOnOverlayClick = true,
}: DialogProps) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className={['common-dialog', className].filter(Boolean).join(' ')}
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={['common-dialog__surface', surfaceClassName]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="common-dialog__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
