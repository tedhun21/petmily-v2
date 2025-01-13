import { useEffect, useRef, useState } from 'react';

export default function useMeasure() {
  const ref = useRef<HTMLDivElement | null>(null); // HTMLDivElement로 타입 명확화
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(([entry]) => {
        setBounds(entry.contentRect); // contentRect를 직접 사용
      });

      resizeObserver.observe(ref.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return [ref, bounds] as const; // as const로 반환 값 타입을 튜플로 명시
}
