import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { DatePicker, DatePickerProps } from './DatePicker';
import moment from 'moment';

export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<DatePickerProps, 'name' | 'defaultValue' | 'value' | 'onChange'> {
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  id?: string;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  rules,
  defaultValue,
  id,
  format,
  ...datePickerProps
}: FormDatePickerProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref, ...field }, fieldState: { error } }) => (
        <DatePicker
          {...field}
          {...datePickerProps}
          // If value is a string (from backend), convert to moment for the picker
          value={value ? (typeof value === 'string' ? moment(value) : value) : null}
          format={format || 'DD/MM/YYYY'}
          onChange={(newValue) => {
            // Store normalized ISO date string (YYYY-MM-DD) when possible
            if (newValue) {
              const m = moment(newValue);
              onChange(m.isValid() ? m.format('YYYY-MM-DD') : newValue);
            } else {
              onChange(newValue);
            }
          }}
          slotProps={{
            ...datePickerProps.slotProps,
            textField: {
              ...datePickerProps.slotProps?.textField,
              id: id,
              inputRef: ref,
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  );
}
