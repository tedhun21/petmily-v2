import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

import { BlueButton, Column, Divider, Row, Texts14h21 } from 'commonStyle';
import LocationBox from './Location/LocationBox';
import DateBox from './Date/DateBox';

import CheckInOutBox from './CheckInOut/CheckInOutBox';

export default function SearchBox() {
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const methods = useForm({ defaultValues: { location: null, date: null, checkIn: null, checkOut: null } });

  const onSubmit = async (data: any) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
  };

  console.log(methods.watch());

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container id="container" $isSelected={isSelected}>
          <BoxWrapper>
            <LocationBox isSelected={isSelected} setIsSelected={setIsSelected} />

            <Divider orientation="vertical" length="32px" />

            <DateBox isSelected={isSelected} setIsSelected={setIsSelected} />

            <Divider orientation="vertical" length="32px" />

            <CheckInOutBox isSelected={isSelected} setIsSelected={setIsSelected} />
          </BoxWrapper>

          <ButtonDiv>
            <SearchButton>
              <FiSearch size="28px" color="white" />
            </SearchButton>
          </ButtonDiv>
        </Container>
      </form>
    </FormProvider>
  );
}

const Container = styled(Row)<{ $isSelected: string | null }>`
  position: relative;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.line.input.default};
  border-radius: 28px;
  background-color: ${({ theme, $isSelected }) => $isSelected && theme.background.box.default.active};
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

const BoxWrapper = styled(Row)`
  width: 100%;
  align-items: center;
`;

export const InputDiv = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-radius: 28px;
  padding: 8px 12px;

  background-color: ${({ $isSelected, theme }) => $isSelected && theme.background.primary};

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
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.active};
  }
`;

export const Modal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 16px;
  z-index: 1;
`;

export const ModalLayOut = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

const ButtonDiv = styled.div``;

const SearchButton = styled(BlueButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;

  border-radius: 50%;
`;
