import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';

import { BoxInput, InputBox, PopoverType, StyledPopover } from '../SearchBox';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Popover from '@/components/Popover';
import LocationPopover from './LocationPopover';
import { useRef } from 'react';

interface LocationBoxProps {
  parentRef: React.RefObject<HTMLElement | null>;
  activePopover: PopoverType | null;
  setActivePopover: (popoverType: PopoverType | null) => void;
  focusNextField: () => void;
}

export default function LocationBox({ parentRef, activePopover, setActivePopover }: LocationBoxProps) {
  const { watch, setValue } = useFormContext();
  const shouldSearch = useRef(true);
  const isSelected = activePopover === PopoverType.LOCATION;

  const input = watch('location');

  const handleSetValue = (value: string, search: boolean = true) => {
    shouldSearch.current = search;
    setValue('location', value, { shouldDirty: true });
  };

  const handleInputRemove = () => {
    handleSetValue('', false);
  };

  return (
    <Popover
      anchorRef={parentRef}
      open={isSelected}
      onOpenChange={() => setActivePopover(PopoverType.LOCATION)}
      onCloseChange={() => setActivePopover(null)}
      offset={8}
    >
      <Popover.Trigger>
        <InputBox $selected={isSelected}>
          <Flex alignItems="center">
            <Flex direction="column" gap="xs" css={{ flex: 1 }}>
              <label htmlFor="location">
                <Text size="sm">장소</Text>
              </label>
              <BoxInput
                id="location"
                onChange={(e) => handleSetValue(e.target.value, true)}
                value={input || ''}
                placeholder="장소 추가"
                autoComplete="off"
              />
            </Flex>
            {isSelected && input?.length > 0 && (
              <IconButton type="button" onClick={handleInputRemove}>
                <FaXmark size="12px" />
              </IconButton>
            )}
          </Flex>
        </InputBox>
      </Popover.Trigger>

      <Popover.Content width="100%">
        <StyledPopover>
          <LocationPopover shouldSearch={shouldSearch} handleSetValue={handleSetValue} />
        </StyledPopover>
      </Popover.Content>
    </Popover>
  );
}
