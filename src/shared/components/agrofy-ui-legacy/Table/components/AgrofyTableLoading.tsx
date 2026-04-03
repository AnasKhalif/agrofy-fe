import React from 'react';
import { Box } from '../../Box';
import { CircularProgress } from '../../CircularProgress';
import { Typography } from '../../Typography';

interface AgrofyTableLoadingProps {
  text?: string;
}

export const AgrofyTableLoading: React.FC<AgrofyTableLoadingProps> = ({
  text = 'Loading...'
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="textSecondary">
          {text}
        </Typography>
      </Box>
    </Box>
  );
};
