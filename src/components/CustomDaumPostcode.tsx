import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeProvider';

interface IProps {
  onComplete: (data: any) => void;
  style?: { width?: string; height?: string };
}

const lightThemeObj = {
  bgColor: '#ECECEC', //바탕 배경색
  searchBgColor: '#FFFFFF', //검색창 배경색
  contentBgColor: '#FFFFFF', //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
  pageBgColor: '#FAFAFA', //페이지 배경색
  textColor: '#333333', //기본 글자색
  queryTextColor: '#222222', //검색창 글자색
  postcodeTextColor: '#FA4256', //우편번호 글자색
  emphTextColor: '#008BD3', //강조 글자색
  outlineColor: '#E0E0E0', //테두리
};

const darkThemeObj = {
  bgColor: '#162525', //바탕 배경색
  searchBgColor: '#162525', //검색창 배경색
  contentBgColor: '#162525', //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
  pageBgColor: '#162525', //페이지 배경색
  textColor: '#FFFFFF', //기본 글자색
  queryTextColor: '#FFFFFF', //검색창 글자색
  postcodeTextColor: '#FA4256', //우편번호 글자색
  emphTextColor: '#008BD3', //강조 글자색
  outlineColor: '#444444', //테두리
};

export default function CustomDaumPostcode({ onComplete, style }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    // Daum Postcode API 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const { daum } = window as any;
      if (daum && daum.Postcode) {
        // 주소 검색 UI를 body에 직접 삽입
        const postcode = new daum.Postcode({
          width: style?.width || '100%',
          height: style?.height || 'auto',
          theme: isDarkMode ? darkThemeObj : lightThemeObj,
          oncomplete: (data: any) => {
            onComplete(data);
          },
        });

        if (containerRef.current) {
          postcode.embed(containerRef.current);
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={containerRef} />;
}
