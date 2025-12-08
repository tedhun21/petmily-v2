import { useRef, useState } from 'react';

import styled from '@emotion/styled';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { Button } from './styled/Button';
import XButton from './buttons/XButton';
import Box from './styled/Box';
import Flex from './styled/Flex';

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <Box p={40}>
      <Flex direction="column" alignItems="center" gap="lg">
        <Relative>
          <UserImageWrapper>
            <ImageCentered src={previewUrl || serverImageUrl || defaultImage} alt="Profile Preview" />
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
          </UserImageWrapper>
          {(previewUrl || serverImageUrl) && (
            <Absolute>
              <XButton onClick={handlePhotoDelete} />
            </Absolute>
          )}
        </Relative>

        <Button onClick={handleButtonClick}>프로필 사진 선택</Button>
      </Flex>
    </Box>
  );
}

const Relative = styled.div`
  position: relative;
`;

const UserImageWrapper = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
`;

const Absolute = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
