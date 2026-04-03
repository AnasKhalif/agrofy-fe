import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import MuiFormControl, { FormControlProps as MuiFormControlProps } from '@mui/material/FormControl';
import MuiInputLabel, { InputLabelProps as MuiInputLabelProps } from '@mui/material/InputLabel';
import React from 'react';

export type SelectProps = MuiSelectProps;
export type MenuItemProps = MuiMenuItemProps;
export type FormControlProps = MuiFormControlProps;
export type InputLabelProps = MuiInputLabelProps;

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (props, ref) => {
    return <MuiSelect ref={ref} {...props} />;
  }
);

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  (props, ref) => {
    return <MuiMenuItem ref={ref} {...props} />;
  }
);

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    return <MuiFormControl ref={ref} {...props} />;
  }
);

export const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  (props, ref) => {
    return <MuiInputLabel ref={ref} {...props} />;
  }
);

Select.displayName = 'Select';
MenuItem.displayName = 'MenuItem';
FormControl.displayName = 'FormControl';
InputLabel.displayName = 'InputLabel';
