import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

export type DatePickerProps = MuiDatePickerProps;

export const DatePicker = React.forwardRef<HTMLDivElement, MuiDatePickerProps>(
  (props, ref) => {
    return (
      <MuiDatePicker
        ref={ref}
        format={props.format || 'DD/MM/YYYY'}
        slotProps={{
          textField: {
            InputLabelProps: {
              sx: { color: 'text.secondary' },
            },
            ...props.slotProps?.textField,
          },
          ...props.slotProps,
        }}
        {...props}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
