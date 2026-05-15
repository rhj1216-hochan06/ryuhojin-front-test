import type { PropsWithChildren, ReactNode } from 'react';
import { useId, useState } from 'react';

interface TogglePanelProps {
  label: string;
  title?: ReactNode;
  description?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
}

export const TogglePanel = ({
  label,
  title,
  description,
  defaultOpen = false,
  className,
  buttonClassName,
  panelClassName,
  children,
}: PropsWithChildren<TogglePanelProps>) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={['common-toggle-panel', className].filter(Boolean).join(' ')}>
      <div className="common-toggle-panel__header">
        <div>
          {title && <strong>{title}</strong>}
          {description && <p>{description}</p>}
        </div>
        <button
          type="button"
          className={['common-toggle-panel__button', buttonClassName]
            .filter(Boolean)
            .join(' ')}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {label}
        </button>
      </div>
      {isOpen && (
        <div
          id={panelId}
          className={['common-toggle-panel__body', panelClassName]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      )}
    </div>
  );
};
