import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  placement?: Placement;
  offset?: number;
  width?: string;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('Popover Context 에러');
  return context;
}

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface PopoverProps {
  children: React.ReactNode;
  anchorRef?: React.RefObject<HTMLElement | null>;
  open?: boolean; // controlled
  onOpenChange?: (open: boolean) => void; // controlled 콜백
  onCloseChange?: () => void;
  defaultOpen?: boolean; // uncontrolled 초기값
  placement?: Placement;
  offset?: number;
}

function Popover({
  children,
  anchorRef,
  open: controlledOpen,
  onOpenChange,
  onCloseChange,
  defaultOpen = false,
  placement = 'bottom-start',
  offset = 0,
}: PopoverProps) {
  // 제어, 비제어인지 판단
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const positioningAnchorRef = anchorRef || triggerRef;

  // controlled 인지 판단
  const isControlled = controlledOpen !== undefined;

  // uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  // 실제 사용할 isOpen 값
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // setIsOpen 함수 (controlled/uncontrolled 모두 처리)
  const setIsOpen = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setUncontrolledOpen(newOpen);
        onOpenChange?.(newOpen);
      }

      // ✅ 닫힐 때 onCloseChange 호출
      if (!newOpen) {
        onCloseChange?.();
      }
    },
    [isControlled, onOpenChange, onCloseChange],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedElement = e.target as Node;

      // trigger 클릭 무시
      if (triggerRef.current && triggerRef.current.contains(clickedElement)) {
        return;
      }

      // content 클릭 무시
      if (contentRef.current && contentRef.current.contains(clickedElement)) {
        return;
      }

      // 외부 클릭 시 닫기
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, triggerRef, contentRef, setIsOpen]);

  return (
    <PopoverContext.Provider
      value={{
        isOpen,
        setIsOpen,
        anchorRef: positioningAnchorRef,
        triggerRef,
        contentRef,
        placement,
        offset,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Trigger({ children }: { children: React.ReactElement<React.HTMLAttributes<HTMLElement>> }) {
  const { triggerRef, setIsOpen } = usePopoverContext();

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      onClick={() => setIsOpen(true)}
      css={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );
}

function Content({ children, width }: { children: React.ReactNode; width?: string }) {
  const { isOpen, anchorRef, contentRef, placement, offset } = usePopoverContext();

  const [position, setPosition] = useState<CSSProperties>({ top: 0, left: 0 });
  const portalRef = document.getElementById('portal-root');

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef || !anchorRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorRef.current!.getBoundingClientRect();
      const offsetValue = offset || 0;

      const styles: CSSProperties = {
        position: 'fixed',
      };

      if (width === '100%') {
        styles.width = `${anchorRect.width}px`;
      } else if (width) {
        styles.width = width;
      }

      switch (placement) {
        case 'bottom-start':
          styles.top = `${anchorRect.bottom + offsetValue}px`;
          styles.left = `${anchorRect.left}px`;
          break;

        case 'bottom-end':
          styles.top = `${anchorRect.bottom + offsetValue}px`;
          styles.right = `${window.innerWidth - anchorRect.right}px`;
          break;

        case 'top-start':
          styles.bottom = `${window.innerHeight - anchorRect.top + offsetValue}px`;
          styles.left = `${anchorRect.left}px`;
          break;

        case 'top-end':
          styles.bottom = `${window.innerHeight - anchorRect.top + offsetValue}px`;
          styles.right = `${window.innerWidth - anchorRect.right}px`;
          break;
      }

      setPosition(styles);
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, width, placement, offset, anchorRef]);

  if (!portalRef) return null;

  return createPortal(
    <ContentWrapper ref={contentRef} isOpen={isOpen} style={position}>
      {children}
    </ContentWrapper>,
    portalRef,
  );
}

const ContentWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;

  z-index: ${({ theme }) => theme.zIndices.popover};

  transition:
    opacity 0.2s ease-in-lut,
    transform 0.2s ease-in-out;

  ${({ isOpen }) =>
    isOpen
      ? css`
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        `
      : css`
          /* 닫혔을 때 */
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px); /* 살짝 올라가는 효과 */
          pointer-events: none; /* 클릭 방지 */
        `}
`;

Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover;
