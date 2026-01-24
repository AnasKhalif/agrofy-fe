import { FormProvider as RHFFormProvider, UseFormReturn, FieldValues } from 'react-hook-form';
import type { FormHTMLAttributes, ReactNode } from 'react';

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  /** Optional handler when validation fails */
  onInvalid?: (errors: any) => void;
  children: ReactNode;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onInvalid,
  children,
  ...formProps
}: FormProps<TFieldValues>) {
  return (
    <RHFFormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate {...formProps}>
        {children}
      </form>
    </RHFFormProvider>
  );
}
