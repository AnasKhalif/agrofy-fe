import React, { useMemo, useState, useEffect } from 'react';
import Datepicker, { DateValueType, DateRangeType } from 'react-tailwindcss-datepicker';
import { useTheme } from '@mui/material/styles';
import { FormHelperText, Box } from '@mui/material';
import styles from './DateRangePicker.module.css';

export interface DateRangePickerProps {
  value: DateValueType;
  onChange: (value: DateValueType) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  displayFormat?: string;
  separator?: string;
  startFrom?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DateRangeType[];
  readOnly?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  toggleClassName?: string;
  showShortcuts?: boolean;
  showFooter?: boolean;
  configs?: {
    shortcuts?: {
      [key: string]: {
        text: string;
        period: {
          start: Date | string;
          end: Date | string;
        };
      };
    };
  };
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder: _placeholder = 'Select date range',
      error = false,
      helperText,
      disabled = false,
      required = false,
      id,
      displayFormat = 'DD/MM/YYYY',
      separator = '~',
      startFrom,
      minDate,
      maxDate,
      disabledDates,
      readOnly = false,
      inputClassName,
      containerClassName,
      toggleClassName,
      showShortcuts = false,
      showFooter = false,
      configs,
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Check if the input has a value
    useEffect(() => {
      const hasValue = value && (
        (value.startDate && value.startDate !== null) ||
        (value.endDate && value.endDate !== null)
      );
      setHasValue(!!hasValue);
    }, [value]);

    // Handle focus events on the input element
    useEffect(() => {
      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => setIsFocused(false);

      // Find the input element within the datepicker
      const inputElement = document.getElementById(id || '');
      if (inputElement) {
        inputElement.addEventListener('focus', handleFocus);
        inputElement.addEventListener('blur', handleBlur);

        return () => {
          inputElement.removeEventListener('focus', handleFocus);
          inputElement.removeEventListener('blur', handleBlur);
        };
      }
    }, [id]);

    // Build custom styles that match Material Design - using CSS module for floating label
    const customInputClassName = useMemo(() => {
      const baseClasses = [
        styles.inputField,
        error ? styles.error : '',
        inputClassName || '',
      ];

      return baseClasses.filter(Boolean).join(' ');
    }, [error, inputClassName]);



    const customToggleClassName = useMemo(() => {
      const baseClasses = [
        'absolute',
        'right-3',
        'top-1/2',
        '-translate-y-1/2',
        'transition-colors',
      ];

      // Material Design spec: icons use text.secondary color
      baseClasses.push(`text-[${theme.palette.text.secondary}]`);
      baseClasses.push(`hover:text-[${theme.palette.text.primary}]`);

      return baseClasses.join(' ') + (toggleClassName ? ` ${toggleClassName}` : '');
    }, [theme.palette, toggleClassName]);

    // Floating label styles - match MUI FormLabel styling
    const floatingLabelStyle = useMemo(() => ({
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.grey[700],
      '--label-focus-color': error ? theme.palette.error.main : theme.palette.primary.main,
    } as React.CSSProperties), [theme.palette, error]);

    return (
      <Box ref={ref} sx={{ width: '100%' }}>
        <div className={styles.inputContainer}>
          <div 
            style={{ 
              '--border-color': error ? theme.palette.error.main : theme.palette.divider, 
              '--focus-border-color': error ? theme.palette.error.main : theme.palette.primary.main,
              '--border-radius': `${theme.shape.borderRadius}px`
            } as React.CSSProperties}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <Datepicker
              primaryColor="blue"
              value={value}
              onChange={onChange}
              placeholder=" " // Important: space placeholder for CSS :not(:placeholder-shown) to work
              separator={separator}
              displayFormat={displayFormat}
              disabled={disabled}
              readOnly={readOnly}
              startFrom={startFrom}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              showShortcuts={showShortcuts}
              showFooter={showFooter}
              configs={configs}
              inputId={id}
              inputClassName={customInputClassName}
              containerClassName={(containerClassName || 'relative') + ' react-tailwindcss-datepicker'}
              toggleClassName={customToggleClassName}
              popoverDirection="down"
              useRange={true}
              asSingle={false}
            />
          </div>
          {label && (
            <label
              htmlFor={id}
              className={`${styles.floatingLabel} ${(isFocused || hasValue) ? styles.floatingLabelActive : ''} ${error ? styles.floatingLabelError : ''}`}
              style={floatingLabelStyle}
            >
              {label}
              {required && <span className={styles.required}> *</span>}
            </label>
          )}
        </div>
        {helperText && (
          <FormHelperText
            error={error}
            sx={{
              fontSize: '0.75rem', // Match MUI FormHelperText fontSize
              marginLeft: 0, // Match MUI FormHelperText marginLeft
              marginTop: '4px', // Match MUI FormHelperText marginTop
              color: error ? theme.palette.error.main : theme.palette.text.secondary,
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
