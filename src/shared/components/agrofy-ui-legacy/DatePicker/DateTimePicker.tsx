import { DateTimePicker as MuiDateTimePicker, DateTimePickerProps as MuiDateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import React from 'react';

export type DateTimePickerProps = MuiDateTimePickerProps;

export const DateTimePicker = React.forwardRef<HTMLDivElement, MuiDateTimePickerProps>(
  (props, ref) => {
    return (
      <MuiDateTimePicker
        ref={ref}
        format={props.format || 'DD/MM/YYYY HH:mm'}
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

DateTimePicker.displayName = 'DateTimePicker';
