import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import styled from 'styled-components';

import { CgGenderFemale, CgGenderMale } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function PetmilyCard({ pet }: any) {
  console.log(pet);
  return (
    <PetCard>
      <UpperContainer>
        <PetImageName>
          <PetImage>
            {pet.photo ? (
              <ImageCentered src={`${BUCKET_URL}${pet.photo.url}`} />
            ) : pet.type === 'DOG' ? (
              <img src="/imgs/DogProfile.png" alt="dogPhoto" width="100%" height="100%" />
            ) : pet.type === 'CAT' ? (
              <img src="/imgs/CatProfile.png" alt="catPhoto" width="100%" height="100%" />
            ) : null}
          </PetImage>
          <span>{pet.name}</span>
        </PetImageName>
        <EditLink to={`/mypage/${pet.id}/edit`}>편집</EditLink>
      </UpperContainer>

      <LowerContainer>
        <PetPropWrapper>
          <span>성별</span>
          <div>
            {pet.gender === 'MALE' ? (
              <CgGenderMale size="24px" />
            ) : pet.gender === 'FEMALE' ? (
              <CgGenderFemale size="24px" />
            ) : null}
          </div>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>품종: </span>
          <span>{pet.species}</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>나이: </span>
          <span>{pet.age}살</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>몸무게: </span>
          <span>{pet.weight}kg</span>
        </PetPropWrapper>
      </LowerContainer>
    </PetCard>
  );
}

const PetCard = styled.li`
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UpperContainer = styled(Row)`
  display: flex;
  justify-content: space-between;
`;

const PetImageName = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
`;

const EditLink = styled(Link)`
  &:visited {
    color: black;
  }
`;

const LowerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
`;

const PetPropWrapper = styled.li`
  display: flex;
  align-items: center;
  border: 2px solid ${(props) => props.theme.colors.subBlue};
  border-radius: 4px;
  padding: 4px 8px;
`;

// 등록된 petmily 카드
// export const PetmilyCard = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   margin-bottom: 20px;
//   padding: 12px;
//   border-radius: 4px;
//   box-shadow: 0 2px 10px 0 #cdcdcd;
// `;

{
  /* <PetmilyCard key={pet.id}>
              <ImageContainer>
                {pet.photo ? (
                  <PetPhoto src={`${BucketUrl}${pet.photo}`} alt="pet" />
                ) : pet.type === 'CAT' ? (
                  <PetPhoto src="imgs/CatProfile.png" alt="Cat" />
                ) : (
                  <PetPhoto src="imgs//PetProfile.png" alt="Dog" />
                )}
              </ImageContainer>
              <PetInfoContainer>
                <Line>
                  <PetName>{pet.name}</PetName>
                </Line>
                <Line>
                  <PetInfo>
                    {pet.male ? '남아' : '여아'}, {pet.age}살
                  </PetInfo>
                </Line>
                <Line>
                  <PetInfo>{pet.species}</PetInfo>
                </Line>
                <AdditionalInfo>
                  <Line>
                    <Item>중성화</Item>
                    <Info>{pet.neutering ? 'O' : 'X'}</Info>
                  </Line>
                  <Line>
                    <Item>몸무게</Item>
                    <Info>{pet.weight}kg</Info>
                  </Line>
                  <Line>
                    <Item>펫 소개</Item>
                    <Info>{pet.body ? pet.body : '펫 소개를 작성해주세요!'}</Info>
                  </Line>
                </AdditionalInfo>
              </PetInfoContainer>
              <ButtonContainer>
                <Link to={`/mypage/${pet.petId}/edit`}>
                  <Button sx={{ color: '#279eff', mt: 5 }}>수정하기</Button>
                </Link>
              </ButtonContainer>
            </PetmilyCard> */
}

// const ImageContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 100%;
// `;

// const PetPhoto = styled.img`
//   width: 160px;
//   height: 160px;
//   margin-bottom: 20px;
//   border-radius: 50%;
// `;

// const PetInfoContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 100%;
// `;

// const Line = styled.div`
//   display: flex;
//   align-items: center;
//   width: 50%;
//   margin-top: 8px;
// `;

// const Item = styled.div`
//   color: #279eff;
//   font-weight: 900;
//   font-size: 16px;
// `;

// const PetName = styled.div`
//   display: inline-block;
//   font-weight: 900;
//   font-size: 18px;
// `;

// const PetsButton = styled.button`
//   width: 18px;
//   height: 18px;
//   border: none;
//   cursor: pointer;
//   background-color: none;
// `;

// const PetInfo = styled.span`
//   margin-top: 4px;
//   color: #a1a1a1;
//   font-weight: ${(props) => props.theme.fontWeights.bold};
//   ${(props) => props.theme.fontSize.s16h24};
// `;

// const Info = styled.span`
//   margin-left: 20px;
//   font-weight: ${(props) => props.theme.fontWeights.bold};
//   ${(props) => props.theme.fontSize.s16h24};
// `;
