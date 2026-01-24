import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Checkbox, FormControlLabel } from './Checkbox';
import { Box } from '../Box';
import { FormHelperText } from '../FormHelperText';
import type { CheckboxProps } from '@mui/material/Checkbox';

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<CheckboxProps, 'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'checked'> {
  name: TName;
  label: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  rules,
  defaultValue,
  ...checkboxProps
}: FormCheckboxProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                {...checkboxProps}
                checked={!!field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                inputRef={field.ref}
              />
            }
            label={label}
          />
          {error && (
            <FormHelperText error sx={{ mt: 0, ml: 4 }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
