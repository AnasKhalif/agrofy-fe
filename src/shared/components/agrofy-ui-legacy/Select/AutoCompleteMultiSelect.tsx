import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

export interface AutocompleteMultiSelectProps {
  id?: string;
  label?: string;
  value?: Array<string | number>; // optional, controlled
  defaultValue?: Array<string | number>; // initial value jika uncontrolled
  onChange?: (value: Array<string | number>) => void; // callback
  options: Array<{
    value: string | number;
    label: string;
  }>;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const AutocompleteMultiSelect: React.FC<AutocompleteMultiSelectProps> = ({
  id,
  label,
  value,
  defaultValue = [],
  onChange,
  options,
  fullWidth = true,
  disabled = false,
  placeholder,
}) => {
  const [internalValue, setInternalValue] = useState<Array<string | number>>(defaultValue);

  // Sync controlled value if value prop diberikan
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (_: any, newValue: { value: string | number; label: string }[]) => {
    const newValues = newValue.map((option) => option.value);
    if (value === undefined) {
      // uncontrolled, update internal state
      setInternalValue(newValues);
    }
    // trigger callback
    onChange?.(newValues);
  };

  return (
    <Autocomplete
      id={id}
      multiple
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.filter((option) => internalValue.includes(option.value)) || []}
      onChange={handleChange}
      disabled={disabled}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label}
            disabled={disabled}
          />
        ))
      }
    />
  );
};
