import { useEffect } from 'react';

export function useOutsideClick(ref: HTMLElement | null, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!ref || ref.contains(target)) return;

      handler();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}
