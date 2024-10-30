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
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
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
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.theme.colors.mainBlue};

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.darkBlue};
    box-shadow: ${(props) => props.theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
