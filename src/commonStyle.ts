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
  ${(props) => props.theme.fontSize.s12h18}
`;

export const Texts14h21 = styled.span`
  ${(props) => props.theme.fontSize.s14h21}
`;

export const Texts16h24 = styled.span`
  ${(props) => props.theme.fontSize.s16h24}
`;

export const Texts18h27 = styled.span`
  ${(props) => props.theme.fontSize.s18h27}
`;

export const Texts20h30 = styled.span`
  ${(props) => props.theme.fontSize.s20h30}
`;

export const Title = styled.h2`
  ${(props) => props.theme.fontSize.s18h27};
  font-weight: ${(props) => props.theme.fontWeights.bold};
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
