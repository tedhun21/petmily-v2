import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from 'store/modalSlice';

export default function useOutsideClickModal(ref: React.RefObject<HTMLElement>) {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        dispatch(closeModal());
      }
    };

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, []);
}
