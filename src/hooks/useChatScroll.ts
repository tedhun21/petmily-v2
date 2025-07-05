import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

type ScrollToBottomOptions = {
  behavior?: 'auto' | 'smooth';
};

interface ScrollInfo {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

const TOP_THRESHOLD_PERCENT = 30; // 상단으로 간주할 스크롤 백분율
const BOTTOM_THRESHOLD = 5; // 최하단으로 간주할 오차 범위 (px)
const SHOW_BUTTON_THRESHOLD_PERCENT = 80; // 아래로 가기 버튼이 표시될 스크롤 백분율

export const useChatScroll = ({ targetSection }: { targetSection: RefObject<HTMLElement> }) => {
  const scrollInfoRef = useRef<ScrollInfo>({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 });

  const [isTopInView, setIsTopInView] = useState<boolean>(false);
  const [isBottomInView, setIsBottomInView] = useState<boolean>(false);
  const [showDownButton, setShowDownButton] = useState<boolean>(false);

  const scrollToBottom = useCallback(
    ({ behavior = 'auto' }: ScrollToBottomOptions = {}) => {
      const el = targetSection.current;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior,
        });
      }
    },
    [targetSection],
  );

  const handleScroll = useCallback(() => {
    const el = targetSection.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    scrollInfoRef.current = { scrollTop, scrollHeight, clientHeight };

    const scrollableHeight = scrollHeight - clientHeight;

    const isAtTop = scrollableHeight <= 0 ? true : (scrollTop / scrollableHeight) * 100 <= TOP_THRESHOLD_PERCENT;
    setIsTopInView(isAtTop);

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD;
    setIsBottomInView(isAtBottom);

    if (isAtBottom) {
      setShowDownButton(false);
      return;
    }

    if (scrollableHeight > 0) {
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;
      setShowDownButton(scrollPercentage < SHOW_BUTTON_THRESHOLD_PERCENT);
    } else {
      setShowDownButton(false);
    }
  }, [targetSection]);

  useEffect(() => {
    const el = targetSection.current;
    if (!el) return;

    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [targetSection, handleScroll]);

  return { scrollInfoRef, isTopInView, isBottomInView, showDownButton, scrollToBottom };
};
