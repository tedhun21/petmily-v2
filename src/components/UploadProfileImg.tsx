import { useRef, ChangeEvent, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';

interface IProps {
  setImageFile: any;
  defaultImage: string;
  serverImageUrl?: string | null;
  setServerImageUrl?: any;
}

export default function UploadProfileImg({ setImageFile, defaultImage, serverImageUrl, setServerImageUrl }: IProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file); // Store the file in the parent component
      const objectUrl = URL.createObjectURL(file); // Create a preview URL
      setPreviewUrl(objectUrl);
    }
  };

  const handleOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoDelete = () => {
    setServerImageUrl(null);
    setImageFile(null);
    setPreviewUrl(null); // Reset the preview URL
  };

  return (
    <ImageContainer>
      <Relative>
        <UserImageWrapper>
          <ImageCentered src={previewUrl || serverImageUrl || defaultImage} alt="Profile Preview" />
          <input id="photoInput" type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
        </UserImageWrapper>
        {(previewUrl || serverImageUrl) && (
          <XButton type="button" onClick={handlePhotoDelete}>
            <FaXmark color="white" />
          </XButton>
        )}
      </Relative>

      <ImageLabel htmlFor="photoInput" onClick={handleOpen}>
        프로필 사진 선택
      </ImageLabel>
    </ImageContainer>
  );
}

const ImageContainer = styled(Column)`
  padding: 40px;
  align-items: center;
  gap: 16px;
`;

const ImageLabel = styled.label`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.highlight};
  }
`;

const Relative = styled.div`
  position: relative;
`;

const UserImageWrapper = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
`;

const XButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background-color: ${({ theme }) => theme.background.red};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
