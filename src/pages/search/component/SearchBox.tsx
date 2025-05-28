import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

import DateBox from './Date/DateBox';
import LocationBox from './Location/LocationBox';
import { saveToRecentSearch } from 'utils/localStorage';
import StartEndTimeBox from './StartEndTime/StartEndTimeBox';
import { BlueButton, Column, Divider, Row, Texts14h21 } from 'styles/commonStyle';

import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { closeModal, openModal } from 'store/modalSlice';
import { isSearchModal } from 'utils/misc';

export type FormValues = {
  location: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
};

export default function SearchBox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state: RootState) => state.modal);

  const methods = useForm<FormValues>({
    defaultValues: { location: null, date: null, startTime: null, endTime: null },
  });

  // null인 input으로 넘어가기
  const handleSetValue = (field: keyof FormValues, value: any) => {
    methods.setValue(field, value);

    // 현재 폼의 모든 값 가져오기
    const formValues = methods.getValues();

    // 모든 필드가 채워져 있으면 setIsSelected를 null로 설정
    const allFieldsFilled = Object.values(formValues).every((val) => val !== null);

    if (allFieldsFilled) {
      dispatch(closeModal());
      return;
    }

    // 현재 값이 null이 아닐 때만 다음 필드로 이동
    if (value !== null) {
      const nextField = Object.entries(formValues).find(([key, val]) => key !== field && val === null)?.[0];

      if (nextField) {
        dispatch(openModal(nextField));
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    // 검색 파라미터를 URL로 설정
    const queryParams = new URLSearchParams();
    if (data.location) queryParams.set('location', data.location);
    if (data.date) queryParams.set('date', data.date);
    if (data.startTime) queryParams.set('startTime', data.startTime);
    if (data.endTime) queryParams.set('endTime', data.endTime);

    // localStorage 저장
    if (data.location) {
      saveToRecentSearch('recentSearches', data.location);
    }

    setSearchParams(queryParams);
  };

  useEffect(() => {
    methods.reset({
      location: searchParams.get('location'),
      date: searchParams.get('date'),
      startTime: searchParams.get('startTime'),
      endTime: searchParams.get('endTime'),
    });
  }, [searchParams]);

  return (
    <Sticky>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container id="container" $isSelected={isSearchModal(currentModal)}>
            <BoxWrapper>
              <LocationBox handleSetValue={handleSetValue} />

              <Divider $orientation="vertical" $length="32px" />

              <DateBox handleSetValue={handleSetValue} />

              <Divider $orientation="vertical" $length="32px" />

              <StartEndTimeBox />
            </BoxWrapper>

            <ButtonDiv>
              <SearchButton type="submit">
                <FiSearch size="24px" color="white" />
              </SearchButton>
            </ButtonDiv>
          </Container>
        </form>
      </FormProvider>
    </Sticky>
  );
}

const Sticky = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  padding: 8px 0px;
  background-color: inherit;
`;

const Container = styled(Row)<{ $isSelected: boolean }>`
  align-items: center;
  position: relative;
  border: 1px solid ${({ theme }) => theme.line.input.primary};
  border-radius: 28px;
  background-color: ${({ theme, $isSelected }) => $isSelected && theme.background.box.default.active};
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

const BoxWrapper = styled(Row)`
  align-items: center;
  width: 100%;
`;

export const InputDiv = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 8px 12px;
  border-radius: 28px;
  background-color: ${({ $isSelected, theme }) => $isSelected && theme.background.primary};
  cursor: pointer;
  box-shadow: ${({ $isSelected, theme }) => $isSelected && theme.shadow.dp02};

  &:hover {
    background-color: ${({ $isSelected, theme }) => !$isSelected && theme.background.box.default.hover};
  }
`;

export const Wrapper = styled(Column)`
  gap: 4px;
  align-items: flex-start;
`;

export const Label = styled.label`
  ${({ theme }) => theme.fontSize.s12h18};
`;

export const BoxInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  ${({ theme }) => theme.fontSize.s14h21};

  &::placehoder {
    color: ${({ theme }) => theme.text.inactive};
  }
`;

export const AddText = styled(Texts14h21)<{ $isClicked?: boolean }>`
  color: ${({ theme, $isClicked }) => ($isClicked ? theme.text.active : theme.text.inactive)};
`;

export const XButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.active};
  }
`;

export const Modal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: 100%;
  margin-top: 16px;
`;

export const ModalLayOut = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

export const HalfModalLayOut = styled(ModalLayOut)`
  width: 50%;
`;

const ButtonDiv = styled.div`
  margin: 8px;
`;

const SearchButton = styled(BlueButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
`;
