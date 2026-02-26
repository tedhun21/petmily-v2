import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';

import { AddText, InputBox, PopoverType, StyledPopover } from '../SearchBox';

import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import { colors } from '@/styles/colors';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Popover from '@/components/Popover';
import StartEndTimePopover from './StartEndTimePopover';

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  activePopover: PopoverType | null;
  setActivePopover: (popoverType: PopoverType | null) => void;
  focusNextField: () => void;
}

export default function StartEndTimeBox({ parentRef, activePopover, setActivePopover }: IProps) {
  const { setValue, watch } = useFormContext();
  const isSelected = activePopover === PopoverType.TIME;

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const [isSearchButtonHovered, setIsSearchButtonHovered] = useState(false); // 검색 버튼 호버 상태

  const handleInputRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    setValue('startTime', null);
    setValue('endTime', null);
  };

  const dateText = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    if (startTime) {
      return `${startTime}`;
    }
    return '시간 추가';
  };

  return (
    <>
      <Popover
        anchorRef={parentRef}
        open={isSelected}
        onOpenChange={() => setActivePopover(PopoverType.TIME)}
        onCloseChange={() => setActivePopover(null)}
        offset={8}
      >
        <Popover.Trigger>
          <InputBox $selected={isSelected} $isChildHovered={isSearchButtonHovered}>
            <Flex alignItems="center">
              <Flex direction="column" gap="xs" css={{ flex: 1 }}>
                <Text size="sm">시간</Text>
                <AddText $isClicked={startTime?.length > 0}>{dateText(startTime, endTime)}</AddText>
              </Flex>
              {isSelected && startTime?.length > 0 && (
                <IconButton type="button" onClick={handleInputRemove} variant="fill">
                  <FaXmark size="12px" />
                </IconButton>
              )}
              <Box css={{ flex: 0 }}>
                <IconButton
                  type="submit"
                  bgColor={colors.blue400}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setIsSearchButtonHovered(true)}
                  onMouseLeave={() => setIsSearchButtonHovered(false)}
                >
                  <FiSearch size="24px" color={colors.white} />
                </IconButton>
              </Box>
            </Flex>
          </InputBox>
        </Popover.Trigger>

        <Popover.Content width="100%">
          <StyledPopover>
            <StartEndTimePopover />
          </StyledPopover>
        </Popover.Content>
      </Popover>
    </>
  );
}
