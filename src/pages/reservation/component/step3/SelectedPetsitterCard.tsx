import { ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';
import styled from 'styled-components';

const BUCKET_URL = process.env.REACT_APP_API_URL;

export default function SelectedPetsitter({ petsitter }: any) {
  return (
    <PetsitterSection>
      <CardWrap>
        <PetsitterName>{petsitter?.nickname}</PetsitterName>
        <Petsitter>펫시터</Petsitter>
        <PetsitterImg>
          {petsitter?.photo ? (
            <ImageCentered src={`${BUCKET_URL}${petsitter?.photo.url}`} />
          ) : (
            <img src="/imgs/DefaultUserProfile.png" alt="petsitter_photo" width="100%" height="100%" />
          )}
        </PetsitterImg>
      </CardWrap>

      <PetsitterCardBody>
        <Row>
          <PiStarFill size="28px" color="#279EFF" />
          <RatingCount>{petsitter?.star}</RatingCount>
        </Row>
        <Row>
          <MdOutlineRateReview size="28px" />
          <ReviewCount>{petsitter?.reviewCount}</ReviewCount>
        </Row>
      </PetsitterCardBody>
      {/* <div style={{ backgroundColor: 'gray', width: '100%', height: '1px' }} /> */}
      <div>
        <span>가능 장소</span>
        <span>{petsitter?.possibleLocation}</span>
      </div>
      <div>
        <span>가능 요일</span>
        <span>{petsitter?.possibleDay}</span>
      </div>
    </PetsitterSection>
  );
}

const PetsitterSection = styled.section`
  position: relative;
  border-radius: 8px;

  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const CardWrap = styled.div`
  display: flex;
  position: relative;
  padding: 12px 36px;
  border-radius: 8px 8px 0 0;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const PetsitterImg = styled(RoundedImageWrapper)`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 64px;
  height: 64px;
`;

const PetsitterName = styled.h2`
  ${(props) => props.theme.fontSize.s18h27};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.white};
`;

const Petsitter = styled.h3`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.textColors.primary};
`;

const PetsitterCardBody = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.white};
`;

const RatingCount = styled.h4`
  ${(props) => props.theme.fontSize.s20h30};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  color: #595959;
  margin-right: 30px;
  margin-top: -5px;
`;

const ReviewCount = styled.h4`
  ${(props) => props.theme.fontSize.s20h30};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  color: #595959;
  margin-top: -5px;
`;

const Possible = styled.h4`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.normal};
`;
