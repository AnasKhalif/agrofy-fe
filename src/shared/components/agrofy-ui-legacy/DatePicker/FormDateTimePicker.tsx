import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { DateTimePicker, DateTimePickerProps } from './DateTimePicker';
import moment from 'moment';

export interface FormDateTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<DateTimePickerProps, 'name' | 'defaultValue' | 'value' | 'onChange'> {
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  id?: string;
}

export function FormDateTimePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  rules,
  defaultValue,
  id,
  format,
  ...dateTimePickerProps
}: FormDateTimePickerProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref, ...field }, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          {...dateTimePickerProps}
          // If value is a string (from backend), convert to moment for the picker
          value={value ? (typeof value === 'string' ? moment(value) : value) : null}
          format={format || 'DD/MM/YYYY HH:mm'}
          onChange={(newValue) => {
            // Store RFC3339 format for Golang time.Time compatibility
            if (newValue) {
              const m = moment(newValue);
              onChange(m.isValid() ? m.toISOString() : newValue);
            } else {
              onChange(newValue);
            }
          }}
          slotProps={{
            ...dateTimePickerProps.slotProps,
            textField: {
              ...dateTimePickerProps.slotProps?.textField,
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
