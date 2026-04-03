import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { TextField, TextFieldProps } from './TextField';

export interface FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextFieldProps, 'name' | 'defaultValue'> {
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  numberOnly?: boolean;
  useThousandFormatter?: boolean;
}

export function FormTextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  rules,
  defaultValue,
  helperText,
  numberOnly = false,
  useThousandFormatter = false,
  ...textFieldProps
}: FormTextFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  const handleNumberOnlyChange = (value: string) => {
    // Only allow digits 0-9, remove any non-numeric characters
    return value.replace(/[^0-9]/g, '');
  };

  const handleThousandFormat = (value: string) => {
    // Remove all non-numeric characters first
    const numericOnly = value.replace(/[^0-9]/g, '');
    // Add thousand separators
    return numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        // Format the display value if useThousandFormatter is enabled
        // Treat 0 as a valid value (don't treat it as falsy)
        let displayValue = (field.value !== undefined && field.value !== null && field.value !== '') ? String(field.value) : '';
        if (useThousandFormatter && field.value !== undefined && field.value !== null && field.value !== '') {
          const numStr = String(field.value).replace(/\./g, '');
          displayValue = handleThousandFormat(numStr);
        }

        return (
          <TextField
            {...field}
            {...textFieldProps}
            value={displayValue}
            onChange={(e) => {
              let newValue = e.target.value;
              if (useThousandFormatter) {
                const formatted = handleThousandFormat(newValue);
                // Convert to number by removing dots
                const numericValue = formatted.replace(/\./g, '');
                // Use explicit check for empty string, not falsy check, to allow 0
                field.onChange(numericValue !== '' ? Number(numericValue) : '');
              } else if (numberOnly) {
                newValue = handleNumberOnlyChange(newValue);
                field.onChange(newValue);
              } else {
                field.onChange(newValue);
              }
            }}
            error={!!error}
            helperText={error?.message || helperText}
          />
        );
      }}
    />
  );
}
