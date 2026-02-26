import { IoNotificationsOutline } from 'react-icons/io5';

import { IconButton } from '@/components/styled/IconButtonAndLink';
import Popover from '@/components/Popover';
import NotiPopover from './components/NotiPopover';

export default function NotiButton() {
  return (
    <Popover placement="bottom-end" offset={8}>
      <Popover.Trigger>
        <IconButton type="button" variant="clear" size="sm" shape="circle">
          <IoNotificationsOutline size="24px" />
        </IconButton>
      </Popover.Trigger>

      <Popover.Content>
        <NotiPopover />
      </Popover.Content>
    </Popover>
  );
}
