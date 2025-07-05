import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ChatRoomContext } from './ChatRoomProvider';
import { useContext } from 'react';
import { Button, ImageCentered, RoundedImageWrapper, Texts16h24, Title } from 'styles/commonStyle';
import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';

interface ChatRoomDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

export default function ChatRoomDrawer({ isDrawerOpen, setIsDrawerOpen }: ChatRoomDrawerProps) {
  const { chatRoom } = useContext(ChatRoomContext);

  const meMember = chatRoom?.chatMembers.me;
  const othersMember = chatRoom?.chatMembers.others;

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
            initial={{ y: '-100%' }}
            animate={{ y: '0' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContentWrapper>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title>채팅 참여자</Title>
                    <MemberCount>{(othersMember?.length ?? 0) + 1}</MemberCount>
                  </div>
                  <XButton onClick={() => setIsDrawerOpen(false)}>
                    <FaXmark size="20px" />
                  </XButton>
                </div>
                <MemberList>
                  <Link to={`/users/${meMember?.user.nickname}`}>
                    <MemberItem>
                      <MemberImage>
                        <ImageCentered
                          src={meMember?.user.photo ? `${meMember?.user.photo}` : '/imgs/DefaultUserProfile.jpg'}
                        />
                      </MemberImage>
                      <span>{meMember?.user.nickname}</span>
                    </MemberItem>
                  </Link>

                  {othersMember?.map((member) => (
                    <Link to={`/users/${member.user.nickname}`} key={member.user?.id}>
                      <MemberItem>
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  blur-filter: blur(2px);
  z-index: 10;
  overflow: hidden;
`;

const StyledInMotionDiv = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  background-color: ${({ theme }) => theme.background.primary};
  border-bottom-left-radius: ${({ theme }) => theme.radius.large};
  border-bottom-right-radius: ${({ theme }) => theme.radius.large};
  box-shadow:${({ theme }) => theme.shadow.onlyBottom}
  z-index: 11;
`;

const ContentWrapper = styled.div`
  padding: 16px;
`;

const MemberCount = styled(Texts16h24)`
  color: ${({ theme }) => theme.text.highlight};
`;

const XButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
`;

const MemberList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`;

const MemberItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.primary};
    border-radius: ${({ theme }) => theme.radius.large};
  }
`;

const MemberImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
