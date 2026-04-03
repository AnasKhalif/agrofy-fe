import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import React from 'react';

export type TextFieldProps = MuiTextFieldProps;

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const hasValue = props.value !== undefined && props.value !== null && props.value !== '';
    const shouldShrink = hasValue || props.InputLabelProps?.shrink;

    // If this is a numeric input, prevent mouse wheel from changing its value by
    // blurring the input on wheel events. This provides a global safeguard so
    // individual number inputs don't need to handle wheel events separately.
    const inputProps = {
      ...(props.inputProps || {}),
      onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
        // If a consumer already supplied an onWheel, call it first
        const userOnWheel = (props.inputProps as any)?.onWheel;
        if (typeof userOnWheel === 'function') {
          try {
            userOnWheel(e);
          } catch (err) {
            console.error('Error in user-supplied onWheel handler:', err);
            // ignore
          }
        }

        if (props.type === 'number') {
          (e.target as HTMLElement).blur();
        }
      },
    };

    return (
      <MuiTextField
        ref={ref}
        InputLabelProps={{
          shrink: shouldShrink,
          sx: { color: 'text.secondary' },
          ...props.InputLabelProps,
        }}
        {...props}
        inputProps={inputProps}
      />
    );
  }
);

TextField.displayName = 'TextField';
