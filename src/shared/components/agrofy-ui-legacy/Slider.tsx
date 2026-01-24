
import { Box, Slider as MuiSlider, SliderProps, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface RangeSliderProps extends Omit<SliderProps, 'control'> {
  control: Control<any>;
  name: string;
  label: string;
}

export const Slider: React.FC<RangeSliderProps> = ({
  control,
  name,
  label,
  min,
  max,
  step,
  ...props
}) => {
  return (
    <Box>
      <Typography id="range-slider" gutterBottom>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MuiSlider
            {...field}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={min}
            max={max}
            step={step}
            {...props}
          />
        )}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(control._getWatch(name)?.[0] || min)}
        </Typography>
        <Typography variant="body2">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(control._getWatch(name)?.[1] || max)}
        </Typography>
      </Box>
    </Box>
  );
};
