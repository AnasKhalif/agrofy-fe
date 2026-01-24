import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { InputCurrency, InputCurrencyProps } from './InputCurrency';

export interface FormInputCurrencyProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputCurrencyProps, 'name' | 'defaultValue' | 'onChange'> {
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
}

export function FormInputCurrency<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  rules,
  defaultValue,
  helperText,
  ...inputCurrencyProps
}: FormInputCurrencyProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <InputCurrency
          {...field}
          {...inputCurrencyProps}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error?.message || helperText}
        />
      )}
    />
  );
}
