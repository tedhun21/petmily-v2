import { useRef, ChangeEvent } from 'react';

import styled from 'styled-components';

import { Column, ImageCentered, RoundedImageWrapper } from 'commonStyle';

export default function UploadProfileImg({ serverImageUrl, previewImage, setPreviewImage, defaultImage }: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(file);
    }
  };

  const handleOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ImageContainer>
      <UserImageWrapper id="photoInput">
        <ImageCentered
          src={
            previewImage
              ? `${URL.createObjectURL(previewImage)}`
              : serverImageUrl
                ? `${serverImageUrl}`
                : `${defaultImage}`
          }
        />
        <input
          hidden
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onClick={handleOpen}
          onChange={handleImageChange}
        />
      </UserImageWrapper>
      <ImageLabel htmlFor="photoInput" onClick={handleOpen}>
        프로필 사진 선택
      </ImageLabel>
    </ImageContainer>
  );
}

const ImageContainer = styled(Column)`
  align-items: center;
  padding: 40px;
  gap: 16px;
`;

const ImageLabel = styled.label`
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainBlue};

  &:hover {
    color: ${(props) => props.theme.colors.subBlue};
  }
`;

const UserImageWrapper = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 1px solid gray;
`;
