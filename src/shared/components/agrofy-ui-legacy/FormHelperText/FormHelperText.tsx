import MuiFormHelperText, { FormHelperTextProps as MuiFormHelperTextProps } from '@mui/material/FormHelperText';
import React from 'react';

export type FormHelperTextProps = MuiFormHelperTextProps;

export const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  (props, ref) => {
    return <MuiFormHelperText ref={ref} {...props} />;
  }
);

FormHelperText.displayName = 'FormHelperText';
