import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import React, { useState, useCallback, ChangeEvent } from 'react';

export type InputCurrencyProps = Omit<MuiTextFieldProps, 'onChange' | 'value'> & {
  value?: number | string;
  onChange?: (value: number) => void;
  decimalSeparator?: string;
  thousandSeparator?: string;
  allowNegative?: boolean;
  maxValue?: number;
  minValue?: number;
};

export const InputCurrency = React.forwardRef<HTMLDivElement, InputCurrencyProps>(
  (
    {
      value = '',
      onChange,
      decimalSeparator = ',',
      thousandSeparator = '.',
      allowNegative = false,
      maxValue,
      minValue,
      ...props
    },
    ref
  ) => {
    // Format number to display string
    const formatNumber = useCallback(
      (num: number | string): string => {
        if (num === '' || num === null || num === undefined) return '';

        const numValue = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(numValue)) return '';

        // Split integer and decimal parts
        const parts = numValue.toString().split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        // Add thousand separator to integer part
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

        // Combine with decimal part if exists
        return decimalPart !== undefined
          ? `${formattedInteger}${decimalSeparator}${decimalPart}`
          : formattedInteger;
      },
      [thousandSeparator, decimalSeparator]
    );

    // Parse display string to number
    const parseNumber = useCallback(
      (str: string): number => {
        if (!str) return 0;

        // Remove thousand separators and replace decimal separator with dot
        const cleanedStr = str
          .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
          .replace(decimalSeparator, '.');

        const parsed = parseFloat(cleanedStr);
        return isNaN(parsed) ? 0 : parsed;
      },
      [thousandSeparator, decimalSeparator]
    );

    const [displayValue, setDisplayValue] = useState<string>(() => formatNumber(value));

    // Update display value when external value changes
    React.useEffect(() => {
      setDisplayValue(formatNumber(value));
    }, [value, formatNumber]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Allow empty input
      if (inputValue === '') {
        setDisplayValue('');
        onChange?.(0);
        return;
      }

      // Check if input contains only valid characters
      const validCharsRegex = allowNegative
        ? new RegExp(`^-?[0-9${thousandSeparator}${decimalSeparator}]*$`)
        : new RegExp(`^[0-9${thousandSeparator}${decimalSeparator}]*$`);

      if (!validCharsRegex.test(inputValue)) {
        return; // Reject invalid characters
      }

      // Parse the input to number
      const numValue = parseNumber(inputValue);

      // Check min/max constraints
      if (maxValue !== undefined && numValue > maxValue) {
        return; // Reject if exceeds max
      }
      if (minValue !== undefined && numValue < minValue) {
        return; // Reject if below min
      }

      // Update display value
      setDisplayValue(inputValue);

      // Call onChange with numeric value
      onChange?.(numValue);
    };

    const handleBlur = () => {
      // Reformat on blur to ensure proper formatting
      const numValue = parseNumber(displayValue);
      setDisplayValue(formatNumber(numValue));
    };

    const hasValue = displayValue !== '';
    const shouldShrink = hasValue || props.InputLabelProps?.shrink;

    return (
      <MuiTextField
        ref={ref}
        {...props}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        InputLabelProps={{
          shrink: shouldShrink,
          sx: { color: 'text.secondary' },
          ...props.InputLabelProps,
        }}
      />
    );
  }
);

InputCurrency.displayName = 'InputCurrency';
