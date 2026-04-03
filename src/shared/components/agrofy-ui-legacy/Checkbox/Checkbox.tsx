import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';
import MuiFormControlLabel, { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel';
import React from 'react';

export type CheckboxProps = MuiCheckboxProps;
export type SwitchProps = MuiSwitchProps;
export type FormControlLabelProps = MuiFormControlLabelProps;

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    return <MuiCheckbox ref={ref} {...props} />;
  }
);

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (props, ref) => {
    return <MuiSwitch ref={ref} {...props} />;
  }
);

export const FormControlLabel = React.forwardRef<HTMLLabelElement, FormControlLabelProps>(
  (props, ref) => {
    return <MuiFormControlLabel ref={ref} {...props} />;
  }
);

Checkbox.displayName = 'Checkbox';
Switch.displayName = 'Switch';
FormControlLabel.displayName = 'FormControlLabel';
