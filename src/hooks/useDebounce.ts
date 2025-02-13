import { useEffect, useState } from 'react';

// useSWR 전용 hook (value만 바꾸는 hook)
// (value만 바꾸는 이유: useSWR은 key의 변화로도 통신을 보내는 트리거가 있다. key에 해당하는 url을 이 value 변화로 트리거)
export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
