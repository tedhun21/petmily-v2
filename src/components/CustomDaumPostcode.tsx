import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from './contexts/ThemeProvider';

// -------------------------------------------------------------------
// 1. Daum Postcode API가 반환하는 주소 데이터 타입 정의
// -------------------------------------------------------------------
export interface PostcodeData {
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  roadAddress: string;
  zonecode: string;
  [key: string]: unknown;
}

// -------------------------------------------------------------------
// 2. Window 객체에 추가되는 Daum Postcode 객체 타입 정의
// -------------------------------------------------------------------
interface PostcodeTheme {
  bgColor: string;
  searchBgColor: string;
  contentBgColor: string;
  pageBgColor: string;
  textColor: string;
  queryTextColor: string;
  postcodeTextColor: string;
  emphTextColor: string;
  outlineColor: string;
}

interface PostcodeOptions {
  width: string;
  height: string;
  theme: PostcodeTheme;
  oncomplete: (data: PostcodeData) => void;
  onresize?: (size: { width: number; height: number }) => void;
}

interface DaumPostcodeInstance {
  embed: (container: HTMLElement) => void;
}

interface DaumPostcode {
  new (options: PostcodeOptions): DaumPostcodeInstance;
}

declare global {
  interface Window {
    daum?: {
      Postcode?: DaumPostcode;
    };
  }
}
// -------------------------------------------------------------------

interface IProps {
  width?: string;
  height?: string;
  maxHeight?: number;
  onComplete: (data: PostcodeData) => void;
}

const lightThemeObj: PostcodeTheme = {
  bgColor: '#ECECEC',
  searchBgColor: '#FFFFFF',
  contentBgColor: '#FFFFFF',
  pageBgColor: '#FAFAFA',
  textColor: '#333333',
  queryTextColor: '#222222',
  postcodeTextColor: '#FA4256',
  emphTextColor: '#008BD3',
  outlineColor: '#E0E0E0',
};

const darkThemeObj: PostcodeTheme = {
  bgColor: '#162525',
  searchBgColor: '#162525',
  contentBgColor: '#162525',
  pageBgColor: '#162525',
  textColor: '#FFFFFF',
  queryTextColor: '#FFFFFF',
  postcodeTextColor: '#FA4256',
  emphTextColor: '#008BD3',
  outlineColor: '#444444',
};

export default function CustomDaumPostcode({ width = '100%', height = 'auto', maxHeight = 600, onComplete }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const currentContainer = containerRef.current;

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    const onLoad = () => {
      const daum = window.daum;
      if (daum && daum.Postcode && currentContainer) {
        const postcode = new daum.Postcode({
          width,
          height,
          theme: isDarkMode ? darkThemeObj : lightThemeObj,
          oncomplete: (data) => {
            onComplete(data);
          },
          onresize: (size) => {
            if (currentContainer) {
              const nextHeight = size.height;

              // 내가 정한 높이까지만 늘리기
              currentContainer.style.height = nextHeight > maxHeight ? `${maxHeight}px` : `${nextHeight}px`;

              // 초과하는 경우 내부가 스크롤되도록
              currentContainer.style.overflow = 'auto';
            }
          },
        });

        if (currentContainer) {
          postcode.embed(currentContainer);
        }
      }
    };

    script.addEventListener('load', onLoad);

    return () => {
      document.body.removeChild(script);
      script.removeEventListener('load', onLoad);

      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [isDarkMode, width, height, maxHeight, onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        width: width ? `${width}px` : '100%',
        height: 'auto',
        maxHeight,
        overflow: 'auto', // 내부 스크롤
      }}
    />
  );
}
