import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

const TextInput = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  return (
    <TextField
      ref={ref}
      variant="standard"
      {...props}
      sx={{
        flex: 1,
        minWidth: '100%',
        ...props.sx,
      }}
      InputProps={{
        ...props.InputProps,
        disableUnderline: true,
        className:
          'dark:bg-input/30 border-input flex h-9 items-center rounded-md border bg-white shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      }}
      inputProps={{
        ...props.inputProps,
        className:
          'md:text-sm placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full bg-transparent text-base outline-none',
      }}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
