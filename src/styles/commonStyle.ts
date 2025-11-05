import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Texts12h16 = styled.span`
  ${({ theme }) => theme.typeScale.xs};
`;

export const Texts14h20 = styled.span`
  ${({ theme }) => theme.typeScale.sm};
`;

export const Texts16h24 = styled.span`
  ${({ theme }) => theme.typeScale.base};
`;

export const Texts18h28 = styled.span`
  ${({ theme }) => theme.typeScale.lg};
`;

export const Texts20h28 = styled.span`
  ${({ theme }) => theme.typeScale.xl};
`;

export const Texts24h32 = styled.span`
  ${({ theme }) => theme.typeScale._2xl};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.typeScale.xl};
`;

export const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.active};
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

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ErrorMessage = styled(Texts12h16)`
  color: ${({ theme }) => theme.colors.text.error};
`;

export const DefaultLink = styled(Link)`
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }

  &:active {
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

export const BlueLink = styled(DefaultLink)`
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
  color: ${({ theme }) => theme.colors.text.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.accent.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

export const Divider = styled.div<{
  $orientation?: 'horizontal' | 'vertical';
  $thickness?: string;
  $length?: string;
}>`
  flex-shrink: 0;
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

export const Fixed = styled.div`
  position: fixed;
  z-index: 10;
  width: 100%;
  max-width: 600px;
`;

export const BottomFixed = styled(Fixed)`
  bottom: 0;
`;

export const Float = styled.div`
  position: absolute;
`;
