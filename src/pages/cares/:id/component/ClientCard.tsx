import { ImageCentered, RoundedImageWrapper, Row, Texts18h27 } from 'commonStyle';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function ClientCard({ client }: any) {
  return (
    <Card>
      <ImageName>
        <ClientImage>
          <ImageCentered src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="client_photo" />
        </ClientImage>
        <ClientName>{client?.nickname} 님</ClientName>
      </ImageName>

      <StyledLink to={`/chats/${client?.id}`}>채팅 하기</StyledLink>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const ImageName = styled(Row)`
  display: flex;
  gap: 8px;
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const ClientName = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  color: white;
  background-color: ${({ theme }) => theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
