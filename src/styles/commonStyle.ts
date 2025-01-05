import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Texts12h18 = styled.span`
  ${({ theme }) => theme.fontSize.s12h18};
`;

export const Texts14h21 = styled.span`
  ${({ theme }) => theme.fontSize.s14h21};
`;

export const Texts16h24 = styled.span`
  ${({ theme }) => theme.fontSize.s16h24};
`;

export const Texts18h27 = styled.span`
  ${({ theme }) => theme.fontSize.s18h27};
`;

export const Texts20h30 = styled.span`
  ${({ theme }) => theme.fontSize.s20h30};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
  ${({ theme }) => theme.fontSize.s20h30};
`;

export const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.fontSize.s18h27};
`;

export const RoundedImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 50%;
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

export const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ErrorMessage = styled(Texts12h18)`
  color: ${({ theme }) => theme.text.error};
`;

export const Input = styled.input`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background.input.primary};
  border: 1px solid ${({ theme }) => theme.line.input.primary};

  &:hover {
    border: 1px solid ${({ theme }) => theme.line.input.hover};
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.line.input.highlight};
  }
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.background.box.default.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.default.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

export const BlueButton = styled(Button)`
  color: ${({ theme }) => theme.text.white};
  background-color: ${({ theme }) => theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

export const Divider = styled.div<{
  orientation?: 'horizontal' | 'vertical';
  thickness?: string;
  length?: string;
}>`
  background-color: ${({ theme }) => theme.line.divider.primary};

  ${({ orientation, thickness, length }) =>
    orientation === 'vertical'
      ? `
        width: ${thickness || '1px'};
        height: ${length || '100%'};
      `
      : `
        height: ${thickness || '1px'};
        width: ${length || '100%'};
      `};
`;

export const Fixed = styled.div`
  position: fixed;
  width: 100%;
  max-width: 600px;
  z-index: 10;
`;

export const BottomFixed = styled(Fixed)`
  bottom: 0;
`;

export const Float = styled.div`
  position: absolute;
`;
