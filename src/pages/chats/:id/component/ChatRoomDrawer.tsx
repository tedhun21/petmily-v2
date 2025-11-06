import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

import { Column, ImageCentered, RoundedImageWrapper, Row, Title } from 'styles/commonStyle';
import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { ChatMember } from 'types/chat.type';
import { useChat } from '../contexts/ChatProvider';
import { Button } from 'styles/common/Button';
import { Text } from 'styles/common/Text';

interface ChatRoomDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

export default function ChatRoomDrawer({ isDrawerOpen, setIsDrawerOpen }: ChatRoomDrawerProps) {
  const {
    chatRoomValues: { meMember, otherMembers },
  } = useChat();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <StyledOutMotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsDrawerOpen(false)}
        >
          <StyledInMotionDiv
            initial={{ x: '100%' }}
            animate={{ x: '0' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContentWrapper>
              <Row style={{ justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsDrawerOpen(false)} $variant="icon" $borderRadius="circle">
                  <FaXmark size="24px" />
                </Button>
              </Row>

              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Title>채팅 참여자</Title>
                  <Text $size="base" $color="highlight">
                    {(otherMembers?.length ?? 0) + 1}
                  </Text>
                </div>

                <MemberList as="ul">
                  <Link to={`/users/${meMember?.user.nickname}`}>
                    <MemberItem as="li">
                      <MemberImage>
                        <ImageCentered
                          src={meMember?.user.photo ? `${meMember?.user.photo}` : '/imgs/DefaultUserProfile.jpg'}
                        />
                      </MemberImage>
                      <span>{meMember?.user.nickname}</span>
                    </MemberItem>
                  </Link>

                  {otherMembers?.map((member: ChatMember) => (
                    <Link to={`/users/${member.user.nickname}`} key={member.user?.id}>
                      <MemberItem as="li">
                        <MemberImage>
                          <ImageCentered
                            src={meMember?.user.photo ? `${meMember?.user.photo}` : '/imgs/DefaultUserProfile.jpg'}
                          />
                        </MemberImage>
                        <span>{member.user?.nickname}</span>
                      </MemberItem>
                    </Link>
                  ))}
                </MemberList>
              </div>

              <div>
                <span>채팅방 나가기</span>
              </div>
            </ContentWrapper>
          </StyledInMotionDiv>
        </StyledOutMotionDiv>
      )}
    </AnimatePresence>
  );
}

const StyledOutMotionDiv = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 20%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

const StyledInMotionDiv = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 11;
  width: 60%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
  border-top-left-radius: ${({ theme }) => theme.radius.lg};
  border-bottom-left-radius: ${({ theme }) => theme.radius.lg};
`;

const ContentWrapper = styled(Column)`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xl};

  & > :nth-child(1) {
    flex: 0;
  }

  & > :nth-child(2) {
    flex: 1;
  }

  & > :nth-child(3) {
    flex: 0;
  }
`;

const MemberList = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const MemberItem = styled(Row)`
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.primary};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

const MemberImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
