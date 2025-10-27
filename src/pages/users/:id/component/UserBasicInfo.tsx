import styled from 'styled-components';
import { ImageCentered, RoundedImageWrapper, Row, Texts16h24 } from 'styles/commonStyle';
import { UserRole } from 'types/user.type';
import { PetsitterFeedback } from './PetsitterFeedback';

interface IProps {
  role: UserRole;
  nickname: string | null;
  photo: string | null;
  body: string | null;
  star: number | null;
  reviewCount: number | null;
}

export default function UserBasicInfo({ role, nickname, photo, body, star, reviewCount }: IProps) {
  // 유저의 사진
  // 유저의 닉네임
  // 유저의 소개 밑으로
  return (
    <Section>
      <UserInfo>
        <UserImage>
          <ImageCentered src={photo ?? '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
        </UserImage>
        <Div>
          <Texts16h24>{role === UserRole.PETSITTER ? `펫시터: ${nickname} 님` : `${nickname} 님`}</Texts16h24>
          <PetsitterFeedback star={star} reviewCount={reviewCount} />
        </Div>
      </UserInfo>
      <Body>{body}</Body>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const Div = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UserInfo = styled(Row)`
  gap: 16px;
`;

const Body = styled.p`
  ${({ theme }) => theme.fontSize.s14h21};
`;
