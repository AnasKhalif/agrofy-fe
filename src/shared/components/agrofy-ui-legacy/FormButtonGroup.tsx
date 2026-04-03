
import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface Option {
  label: string;
  value: any;
}

interface FormButtonGroupProps {
  name: string;
  label: string;
  options: Option[];
  rules?: Record<string, any>;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
  boldLabel?: boolean;
}

export const FormButtonGroup: React.FC<FormButtonGroupProps> = ({
  name,
  label,
  options,
  rules,
  required,
  fullWidth,
  id,
  boldLabel = false,
}) => {
  const { control } = useFormContext();

  const validationRules = {
    ...rules,
    ...(required && { required: `${label} is required` }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth={fullWidth}>
          <Typography
            component="label"
            htmlFor={name}
            sx={{
              display: 'block',
              marginBottom: 1,
              fontSize: '14px',
              fontWeight: boldLabel ? 700 : 500,
            }}
          >
            {label} {required && '*'}
          </Typography>
          <ButtonGroup fullWidth={fullWidth}>
            {options.map((option) => (
              <Button
                key={option.value}
                id={`${id}-${option.value}-btn`}
                onClick={() => field.onChange(option.value)}
                variant={field.value === option.value ? 'contained' : 'outlined'}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
