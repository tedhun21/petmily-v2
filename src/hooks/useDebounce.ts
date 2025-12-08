import { useCallback, useEffect, useRef, useState } from 'react';

export const useDebounceValue = <T>(value: T, delay: number): T => {
  // 디바운스된 값을 저장하는 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // value가 변경될 때마다 새로운 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value); // delay 후 최신 value로 상태 업데이트
    }, delay);

    // 클린업 함수: 다음 effect가 실행되거나 컴포넌트 언마운트 시 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value나 delay가 변할 때마다 effect 재실행

  return debouncedValue; // 디바운스된 값을 반환
};

/** Always-Fresh Ref
 * 콜백을 ref로 캡쳐하는 이유
 * 1. 만약 debouncedCallback의 의존성으로 callback 함수를 넣고 callback을 그대로 실행하면?
 * 1-1. 그 callback의 클로저(내부에서 사용하는 state나 props 등의 값)가 변하면 callback 함수의 참조도 변한다.
 * 1-2. 이로 인해 useCallback은 debouncedCallback을 불필요하게 계속해서 다시 생성(재호출)할 수 있다.
 * 2. 이걸 해결하기 위해, 만약 debouncedCallback 의존성 배열에 delay만 넣고 넘어온 callback를 바로 실행(callbackRef.current없이 callback함수 직접 사용)하면?
 * 2-1. debouncedCallback은 useCallback의 의존성 배열에 callback이 없으므로, 초기 렌더링 시점의 callback함수를 클로저로 캡처하게 된다
 * 2-2. 이로 인해 callback 함수가 내부에서 사용하는 state나 props의 값이 최신이 아닌, 오래된 값을 참조하는 stale closure 문제가 발생할 수 있다 (최신 상태가 아닐 수 았다)
 * 3. callback을 ref로 저장하는 이유?
 * 3-1. useRef와 useEffect를 사용하여 callbackRef.current가 항상 callback 함수의 최신 참조를 가키리도록 한다
 * 3-2. 이렇게 함으로써 debouncedCallback 함수의 참조는 delay가 변하지 않는 한 안정적으로 유지되면서도(1번 문제 해결),
 *  debouncedCallback 내부에서 callbackRef.current를 통해 호출되는 callback 함수는 항상 최신 클로저 상태를 반영하여 실행된다(2번 문제 해결)
 */
export const useDebounce = <T extends unknown[]>(callback: (..._args: T) => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const latestArgsRef = useRef<T | null>(null); // flush 사용 시 필요한 마지막 인자를 저장

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: T) => {
      latestArgsRef.current = args;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
        latestArgsRef.current = null;
      }, delay);
    },
    [delay],
  );

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (latestArgsRef.current) {
        // 대기 중인 인자가 있다면
        callbackRef.current(...(latestArgsRef.current as T)); // 즉시 실행
        latestArgsRef.current = null; // 실행 후 인자 초기화
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      latestArgsRef.current = null; // 취소 후 인자 초기화
    }
  }, []);

  return { debouncedCallback, flush, cancel };
};
