import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

import { BlueButton, Column, Divider, Row, Texts14h21 } from 'styles/commonStyle';
import LocationBox from './Location/LocationBox';
import DateBox from './Date/DateBox';
import StartEndTimeBox from './StartEndTime/StartEndTimeBox';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

type FormValues = {
  location: string | null;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
};

export default function SearchBox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSelected, setIsSelected] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: { location: null, date: null, startTime: null, endTime: null },
  });

  const onSubmit = async (data: any) => {
    const { location, date, startTime, endTime } = data;

    const formData: { [key: string]: any } = {
      location,
      date: date ? dayjs(date).format('YYYY-MM-DD') : null,
      startTime,
      endTime,
    };

    // null 값 제거
    for (const key in formData) {
      const value = formData[key];
      if (value === null) {
        delete formData[key];
      }
    }

    const queryParams = new URLSearchParams(formData);

    // URL 이동
    navigate(`/search?${queryParams.toString()}`);
  };

  useEffect(() => {
    if (searchParams) {
      const location = searchParams.get('location');
      const date = searchParams.get('date');
      const startTime = searchParams.get('startTime');
      const endTime = searchParams.get('endTime');

      methods.setValue('location', location || null);
      methods.setValue('date', date ? new Date(date) : null);
      methods.setValue('startTime', startTime || null);
      methods.setValue('endTime', endTime || null);
    }
  }, [searchParams, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container id="container" $isSelected={isSelected}>
          <BoxWrapper>
            <LocationBox isSelected={isSelected} setIsSelected={setIsSelected} />

            <Divider $orientation="vertical" $length="32px" />

            <DateBox isSelected={isSelected} setIsSelected={setIsSelected} />

            <Divider $orientation="vertical" $length="32px" />

            <StartEndTimeBox isSelected={isSelected} setIsSelected={setIsSelected} />
          </BoxWrapper>

          <ButtonDiv>
            <SearchButton type="submit">
              <FiSearch size="24px" color="white" />
            </SearchButton>
          </ButtonDiv>
        </Container>
      </form>
    </FormProvider>
  );
}

const Container = styled(Row)<{ $isSelected: string | null }>`
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
