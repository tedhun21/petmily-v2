import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.typeScale.xl};
`;

export const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.typeScale.lg};
`;

export const RoundedImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.circle};
`;

export const ImageCentered = styled.img`
  position: absolute;
  object-fit: cover;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`;

export const Divider = styled.div<{
  $orientation?: 'horizontal' | 'vertical';
  $thickness?: string;
  $length?: string;
}>`
  background-color: ${({ theme }) => theme.colors.line.divider.primary};

  ${({ $orientation, $thickness, $length }) =>
    $orientation === 'vertical'
      ? `
        width: ${$thickness || '1px'};
        height: ${$length || '100%'};
      `
      : `
        height: ${$thickness || '1px'};
        width: ${$length || '100%'};
      `};
`;

export const pulse = keyframes`
  50% {
    opacity:0.5
  }`;
