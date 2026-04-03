import { Button, Menu, MenuItem as MaterialMenuItem } from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';
import { MouseEvent, ReactNode, useState } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownButtonProps {
  id: string
  buttonText: string;
  menuItems: MenuItem[];
  startIcon?: ReactNode;
}

const DropdownButton = ({ id, buttonText, menuItems, startIcon }: DropdownButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button id={"dropdown-" + id} variant="outlined" size="small" startIcon={startIcon} onClick={handleClick}>
        {buttonText}
        <IconChevronDown className='ml-2' size={20} />
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        {menuItems.map((item, index) => (
          <MaterialMenuItem
            id={"dropdown-item-" + id + "-" + index}
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.label}
          </MaterialMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownButton;
