import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DateBox from './Date/DateBox';
import LocationBox from './Location/LocationBox';
import StartEndTimeBox from './StartEndTime/StartEndTimeBox';
import { RootState } from '@/store';
import { closeModal, ModalType, openModal } from '@/store/modalSlice';
import { saveToRecentSearch } from '@/utils/localStorage';
import { Divider } from '@/styles/commonStyle';
import Flex from '@components/styled/Flex';
import Box from '@components/styled/Box';

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

  const handleBoxClick = (e: React.MouseEvent, modalType: ModalType) => {
    e.stopPropagation();

    dispatch(openModal(modalType));
  };

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

  const selected = (modalType: ModalType | null) => {
    return modalType !== null && modalType.startsWith('search_');
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container id="container" $selected={selected(currentModal)} p="xs" br="lg" shadow="dp02">
          <Flex>
            <LocationBox handleBoxClick={handleBoxClick} handleSetValue={handleSetValue} />

            <Divider $orientation="vertical" />

            <DateBox handleBoxClick={handleBoxClick} handleSetValue={handleSetValue} />

            <Divider $orientation="vertical" />

            <StartEndTimeBox handleBoxClick={handleBoxClick} handleSetValue={handleSetValue} />
          </Flex>
        </Container>
      </form>
    </FormProvider>
  );
}

// TODO
const Container = styled(Box)<{ $selected: boolean }>`
  position: relative;
  background-color: ${({ theme, $selected }) => $selected && theme.colors.background.box.default.active};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
`;

// TODO
export const InputBox = styled.div<{ $selected: boolean }>`
  flex: 1;
  padding: 8px;
  background-color: ${({ $selected, theme }) => $selected && theme.colors.background.primary};
  border-radius: 20px;
  box-shadow: ${({ $selected, theme }) => $selected && theme.shadow.dp02};
  cursor: pointer;

  &:hover {
    background-color: ${({ $selected, theme }) => !$selected && theme.colors.background.box.default.hover};
  }
`;

export const BoxInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  ${({ theme }) => theme.typeScale.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.inactive};
  }
`;

export const AddText = styled.span<{ $isClicked?: boolean }>`
  color: ${({ theme, $isClicked }) => ($isClicked ? theme.colors.text.active : theme.colors.text.inactive)};
  ${({ theme }) => theme.typeScale.sm}
`;

export const XButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.active};
  }
`;

export const Modal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// TODO
export const ModalLayOut = styled.div`
  display: flex;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

export const HalfModalLayOut = styled(ModalLayOut)`
  width: 50%;
`;
