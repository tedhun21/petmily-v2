import { useFormContext, useWatch } from 'react-hook-form';

import dayjs from 'dayjs';
import { FaXmark } from 'react-icons/fa6';

import { AddText, InputBox, PopoverType, StyledPopover } from '../SearchBox';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Popover from '@/components/Popover';
import DatePopover from './DatePopover';

interface DateBoxProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  activePopover: PopoverType | null;
  setActivePopover: (popoverType: PopoverType | null) => void;
  focusNextField: () => void;
}

export default function DateBox({ parentRef, activePopover, setActivePopover }: DateBoxProps) {
  const isSelected = activePopover === PopoverType.DATE;
  const { setValue, control } = useFormContext();
  const date = useWatch({ control, name: 'date', defaultValue: null });

  const handleInputRemove = () => {
    setValue('date', null);
  };

  return (
    <Popover
      anchorRef={parentRef}
      open={isSelected}
      onOpenChange={() => setActivePopover(PopoverType.DATE)}
      onCloseChange={() => setActivePopover(null)}
      offset={8}
    >
      <Popover.Trigger>
        <InputBox $selected={isSelected}>
          <Flex alignItems="center">
            <Flex direction="column" gap="xs" css={{ flex: 1 }}>
              <Text size="sm">날짜</Text>
              <AddText $isClicked={!!date}>{date ? dayjs(date).format('MM-DD') : '날짜 추가'}</AddText>
            </Flex>
            {isSelected && date && (
              <IconButton type="button" onClick={handleInputRemove} css={{ flex: 0 }}>
                <FaXmark size="12px" />
              </IconButton>
            )}
          </Flex>
        </InputBox>
      </Popover.Trigger>

      <Popover.Content width="100%">
        <StyledPopover>
          <DatePopover />
        </StyledPopover>
      </Popover.Content>
    </Popover>
  );
}
