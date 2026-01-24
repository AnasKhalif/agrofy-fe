
import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface FormBooleanProps {
  name: string;
  label: string;
  rules?: Record<string, any>;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export const FormBoolean: React.FC<FormBooleanProps> = ({
  name,
  label,
  rules,
  required,
  fullWidth,
  id,
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
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
          <ButtonGroup fullWidth={fullWidth}>
            <Button
              id={`${id}-true-btn`}
              onClick={() => field.onChange(true)}
              variant={field.value === true ? 'contained' : 'outlined'}
            >
              Ya
            </Button>
            <Button
              id={`${id}-false-btn`}
              onClick={() => field.onChange(false)}
              variant={field.value === false ? 'contained' : 'outlined'}
            >
              Tidak
            </Button>
          </ButtonGroup>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
