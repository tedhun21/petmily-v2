import { useState } from 'react';
import styled from 'styled-components';
import { FaRegCircleCheck, FaCircleCheck } from 'react-icons/fa6';
import { Modal } from '@mui/material';

import { BlueButton, Column, SubTitle, Texts12h18, Texts16h24, Texts20h30, Title } from 'styles/commonStyle';

export default function Confirm({ isChecked, setIsChecked }: any) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheck = () => {
    setIsChecked(true);
    handleClose();
  };
  return (
    <ConfirmContainer>
      <Check>{isChecked ? <FaCircleCheck size="28px" color="279EFF" /> : <FaRegCircleCheck size="28px" />}</Check>
      <Column>
        <ConfirmText isChecked={isChecked}>안내사항을 모두 확인하였습니다</ConfirmText>
        <TermsButton type="button" onClick={handleOpen}>
          펫밀리 안내사항 보기
        </TermsButton>
      </Column>

      <Modal open={open} onClose={handleClose}>
        <TermsContainer>
          <TextCenter style={{ textAlign: 'center' }}>
            <Title>안내사항</Title>
          </TextCenter>
          <Container>
            <SubTitle>펫시터님께 미리 알려주세요!</SubTitle>
            <List>
              <Item>급식할 사료의 양</Item>
              <Column>
                <Item>식수 제공방법</Item>
                <SubItem>예) 정수기, 자동 급수 등</SubItem>
              </Column>
              <Column>
                <Item>배변 처리 방법</Item>
                <SubItem>예) 변기, 일반 쓰레기 등</SubItem>
              </Column>
              <Item>강아지의 경우, 산책시 발 세쳑 방법</Item>
              <Item>(30분 산책시, 시간 관계상 물티슈 닦기만 가능)</Item>
              <Item>고양이의 경우, 주로 숨어 있는 장소</Item>
              <Item>돌봄 시간에 고객님이 집에 계신 경우</Item>
            </List>
          </Container>
          <Container>
            <RedSubTitle>필수 확인 사항</RedSubTitle>
            <List>
              <Item>돌봄 외 특수 서비스는 요청 불가</Item>
              <Item>1. 목욕/미용 및 주사를 맞히는 의료 행위</Item>
              <Item>2. 애견호텔, 동물 병원 등의 픽업/드랍 서비스</Item>
              <Item>3. 세탁/청소 및 쓰레기 배출 등 청소 유사 서비스</Item>
              <Item>고객 본인 소유의 용품(장난감, 산책줄 등)의 파손 및 파손으로 인한 삼킴</Item>
              <Item>상처 등의 사고에 대해서는 펫시터 또는 당사에 책임을 물을 수 없음</Item>
              <Item>
                위급 상황 발생시 보호자와 연락이 불가한 경우, 반려동물의 건강/안전을 위해 담당 펫시터님의 인도로
                동물병원으로 우선 이송될 수 있음
              </Item>
              <Item>
                펫시터 부주의가 아닌, 반려동물의 돌발적 공격으로 인한 상해 발생시, 치료비가 보호자께 부과될 수 있음
              </Item>
              <Item>돌봄 외 특수 서비스는 요청 불가</Item>
            </List>
          </Container>
          <Container>
            <RedSubTitle>돌봄이 불가한 경우</RedSubTitle>
            <List>
              <Item>펫시터님을 무는 등의 심한 공격성을 보이는 경우</Item>
              <Item>링웜, 허피스 등 전염성이 강한 질병이 있는 반려동물</Item>
              <Item>등록하신 반려동물 프로필이 실제와 다른 경우</Item>
              <Item>소유자가 분명하지 않은 경우</Item>
            </List>
          </Container>
          <Container>
            <RedSubTitle>산책이 불가한 경우</RedSubTitle>
            <List>
              <Column>
                <Item>인식표 미지참 / 산택 줄 길이 2M 초과시</Item>
                <SubItem>실내 산책, 놀이로 대체될 수 있음</SubItem>
                <SubItem>동물보호법 제 12조 / 동물보호범 시행규칙 제 11조 [시행 2020. 3. 21]</SubItem>
                <SubItem>동물 보호 제 12조(안전조치) [시행 2022, 2. 11]</SubItem>
              </Column>
            </List>
          </Container>
          <CheckButton onClick={handleCheck}>확인했습니다</CheckButton>
        </TermsContainer>
      </Modal>
    </ConfirmContainer>
  );
}

const ConfirmContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.text.inactive};
  border-bottom: 1px solid ${({ theme }) => theme.text.inactive};
`;

const TermsContainer = styled(Column)`
  overflow: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 600px;
  padding: 24px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.box.default.primary};
  transform: translate(-50%, -50%);
  gap: 12px;
`;

const TextCenter = styled.div`
  text-align: center;
`;

const Container = styled(Column)`
  gap: 8px;
`;

const RedSubTitle = styled(SubTitle)`
  color: ${({ theme }) => theme.text.error};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style-type: disc;
`;

const Item = styled.li`
  list-style-position: inside;
  ${({ theme }) => theme.fontSize.s14h21}
`;

const SubItem = styled(Texts12h18)`
  padding-left: 20px;
  color: ${({ theme }) => theme.text.inactive};
`;

const CheckButton = styled(BlueButton)`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius};

  ${({ theme }) => theme.fontSize.s16h24}
`;

const Check = styled.div`
  position: absolute;
  top: 20px;
  left: 8px;
`;

const ConfirmText = styled(Texts16h24)<{ isChecked: boolean }>`
  color: ${({ isChecked, theme }) => (isChecked ? theme.text.highlight : theme.text.inactive)};
`;

const TermsButton = styled.button`
  text-decoration: underline;
  color: ${({ theme }) => theme.text.secondary};
  ${({ theme }) => theme.fontSize.s14h21}
`;
