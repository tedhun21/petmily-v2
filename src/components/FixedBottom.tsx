import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface IProps {
  children: React.ReactNode;
  hasSafeAreaPadding?: boolean;
}

export default function FixedBottom({ children, hasSafeAreaPadding = false }: IProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasSafeAreaPadding && ref.current) {
      const totalHeight = ref.current.offsetHeight;

      document.documentElement.style.setProperty('--safe-area-bottom', `${totalHeight}px`);

      return () => {
        document.documentElement.style.setProperty('--safe-area-bottom', '0px');
      };
    }
  }, [hasSafeAreaPadding]);

  return (
    <Fixed ref={ref}>
      <Float>{children}</Float>
    </Fixed>
  );
}

const Fixed = styled.div`
  position: fixed;
  bottom: 0;
  max-width: 600px;
  width: 100%;
`;

const Float = styled.div`
  padding: ${({ theme }) => theme.space.md};
  width: 100%;
`;
