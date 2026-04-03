
import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

type DateInputProps = Omit<TextFieldProps, 'type'>;

const DateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => {
  return (
    <TextField
      {...props}
      type="date"
      inputRef={ref}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
});

DateInput.displayName = 'DateInput';

export default DateInput;
