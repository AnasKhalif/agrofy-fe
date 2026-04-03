import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { DateRangePicker, DateRangePickerProps } from './DateRangePicker';
import { DateValueType } from 'react-tailwindcss-datepicker';

export interface FormDateRangePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<DateRangePickerProps, 'name' | 'defaultValue' | 'value' | 'onChange' | 'error' | 'helperText'> {
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: DateValueType;
  id?: string;
}

export function FormDateRangePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  rules,
  defaultValue,
  id,
  ...dateRangePickerProps
}: FormDateRangePickerProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <DateRangePicker
          {...field}
          {...dateRangePickerProps}
          id={id}
          value={value || { startDate: null, endDate: null }}
          onChange={(newValue) => {
            onChange(newValue);
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
