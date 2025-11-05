import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Title } from 'styles/commonStyle';
import BackButton from '@components/buttons/BackButton';

interface IProps {
  title?: string;
  link?: string;
}

export default function BackHeader({ title, link }: IProps) {
  return (
    <Header>
      <BackButton link={link} />
      <Title>{title}</Title>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xl};
`;
