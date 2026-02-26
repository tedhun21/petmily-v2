import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';

import DateBox from './Date/DateBox';
import LocationBox from './Location/LocationBox';
import StartEndTimeBox from './StartEndTime/StartEndTimeBox';
import { saveToRecentSearch } from '@/utils/localStorage';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';
import { css } from '@emotion/react';

export type FormValues = {
  location: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
};

export const PopoverType = {
  LOCATION: 'location',
  DATE: 'date',
  TIME: 'time',
} as const;

export type PopoverType = (typeof PopoverType)[keyof typeof PopoverType];

export default function SearchBox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentRef = useRef<HTMLDivElement>(null);

  const [activePopover, setActivePopover] = useState<PopoverType | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
      location: null,
      date: null,
      startTime: null,
      endTime: null,
    },
  });

  const focusNextField = () => {};

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
  }, [searchParams, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container ref={parentRef} $selected={!!activePopover} p="xs" br="lg" shadow="dp02">
          <Flex
            css={css`
              & > * {
                flex: 1;
              }
            `}
          >
            <LocationBox
              parentRef={parentRef}
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              focusNextField={focusNextField}
            />

            <DateBox
              parentRef={parentRef}
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              focusNextField={focusNextField}
            />

            <StartEndTimeBox
              parentRef={parentRef}
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              focusNextField={focusNextField}
            />
          </Flex>
        </Container>
      </form>
    </FormProvider>
  );
}

const Container = styled(Box)<{ $selected: boolean }>`
  position: relative;
  background-color: ${({ theme, $selected }) => $selected && theme.colors.background.box.default.active};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
`;

export const InputBox = styled.div<{ $selected: boolean; $isChildHovered?: boolean }>`
  padding: 12px;
  background-color: ${({ $selected, theme }) => $selected && theme.colors.background.box.default.primary};
  border-radius: 20px;
  box-shadow: ${({ $selected, theme }) => $selected && theme.shadow.dp02};
  cursor: pointer;

  &:hover {
    background-color: ${({ $selected, theme, $isChildHovered }) =>
      !$selected && !$isChildHovered && theme.colors.background.box.default.hover};
  }
`;

export const BoxInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  ${({ theme }) => theme.typeScale.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const AddText = styled.span<{ $isClicked?: boolean }>`
  color: ${({ theme, $isClicked }) => ($isClicked ? theme.colors.text.primary : theme.colors.text.secondary)};
  ${({ theme }) => theme.typeScale.sm};
`;

export const StyledPopover = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.space.lg};
`;
