import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';

import { ImageCentered, RoundedImageWrapper, Title } from '@/styles/commonStyle';
import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import type { ChatMember } from '@/types/chat.type';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';
import { IconButton } from '@/components/styled/IconButtonAndLink';

interface ChatRoomDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

export default function ChatRoomDrawer({ isDrawerOpen, setIsDrawerOpen }: ChatRoomDrawerProps) {
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
              <Flex justifyContent="flex-end">
                <IconButton onClick={() => setIsDrawerOpen(false)} shape="circle">
                  <FaXmark size="24px" />
                </IconButton>
              </Flex>

              {/* <div>
                <Flex alignItems="center">
                  <Title>채팅 참여자</Title>
                  <Text size="base" color="accent">
                    {(otherMembers?.length ?? 0) + 1}
                  </Text>
                </Flex>

                <Box as="ul" p="sm">
                  <Flex direction="column" gap="sm">
                    <Link to={`/users/${meMember?.user.id}`}>
                      <Box p="sm">
                        <Flex as="li" alignItems="center" gap="sm">
                          <MemberImage>
                            <ImageCentered
                              src={meMember?.user.photo ? `${meMember?.user.photo}` : '/imgs/DefaultUserProfile.jpg'}
                            />
                          </MemberImage>
                          <span>{meMember?.user.nickname}</span>
                        </Flex>
                      </Box>
                    </Link>

                    {otherMembers?.map((member: ChatMember) => (
                      <Link to={`/users/${member.user.id}`} key={member.user?.id}>
                        <Box as="li" p="sm">
                          <Flex alignItems="center" gap="sm">
                            <MemberImage>
                              <ImageCentered
                                src={meMember?.user.photo ? `${meMember?.user.photo}` : '/imgs/DefaultUserProfile.jpg'}
                              />
                            </MemberImage>
                            <span>{member.user?.nickname}</span>
                          </Flex>
                        </Box>
                      </Link>
                    ))}
                  </Flex>
                </Box>
              </div> */}

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
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-top-left-radius: ${({ theme }) => theme.radius.lg};
  border-bottom-left-radius: ${({ theme }) => theme.radius.lg};
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => theme.space.xl};

  & > div:nth-of-type(1) {
    flex: 0;
  }

  & > div:nth-of-type(2) {
    flex: 1;
  }

  & > div:nth-of-type(3) {
    flex: 0;
  }
`;

const MemberImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
