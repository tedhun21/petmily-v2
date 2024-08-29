import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { Column, ImageCentered, RoundedImageWrapper } from 'commonStyle';
import styled from 'styled-components';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function UploadProfileImg({ serverImageUrl, previewImage, setPreviewImage }: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));

      // handleCloseModal();
    }
  };

  // const handleOpenModal = () => {
  //   setOpenModal(true);
  // };

  // const handleCloseModal = () => {
  //   setOpenModal(false);
  // };

  const handleOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    // handleCloseModal();
  };

  // const handleEdit = () => {
  //   handleAdd();
  // };

  // const handleDelete = async () => {
  //   if (isImageOnServer) {
  //     const token = getCookie('access_token');
  //     try {
  //       let endpoint;
  //       // 펫 유저 사진 엔드 포인트 나누는 방법
  //       if (petId) {
  //         endpoint = `${apiUrl}/pets/${petId}/photo`;
  //       } else {
  //         endpoint = `${apiUrl}/members/${memberId}/photo`;
  //       }

  //       const response = await axios.patch(endpoint, null, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (response.data) {
  //         alert('삭제되었습니다');
  //         setPreviewImage(defaultProfileImg);
  //         setImageFile(null);
  //         handleCloseModal();
  //       }
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         if (error.response) {
  //           console.error(error.response.data);
  //         } else {
  //           console.error('AxiosError caught (no response):', error.message);
  //         }
  //       } else {
  //         console.error('Non-Axios error caught:', error);
  //       }
  //     }
  //   } else {
  //     setPreviewImage(defaultProfileImg);
  //     setImageFile(null);
  //     handleCloseModal();
  //   }
  // };
  // const handleClickUploadArea = () => {
  //   handleOpenModal();
  // };

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (event.key === 'Enter') {
  //     handleClickUploadArea();
  //   }
  // };

  return (
    <ImageContainer>
      <UserImageWrapper id="photoInput">
        {previewImage ? (
          <ImageCentered src={previewImage} />
        ) : serverImageUrl ? (
          <ImageCentered src={`${BUCKET_URL}${serverImageUrl}`} />
        ) : (
          <img src="/imgs/DefaultUserProfile.jpg" alt="userPhoto" width="100%" height="100%" />
        )}
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

// const ModalBody = ({ hasImage, onAdd, onEdit, onDelete, onClose }: any) => {
//   const [hadImage, setHadImage] = useState(hasImage);

//   useEffect(() => {
//     if (hadImage && !hasImage) {
//       onClose();
//     }
//     setHadImage(hasImage);
//   }, [hasImage, onClose, hadImage]);

//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: '30%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         backgroundColor: 'white',
//         padding: '16px',
//         outline: 'none',
//       }}
//     >
//       <h2>{hasImage ? '프로필 사진 수정' : '프로필 사진 추가'}</h2>
//       {hasImage ? (
//         <>
//           <Button onClick={onEdit}>수정</Button>
//           <Button onClick={onDelete}>삭제</Button>
//         </>
//       ) : (
//         <Button onClick={onAdd}>추가</Button>
//       )}
//       <Button
//         onClick={(e) => {
//           e.stopPropagation();
//           onClose();
//         }}
//       >
//         취소
//       </Button>
//     </div>
//   );
// };

{
  /* <div
      role="button"
      tabIndex={0}
      onClick={handleClickUploadArea}
      onKeyPress={handleKeyPress}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        cursor: 'pointer',
        backgroundColor: 'lightgray',
      }}
    >
      {previewImage && (
        <img src={previewImage} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileInputRef} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalBody
          hasImage={!!previewImage && previewImage !== defaultProfileImg}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      </Modal>
    </div> */
}
