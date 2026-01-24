import { Box, Slider as MuiSlider, SliderProps as MuiSliderProps, Typography } from '@mui/material';
import React from 'react';

export interface RangeSliderProps extends Omit<MuiSliderProps, 'value' | 'onChange'> {
  /**
   * The value of the slider
   */
  value: number[];
  /**
   * Callback fired when the slider value changes
   */
  onChange: (value: number[]) => void;
  /**
   * Optional label for the slider
   */
  label?: string;
  /**
   * Optional formatter function for displaying the values
   * @param value - The value to format
   * @returns The formatted string
   */
  valueFormatter?: (value: number) => string;
  /**
   * Optional unit to display after the value (e.g., 'min', 'km', etc.)
   */
  unit?: string;
  /**
   * Whether to show the value labels below the slider
   * @default true
   */
  showValues?: boolean;
}

/**
 * RangeSlider - A reusable range slider component
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState([0, 100]);
 *
 * <RangeSlider
 *   value={range}
 *   onChange={setRange}
 *   min={0}
 *   max={100}
 *   label="Select Range"
 *   unit="km"
 * />
 * ```
 */
export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  label,
  valueFormatter,
  unit,
  showValues = true,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  const formatValue = (val: number): string => {
    if (valueFormatter) {
      return valueFormatter(val);
    }
    if (unit) {
      return `${val} ${unit}`;
    }
    return String(val);
  };

  return (
    <Box>
      {label && (
        <Typography fontSize={13} fontWeight={600} gutterBottom>
          {label}
        </Typography>
      )}
      <Box className="mt-2">
        <MuiSlider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={step}
          sx={{
            '& .MuiSlider-thumb': {
              width: 15,
              height: 15,
            },
            ...props.sx,
          }}
          {...props}
        />
        {showValues && (
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption">{formatValue(value[0])}</Typography>
            <Typography variant="caption">{formatValue(value[1])}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
