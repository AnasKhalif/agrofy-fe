import { Controller, useFormContext, useWatch, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Select, FormControl, InputLabel, MenuItem } from './Select';
import { FormHelperText } from '../FormHelperText';
import type { SelectProps } from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';

const shouldLabelShrink = (value: any): boolean => {
  return value !== undefined && value !== '' && value !== null;
};

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<SelectProps, 'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'> {
  name: TName;
  label?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  emptyOption?: {
    value: string | number;
    label: string;
  };
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Enable searchable dropdown (typeahead). Renders an Autocomplete internally. */
  searchable?: boolean;
  /** Async search handler. Called when user types in searchable mode. */
  onSearch?: (keyword: string) => void;
  /** Loading state for async search */
  loading?: boolean;
  /** Debounce delay in milliseconds for async search (default: 300) */
  debounceMs?: number;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  rules,
  defaultValue,
  options,
  emptyOption,
  fullWidth = true,
  required = false,
  disabled = false,
  searchable = false,
  onSearch,
  loading = false,
  debounceMs = 500,
  ...selectProps
}: FormSelectProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const labelId = label ? `${name}-label` : undefined;
  const [inputValue, setInputValue] = useState('');

  // Watch the current field value so we can sync inputValue when value changes programmatically
  const watchedValue = useWatch({ control, name: name as any });

  // Sync inputValue to display selected option label when field value changes
  useEffect(() => {
    if (!searchable) return;
    const found = options.find((o) => String(o.value) === String(watchedValue));
    if (found) {
      setInputValue(String(found.label));
    }
  }, [watchedValue, options, searchable]);

  // If options contain percent labels like "10%", enable percent-mode sanitization
  const hasPercentOptions = options.some((o) => String(o.label).includes('%'));

  const dropdownShadow = '0 8px 20px rgba(2,6,23,0.12)';

  // Debounce search handler
  useEffect(() => {
    if (!onSearch || !searchable) return;

    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearch, searchable, debounceMs]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} required={required} error={!!error} disabled={disabled}>
          {(label && !searchable) && (
            <InputLabel id={labelId} required={required} shrink={shouldLabelShrink(field.value)} sx={{ color: 'text.secondary' }}>
              {label}
            </InputLabel>
          )}
          {searchable ? (
            <Autocomplete<{ value: string | number; label: string }>
              options={options}
              getOptionLabel={(opt) => String(opt.label || '')}
              isOptionEqualToValue={(opt, val) => String(opt.value) === String((val as any)?.value)}
              // Keep a stable value object so Autocomplete doesn't reset when options change.
              value={(() => {
                const found = options.find((o) => String(o.value) === String(field.value));
                if (found) return found as any;
                // If not found in options (options may be loading or updated), keep a fallback
                // object that preserves the current field value and displayed input text.
                return field.value ? ({ value: field.value, label: inputValue } as any) : null;
              })()}
              onChange={(_, newVal) => {
                const val = newVal ? (newVal as any).value : '';
                field.onChange(val);
                // Update the text shown in the input to the selected label
                setInputValue(newVal ? String((newVal as any).label) : '');
              }}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                // Determine if we should restrict to digits and percent sign
                const percentMode = hasPercentOptions;
                if (percentMode) {
                  // Remove all characters except digits and percent sign
                  const sanitized = String(newInputValue).replace(/[^0-9%]+/g, '');
                  setInputValue(sanitized);
                } else {
                  // Default behavior: remove control chars but allow normal typing
                  setInputValue(newInputValue);
                }
              }}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant={selectProps.variant as any}
                  label={label}
                  required={required}
                  error={!!error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  // forward any inputProps passed to FormSelect (keeps existing behavior)
                  inputProps={{
                    ...params.inputProps,
                    ...((selectProps as any).inputProps || {}),
                  }}
                />
              )}
              disabled={disabled}
              fullWidth={fullWidth}
              PaperComponent={(props) => <Paper {...props} sx={{ boxShadow: dropdownShadow }} />}
              {...(selectProps as any)}
            />
          ) : (
            <Select
              {...field}
              {...selectProps}
              labelId={labelId}
              label={label}
              value={field.value ?? ''}
              required={required}
              notched={shouldLabelShrink(field.value)}
              MenuProps={{
                ...(selectProps as any).MenuProps,
                PaperProps: {
                  ...(selectProps as any).MenuProps?.PaperProps,
                  sx: {
                    ...(selectProps as any).MenuProps?.PaperProps?.sx,
                    boxShadow: dropdownShadow,
                  },
                },
              }}
            >
              {emptyOption && (
                <MenuItem value={emptyOption.value}>
                  <em>{emptyOption.label}</em>
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
