import { useRef, useState, useLayoutEffect, useCallback } from 'react';

type ThresholdOption = { value: number; unit: 'px' | '%' };

export interface UseScrollOptions {
  ref: React.RefObject<HTMLElement | null>;
  direction?: 'normal' | 'reverse';
  enabled?: boolean;
  thresholds?: {
    nearTop?: ThresholdOption;
    nearBottom?: ThresholdOption;
    farFromTop?: ThresholdOption;
    farFromBottom?: ThresholdOption;
  };
}

interface ScrollInfo {
  x: number;
  y: number;
  yDirection: 'up' | 'down' | null;
}

const resolveThreshold = (option: ThresholdOption, scrollHeight: number): number => {
  if (option.unit === 'px') {
    return option.value;
  }
  return (scrollHeight * option.value) / 100;
};

export const useScroll = ({ ref, direction = 'normal', enabled = true, thresholds }: UseScrollOptions) => {
  const scrollInfoRef = useRef<ScrollInfo>({ x: 0, y: 0, yDirection: null });
  const [isAtTop, setIsAtTop] = useState<boolean | null>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean | null>(null);
  const [isNearTop, setIsNearTop] = useState<boolean | null>(null);
  const [isNearBottom, setIsNearBottom] = useState<boolean | null>(null);
  const [isFarFromTop, setIsFarFromTop] = useState<boolean | null>(null);
  const [isFarFromBottom, setIsFarFromBottom] = useState<boolean | null>(null);

  const lastY = useRef(0);

  const handleScroll = useCallback(() => {
    const target = ref.current;
    if (!target) return;

    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = target;

    const newY = scrollTop;
    const yDirection = newY > lastY.current ? 'down' : 'up';
    lastY.current = newY;

    scrollInfoRef.current = {
      x: scrollLeft,
      y: newY,
      yDirection,
    };

    if (direction === 'normal') {
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsAtTop(scrollTop === 0);
      setIsAtBottom(Math.abs(distanceFromBottom) < 1);

      if (thresholds?.nearTop) {
        const nearTopThresholdPx = resolveThreshold(thresholds.nearTop, scrollHeight);
        setIsNearTop(scrollTop <= nearTopThresholdPx);
      }
      if (thresholds?.nearBottom) {
        const nearBottomThresholdPx = resolveThreshold(thresholds.nearBottom, scrollHeight);
        setIsNearBottom(scrollHeight > clientHeight && distanceFromBottom <= nearBottomThresholdPx);
      }
      if (thresholds?.farFromTop) {
        const farFromTopThresholdPx = resolveThreshold(thresholds.farFromTop, scrollHeight);
        setIsFarFromTop(scrollTop > farFromTopThresholdPx);
      }
      if (thresholds?.farFromBottom) {
        const farFromBottomThresholdPx = resolveThreshold(thresholds.farFromBottom, scrollHeight);
        setIsFarFromBottom(distanceFromBottom > farFromBottomThresholdPx);
      }
    } else {
      // direction === 'reverse'
      const distanceFromTop = scrollHeight - Math.abs(scrollTop) - clientHeight;
      const distanceFromBottom = Math.abs(scrollTop);

      setIsAtTop(distanceFromTop < 1);
      setIsAtBottom(scrollTop === 0);

      if (thresholds?.nearTop) {
        const nearTopThresholdPx = resolveThreshold(thresholds.nearTop, scrollHeight);
        setIsNearTop(distanceFromTop <= nearTopThresholdPx);
      }
      if (thresholds?.nearBottom) {
        const nearBottomThresholdPx = resolveThreshold(thresholds.nearBottom, scrollHeight);
        setIsNearBottom(scrollHeight > clientHeight && distanceFromBottom <= nearBottomThresholdPx);
      }
      if (thresholds?.farFromTop) {
        const farFromTopThresholdPx = resolveThreshold(thresholds.farFromTop, scrollHeight);
        setIsFarFromTop(distanceFromTop > farFromTopThresholdPx);
      }
      if (thresholds?.farFromBottom) {
        const farFromBottomThresholdPx = resolveThreshold(thresholds.farFromBottom, scrollHeight);
        setIsFarFromBottom(distanceFromBottom > farFromBottomThresholdPx);
      }
    }
  }, [ref, direction, thresholds]);

  const scrollToTop = useCallback(
    (options?: { behavior: 'smooth' | 'auto' }) => {
      if (ref.current) {
        const top = direction === 'normal' ? 0 : ref.current.scrollHeight;
        ref.current.scrollTo({ top, behavior: options?.behavior || 'auto' });
      }
    },
    [ref, direction],
  );

  const scrollToBottom = useCallback(
    (options?: { behavior: 'smooth' | 'auto' }) => {
      if (ref.current) {
        const top = direction === 'normal' ? ref.current.scrollHeight : 0;
        ref.current.scrollTo({ top, behavior: options?.behavior || 'auto' });
      }
    },
    [ref, direction],
  );

  useLayoutEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    handleScroll();

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref, enabled, handleScroll]);

  return {
    scrollInfoRef,
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
