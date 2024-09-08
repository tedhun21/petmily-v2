import { CheckBox } from '@mui/icons-material';
import { Column, Row, Texts18h27, Texts20h30 } from 'commonStyle';
import styled from 'styled-components';
import { FaRegCircleCheck, FaCircleCheck } from 'react-icons/fa6';
import { Modal } from '@mui/material';
import { useState } from 'react';

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
        <ConfirmText>안내사항을 모두 확인하였습니다</ConfirmText>
        <TermsButton type="button" onClick={handleOpen}>
          펫밀리 안내사항 보기
        </TermsButton>
      </Column>

      <Modal open={open} onClose={handleClose}>
        <TermsContainer>
          <TextCenter style={{ textAlign: 'center' }}>
            <Texts20h30>안내사항</Texts20h30>
          </TextCenter>
          <Container>
            <Texts18h27>펫시터님께 미리 알려주세요!</Texts18h27>
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
            <RedTitle>필수 확인 사항</RedTitle>
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
            <RedTitle>돌봄이 불가한 경우</RedTitle>
            <List>
              <Item>펫시터님을 무는 등의 심한 공격성을 보이는 경우</Item>
              <Item>링웜, 허피스 등 전염성이 강한 질병이 있는 반려동물</Item>
              <Item>등록하신 반려동물 프로필이 실제와 다른 경우</Item>
              <Item>소유자가 분명하지 않은 경우</Item>
            </List>
          </Container>
          <Container>
            <RedTitle>산책이 불가한 경우</RedTitle>
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

const TermsContainer = styled(Column)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 600px;
  overflow: auto;
  border-radius: 16px;
  padding: 16px;
  gap: 12px;
  background-color: ${(props) => props.theme.colors.white};
`;

const TextCenter = styled.div`
  text-align: center;
`;

const Container = styled(Column)`
  gap: 8px;
`;

const RedTitle = styled(Texts18h27)`
  color: red;
  font-size: ${(props) => props.theme.fontWeights.bold};
`;

const List = styled.ul`
  display: flex;
  gap: 4px;
  flex-direction: column;
  list-style-type: disc;
`;

const Item = styled.li`
  list-style-position: inside;
  ${(props) => props.theme.fontSize.s14h21}
`;

const SubItem = styled.span`
  padding-left: 20px;
  color: ${(props) => props.theme.textColors.gray30};
  ${(props) => props.theme.fontSize.s12h18};
`;

const CheckButton = styled.button`
  background-color: ${(props) => props.theme.colors.mainBlue};
  color: white;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  ${(props) => props.theme.fontSize.s16h24}

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const ConfirmContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: cetner;
  padding: 16px;
  gap: 8px;
  border-top: 1px solid ${(props) => props.theme.textColors.gray60};
  border-bottom: 1px solid ${(props) => props.theme.textColors.gray60};
`;

const Check = styled.div`
  position: absolute;
  left: 8px;
  top: 20px;
`;

const ConfirmText = styled.div`
  ${(props) => props.theme.fontSize.s16h24}
`;

const TermsButton = styled.button`
  text-decoration: underline;
  cursor: pointer;
  color: ${(props) => props.theme.textColors.gray40};
  ${(props) => props.theme.fontSize.s14h21}

  &:hover {
    color: ${(props) => props.theme.textColors.gray30};
  }
`;
