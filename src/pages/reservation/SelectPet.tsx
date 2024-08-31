import { ImageCentered, RoundedImageWrapper } from 'commonStyle';
import { useState } from 'react';
import styled from 'styled-components';

export default function SelectPet({ pet, checkedPetId, setCheckedPetId }: any) {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (!checked && checkedPetId.length >= 3) {
      // 최대 3마리가 이미 선택된 경우 경고를 표시하거나 기능을 중지
      alert('최대 3마리까지 선택할 수 있습니다.');
      return;
    }

    setChecked((prev) => !prev);
    setCheckedPetId((prev: any) => {
      if (!checked) {
        // 현재 체크되지 않은 상태에서 클릭하면, 체크된 상태가 되고 ID를 추가함
        return [...prev, pet.id];
      } else {
        // 현재 체크된 상태에서 클릭하면, 체크 해제 상태가 되고 ID를 제거함
        return prev.filter((id: number) => id !== pet.id);
      }
    });
  };

  return (
    <PetButton type="button" onClick={handleCheck}>
      {checked ? <Check checked={checked}>✓</Check> : null}
      <PetImageWrapper checked={checked}>
        {pet.photo ? (
          <ImageCentered src={pet.photo?.url} alt="petPhoto" />
        ) : pet.type === 'DOG' ? (
          <img src="/imgs/DogProfile.png" alt="dogProfile" />
        ) : pet.type === 'CAT' ? (
          <img src="/imgs/CatProfile.png" alt="catProfile" />
        ) : null}
      </PetImageWrapper>
      <span>{pet.name}</span>
    </PetButton>
  );
}

const PetButton = styled.button`
  position: relative;
`;

const PetImageWrapper = styled(RoundedImageWrapper)<{ checked: boolean }>`
  display: flex;
  cursor: pointer;
  width: 80px;
  height: 80px;
  filter: ${(props) => (props.checked ? 'brightness(1.05)' : 'brightness(1)')};
  transform ${(props) => (props.checked ? 'scale(1)' : 'scale(0.95)')};
  transition:
    transform 0.3s ease-in-out;
`;

const Check = styled.div<{ checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${(props) => props.theme.colors.mainBlue};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  z-index: 2;
  right: 0;
  top: 0;
  border: 1px solid ${(props) => props.theme.colors.subBlue};
  opacity: ${(props) => (props.checked ? 1 : 0)};
  transform: ${(props) => (props.checked ? 'scale(1)' : 'scale(0.5)')};
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
`;

{
  /* <PetContainer>
            {Array.isArray(pets) &&
              pets.length > 0 &&
              pets.map((pet: any) => {
                return (
                  <SelectPetCard key={pet.id}>
                    <div>
                      <CheckBoxInput
                        type="checkbox"
                        id={pet.petId}
                        name={pet.petId}
                        checked={checkedPetId.includes(pet.id)}
                        onChange={() => handlePetCheck(pet)}
                      />
                      <PetImgLabel htmlFor={pet.petId} checked={checkedPetId.includes(pet.petId)}>
                        <PetImg
                          src={pet.photo ? `${bucketUrl}${pet?.photo}` : ''}
                          onError={onErrorImg}
                          alt={pet.photo ? '펫 사진' : '사진을 등록해 주세요'}
                        />
                      </PetImgLabel>
                    </div>
                    <SelectPetName>{pet.name}</SelectPetName>
                  </SelectPetCard>
                );
              })}
            <SelectPetCard>
              <AddPetImg src="/imgs/PetAdd.svg" onClick={() => setIsPetModalOpen(true)} />
              <Dialog open={isPetModalOpen} onClose={() => setIsPetModalOpen(false)}>
                <DialogTitle>반려동물 등록</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                  <DialogContentText>반려동물 소개는 마이페이지에서 펫 수정을 통해 등록해주세요!</DialogContentText>
                  <ButtonContainer>
                    <Button onClick={handleImageClick} sx={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
                      <img
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : isCat === 'DOG'
                            ? '/imgs/PetProfile.png'
                            : '/imgs/CatProfile.png'
                        }
                        alt="미리보기"
                        width="100px"
                        style={{ borderRadius: '50%' }}
                      />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg image.png"
                      hidden
                      onChange={handleFileChange}
                    />
                  </ButtonContainer>
                  <ButtonGroup>
                    <PetButton onClick={() => setIsCat('DOG')} value={isCat === 'DOG' ? 'true' : 'false'}>
                      <img src="/icons/DogIcon.svg" alt="dogIcon" />
                    </PetButton>
                    <PetButton onClick={() => setIsCat('CAT')} value={isCat === 'CAT' ? 'true' : 'false'}>
                      <img src="/icons/CatIcon.svg" alt="catIcon" />
                    </PetButton>
                  </ButtonGroup>
                  <TextField
                    id="name"
                    label="반려동물 이름"
                    type="text"
                    size="small"
                    margin="dense"
                    onChange={(e) => {
                      if (e.target.value.length > 10) {
                        setIsNameError(true);
                      } else {
                        setIsNameError(false);
                      }
                      setName(e.target.value);
                    }}
                    error={isNameError}
                    helperText={isNameError && '10자 이하여야 합니다.'}
                  ></TextField>
                  <TextField
                    id="species"
                    label="품종"
                    type="text"
                    size="small"
                    margin="dense"
                    onChange={(e) => {
                      if (e.target.value.length > 10) {
                        setIsSpeciesError(true);
                      } else {
                        setIsSpeciesError(false);
                      }
                      setSpecies(e.target.value);
                    }}
                    error={isSpeciesError}
                    helperText={isSpeciesError && '10자 이하여야 합니다.'}
                  ></TextField>
                  <TextField
                    id="weight"
                    label="몸무게"
                    type="number"
                    size="small"
                    margin="dense"
                    inputProps={{ max: 50, min: 0, step: '0.01' }}
                    onChange={(e) => {
                      if (+e.target.value > 50 || +e.target.value < 0) {
                        setIsWeightError(true);
                      } else {
                        setIsWeightError(false);
                      }
                      setWeight(e.target.value);
                    }}
                    error={isWeightError}
                    helperText={isWeightError ? '몸무게는 0kg이상 50kg 이하여야 합니다.' : undefined}
                  ></TextField>
                  <TextField
                    id="age"
                    type="number"
                    label="나이"
                    size="small"
                    margin="dense"
                    inputProps={{ max: '20', min: '0' }}
                    onChange={(e) => {
                      if (e.target.value.length > 20) {
                        setIsAgeError(true);
                      }
                      setAge(e.target.value);
                    }}
                    error={isAgeError}
                    helperText={isAgeError && '나이는 20살 이하여야 합니다.'}
                  ></TextField>
                  <FormControl
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      paddingRight: '52px',
                    }}
                  >
                    <FormLabel>성별</FormLabel>
                    <RadioGroup
                      row
                      sx={{ alignItems: 'center', gap: '60px' }}
                      value={isMale}
                      onChange={handleGenderChange}
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label={<img src="/icons/MaleIcon.svg" alt="male" />}
                        labelPlacement="start"
                        sx={{
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label={<img src="/icons/FemaleIcon.svg" alt="female" />}
                        labelPlacement="start"
                        sx={{
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      paddingRight: '52px',
                    }}
                  >
                    <FormLabel>중성화</FormLabel>
                    <RadioGroup
                      row
                      sx={{ alignItems: 'center', gap: '40px' }}
                      value={isNeutering}
                      onChange={handleNeuteringChange}
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="했음"
                        labelPlacement="start"
                        sx={{
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="안했음"
                        labelPlacement="start"
                        sx={{
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <Button
                    sx={{
                      width: '100%',
                      backgroundColor: '#279EFF',
                      color: 'white',
                      ':hover': { backgroundColor: '#1D8CE7' },
                      ':active': { backgroundColor: '#096DBE', boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset' },
                    }}
                    onClick={handlePetSubmit}
                    disabled={checkDisable()}
                  >
                    펫 등록하기
                  </Button>
                </DialogActions>
              </Dialog>
            </SelectPetCard>
          </PetContainer> */
}
