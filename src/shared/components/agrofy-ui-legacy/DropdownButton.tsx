import { Menu, MenuItem, Paper, ButtonProps, MenuProps } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { useState, MouseEvent, ReactNode } from 'react';
import { Button } from './Button';

export type DropdownMenuItem = {
  id: string;
  text: ReactNode;
  onClick: () => void;
};

export type DropdownButtonProps = {
  buttonId: string;
  buttonText: ReactNode;
  buttonIcon?: ReactNode;
  menuItems: DropdownMenuItem[];
  menuProps?: Partial<MenuProps>;
  buttonColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'gray' | 'neutral';
  buttonVariant?: 'solid' | 'outlined' | 'ghost' | 'link' | 'accent';
  disabled?: boolean;
  classname?: string;
} & Omit<ButtonProps, 'onClick'>;

export const DropdownButton = ({
  buttonId,
  buttonText,
  buttonIcon,
  menuItems,
  menuProps,
  buttonColor = 'primary',
  buttonVariant = 'outlined',
  disabled = false,
  classname,
}: DropdownButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    try {
      const width = (event.currentTarget as HTMLElement).offsetWidth;
      setMenuWidth(width);
    } catch (e) {
      console.error('Failed to set menu width:', e);
      setMenuWidth(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id={buttonId}
        aria-controls={open ? `${buttonId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant={buttonVariant}
        color={buttonColor}
        disabled={disabled}
        className={classname}
      >
        {buttonIcon}
        <span style={{ margin: '0 8px' }}>{buttonText}</span>
        <ChevronDown size={18} />
      </Button>
      <Menu
        id={`${buttonId}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
        {...menuProps}
      >
        <Paper sx={{ minWidth: 180, width: menuWidth ? `${menuWidth}px` : undefined, maxWidth: '100%', boxShadow: 'none' }}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              onClick={() => {
                item.onClick();
                handleClose();
              }}
            >
              {item.text}
            </MenuItem>
          ))}
        </Paper>
      </Menu>
    </>
  );
};
