import { ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import styled from 'styled-components';
import { PiCatBold, PiDogBold } from 'react-icons/pi';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function PetCard({ pet }: any) {
  return (
    <PetWrapper>
      <PetImage>
        {pet.photo ? <ImageCentered src={`${BUCKET_URL}${pet.photo.url}`} alt="petPhoto" /> : <div>hi</div>}
      </PetImage>

      {pet.type === 'CAT' ? <PiCatBold size="20px" /> : <PiDogBold size="20px" />}

      <span>{pet.name}</span>
    </PetWrapper>
  );
}

const PetWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 30px;
  height: 30px;
`;
