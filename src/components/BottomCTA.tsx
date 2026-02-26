import { useTheme } from '@emotion/react';
import { useEffect, useRef } from 'react';

interface BottomCTAProps {
  children: React.ReactNode;
  padding?: string;
}

function BottomCTA({ children, padding = '16px' }: BottomCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetHeight;
      document.documentElement.style.setProperty('--bottom-cta-height', `${height}px`);
    }
  });

  return (
    <div
      ref={ref}
      css={{
        position: 'fixed',
        bottom: 0,
        maxWidth: '600px',
        width: '100%',
        padding,
        zIndex: theme.zIndices.bottomCTA,
      }}
    >
      {children}
    </div>
  );
}

export default BottomCTA;
