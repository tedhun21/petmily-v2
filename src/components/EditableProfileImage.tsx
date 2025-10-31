import { useRef, ChangeEvent, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';

interface IProps {
  setImageFile: (file: File | null) => void;
  serverImageUrl?: string | null;
  setServerImageUrl?: (value: string | null) => void;
  setDeletePhoto?: (value: string | null) => void;
  defaultImage: string;
}

export default function EditableProfileImage({
  setImageFile,
  serverImageUrl,
  setServerImageUrl,
  setDeletePhoto,
  defaultImage,
}: IProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handlePhotoDelete = () => {
    if (setServerImageUrl) {
      setServerImageUrl(null);
    }
    setImageFile(null);
    setPreviewUrl(null);
    if (setDeletePhoto && serverImageUrl) {
      setDeletePhoto(serverImageUrl);
    }
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

      <ImageLabel htmlFor="photoInput">프로필 사진 선택</ImageLabel>
    </ImageContainer>
  );
}

const ImageContainer = styled(Column)`
  align-items: center;
  padding: 40px;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ImageLabel = styled.label`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.highlight};
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
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
