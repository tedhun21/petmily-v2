import { cloneElement, createContext, useContext, useState, useCallback, useMemo, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal Context 에러');
  return context;
}

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

function Modal({ children, isOpen: controlledIsOpen, setIsOpen: setControlledIsOpen }: ModalProps) {
  // 1. 내부 상태 (비제어용 및 내부 반영용)
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  // 2. 제어 여부 판단
  const isControlled = controlledIsOpen !== undefined;

  // 3. 현재 렌더링에 사용할 상태 (제어라면 외부 값, 아니면 내부 값)
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  // 4. 상태 변경 통합 핸들러
  // 제어/비제어 상관없이 내부 상태를 업데이트하고, 외부 콜백이 있다면 실행.
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setUncontrolledIsOpen(nextOpen);
      setControlledIsOpen?.(nextOpen);
    },
    [setControlledIsOpen],
  );

  // 5. Context Value 최적화
  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen: handleOpenChange,
    }),
    [isOpen, handleOpenChange],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/**
 * Trigger: 클릭 시 모달을 여는 역할
 */
function Trigger({ children }: { children: React.ReactElement<React.HTMLAttributes<HTMLElement>> }) {
  const { setIsOpen } = useModalContext();

  if (!isValidElement(children)) return null;

  return cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      setIsOpen(true);
      // 기존 children에 onClick이 있다면 함께 실행
      children.props.onClick?.(e);
    },
  });
}

/**
 * Content: 실제 모달의 내용을 렌더링 (Portal 사용)
 */
function Content({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useModalContext();

  // 클라이언트 사이드 렌더링 보장을 위해 유연하게 처리
  const modalRoot = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;

  if (!modalRoot) return null;

  return createPortal(
    <BackDrop isOpen={isOpen} onClick={() => setIsOpen(false)}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </BackDrop>,
    modalRoot,
  );
}

const BackDrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  // 애니메이션 및 가시성 처리
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
`;

Modal.Trigger = Trigger;
Modal.Content = Content;

export default Modal;
