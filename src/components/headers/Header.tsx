import styled from '@emotion/styled';

interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export default function Header({ left, center, right, className }: HeaderProps) {
  return (
    <HeaderWrapper className={className}>
      <LeftSection>{left}</LeftSection>
      <CenterSection>{center}</CenterSection>
      <RightSection>{right}</RightSection>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme?.space?.md || '0.75rem'};

  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme?.colors?.background?.layer0 || '#ffffff'};
`;

const Section = styled.div`
  display: flex;
  align-items: center;
`;

const LeftSection = styled(Section)`
  justify-content: flex-start;
`;

const CenterSection = styled(Section)`
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightSection = styled(Section)`
  justify-content: flex-end;
`;
