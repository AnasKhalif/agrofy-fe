import {
  Controller,
  useFormContext,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { X } from 'lucide-react';

export interface FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  id?: string;
  name: TName;
  label?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function FormMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  id,
  name,
  label,
  rules,
  defaultValue,
  options,
  fullWidth = true,
  required = false,
  disabled = false,
  placeholder,
  ...autocompleteProps
}: FormMultiSelectProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue || []}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          id={id}
          multiple
          {...autocompleteProps}
          options={options}
          getOptionLabel={(option) => option.label}
          value={options.filter((option) => field.value?.includes(option.value)) || []}
          onChange={(_, newValue) => {
            field.onChange(newValue.map((option) => option.value));
          }}
          onBlur={field.onBlur}
          disabled={disabled}
          fullWidth={fullWidth}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              required={required}
              error={!!error}
              helperText={error?.message}
              // InputLabelProps={{ shrink: true }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={option.label}
                disabled={disabled}
                deleteIcon={<X size={14} />}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #2A35471A',
                  '& .MuiChip-deleteIcon': {
                    color: '#6B7280',
                    margin: 0,
                    // pr: 1,
                    mx: 0.5,
                    '&:hover': {
                      color: '#374151',
                    },
                  },
                }}
              />
            ))
          }
        />
      )}
    />
  );
}
