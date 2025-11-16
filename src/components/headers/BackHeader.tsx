import { Title } from 'styles/commonStyle';
import BackButton from '@components/buttons/BackButton';

import Box from '@components/Box';
import styled from 'styled-components';
import { flex } from '@components/Flex';

interface IProps {
  title?: string;
  link?: string;
}

export default function BackHeader({ title, link }: IProps) {
  return (
    <Container as="header">
      <BackButton link={link} />
      <Title>{title}</Title>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  w: '100%',
  p: 'xl',
}))`
  ${flex({
    alignItems: 'center',
    gap: 'xl',
  })}
`;
