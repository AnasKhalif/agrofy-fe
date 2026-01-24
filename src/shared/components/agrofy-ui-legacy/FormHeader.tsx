import ThemeText from '@/shared/theme/themeText';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

type FormHeaderProps = {
  title: string;
  onBackClick: () => void;
};

export const FormHeader: React.FC<FormHeaderProps> = ({ title, onBackClick }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton id='form-header-back-button' onClick={onBackClick} sx={{ p: 0.5 }}>
        <ArrowLeft size={20} />
      </IconButton>

      <Typography sx={{ ...ThemeText.HeroH4, color: 'black' }}>{title}</Typography>
    </Box>
  );
};
