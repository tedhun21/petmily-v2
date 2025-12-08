import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type ThresholdOption = { value: number; unit: 'px' | '%' };

interface UseScrollOptions {
  ref: React.RefObject<HTMLElement | null>;
  thresholds?: {
    nearTop?: ThresholdOption;
    nearBottom?: ThresholdOption;
    farFromTop?: ThresholdOption;
    farFromBottom?: ThresholdOption;
  };
}

const resolveThreshold = (threshold: ThresholdOption | undefined, scrollHeight: number): number => {
  if (!threshold) return 0;
  if (threshold.unit === 'px') {
    return threshold.value;
  }
  return (threshold.value * scrollHeight) / 100;
};

export const useScroll = ({ ref, thresholds = {} }: UseScrollOptions) => {
  const { nearTop, nearBottom, farFromTop, farFromBottom } = thresholds;

  const scrollInfoRef = useRef({ x: 0, y: 0, yDirection: null as 'up' | 'down' | null });

  const [isAtTop, setIsAtTop] = useState<boolean | null>(null); // 최상단인지
  const [isAtBottom, setIsAtBottom] = useState<boolean | null>(null); // 최하단인지
  const [isNearTop, setIsNearTop] = useState<boolean | null>(null); // 최상단 입계값 이내
  const [isNearBottom, setIsNearBottom] = useState<boolean | null>(null); // 최하단 임계값 이내
  const [isFarFromTop, setIsFarFromTop] = useState<boolean | null>(null); // 최상단 임계값 넘어
  const [isFarFromBottom, setIsFarFromBottom] = useState<boolean | null>(null); // 최하단 임계값 넘어

  const lastY = useRef(0);

  const handleScroll = useCallback(() => {
    const target = ref.current;
    if (!target) return;

    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = target;

    const newY = scrollTop;
    const direction = newY > lastY.current ? 'down' : 'up';
    lastY.current = newY;

    scrollInfoRef.current = {
      x: scrollLeft,
      y: newY,
      yDirection: direction,
    };

    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    setIsAtTop(scrollTop === 0);
    setIsAtBottom(Math.abs(distanceFromBottom) < 1);

    if (nearTop) {
      const nearTopThresholdPx = resolveThreshold(nearTop, scrollHeight);
      setIsNearTop(scrollTop <= nearTopThresholdPx);
    }

    if (nearBottom) {
      const nearBottomThresholdPx = resolveThreshold(nearBottom, scrollHeight);
      setIsNearBottom(scrollHeight > clientHeight && distanceFromBottom <= nearBottomThresholdPx);
    }

    if (farFromTop) {
      const farFromTopThresholdPx = resolveThreshold(farFromTop, scrollHeight);
      setIsFarFromTop(scrollTop > farFromTopThresholdPx);
    }

    if (farFromBottom) {
      const farFromBottomThresholdPx = resolveThreshold(farFromBottom, scrollHeight);

      setIsFarFromBottom(distanceFromBottom > farFromBottomThresholdPx);
    }
  }, [ref, nearTop, nearBottom, farFromTop, farFromBottom]);

  const scrollToTop = useCallback(
    (options?: { behavior: 'smooth' | 'auto' }) => {
      if (ref.current) {
        ref.current.scrollTo({ top: 0, behavior: options?.behavior || 'auto' });
      }
    },
    [ref],
  );

  const scrollToBottom = useCallback(
    (options?: { behavior: 'smooth' | 'auto' }) => {
      if (ref.current) {
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: options?.behavior || 'auto' });
      }
    },
    [ref],
  );

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    handleScroll();

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref, handleScroll]);

  return {
    scrollInfo: scrollInfoRef,
    isAtTop,
    isNearTop,
    isFarFromTop,
    isAtBottom,
    isNearBottom,
    isFarFromBottom,
    scrollToTop,
    scrollToBottom,
  };
};
