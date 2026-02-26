import { cloneElement, createContext, useContext, useState } from 'react';

// Context 타입: 열림 상태(isOpen)와 토글 함수(toggle)를 포함
interface AccordionContextType {
  isOpen: boolean;
  toggle: () => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Context를 사용하기 위한 커스텀 훅
function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion Context 에러');
  }
  return context;
}

// Accordion 컴포넌트의 Props 타입 정의
interface AccordionProps {
  children: React.ReactNode;
  isOpen?: boolean; // 제어 모드: 외부에서 받는 열림 상태
  defaultOpen?: boolean; // 비제어 모드: 초기에 열려있을지 여부
  onToggle?: () => void; // 제어 모드: 상태 변경을 부모에게 알리는 콜백 함수
}

// 1. 제어(Controlled) 모드
// 2. 비제어(Uncontrolled) 모드
function Accordion({ children, isOpen: controlledIsOpen, defaultOpen = false, onToggle }: AccordionProps) {
  // 비제어 모드일 때만 사용하는 내부 상태
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // `isOpen` prop이 전달되었는지 여부로 제어 모드인지 판단
  const isControlled = controlledIsOpen !== undefined;

  // 현재 열림 상태 결정: 제어 모드이면 부모가 준 값을, 아니면 내부 상태 값을 사용
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  // 토글 함수
  const toggle = () => {
    // 제어 모드이면 부모에게 상태 변경을 위임 (onToggle 콜백 호출)
    if (onToggle) {
      onToggle();
    }
    // 비제어 모드이면 내부 상태를 직접 변경
    if (!isControlled) {
      setUncontrolledIsOpen((prev) => !prev);
    }
  };

  // Provider를 통해 현재 `isOpen` 상태와 `toggle` 함수를 하위 컴포넌트에 전달
  return <AccordionContext.Provider value={{ isOpen, toggle }}>{children}</AccordionContext.Provider>;
}

// --- 하위 컴포넌트들 ---

interface AccordionTriggerProps {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

// 클릭 시 토글 함수를 호출하는 Trigger 컴포넌트

function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { toggle } = useAccordionContext();

  return cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      toggle();
      children.props.onClick?.(e);
    },
  });
}

interface AccordionContentProps {
  children: React.ReactNode;
}

// isOpen 상태에 따라 내용을 보여주는 Content 컴포넌트
function AccordionContent({ children }: AccordionContentProps) {
  const { isOpen } = useAccordionContext();
  if (!isOpen) return null;

  return (
    <div
      css={{
        animation: 'slideDown 0.3s ease-out',
        '@keyframes slideDown': {
          from: {
            opacity: 0,
            transform: 'translateY(-10px)',
          },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {children}
    </div>
  );
}

// 컴파운드 컴포넌트로 구성
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export default Accordion;
