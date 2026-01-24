import { Box, IconButton, SxProps, Theme, Typography } from '@mui/material';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface DatePillProps {
  date: Date;
  onPrev?: () => void;
  onNext?: () => void;
  onBell?: () => void;
  sx?: SxProps<Theme> | undefined;
  showBell?: boolean;
  /** display mode: 'month' (default), 'date' or 'week' */
  view?: 'month' | 'date' | 'week';
  onFormattedChange?: (formatted: string) => void;
}

export default function DatePill({ date, onPrev, onNext, onBell, sx = {}, view = 'month', showBell = true, onFormattedChange }: DatePillProps) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    let newFormatted = '';
    if (view === 'month') {
      newFormatted = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
    } else if (view === 'date') {
      newFormatted = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    } else {
      // week view: show start - end (Mon - Sun) range
      const d = new Date(date);
      // compute Monday as start of week
      const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
      const diffToMonday = (day + 6) % 7; // number of days since Monday
      const start = new Date(d);
      start.setDate(d.getDate() - diffToMonday);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startDay = new Intl.DateTimeFormat('id-ID', { day: 'numeric' }).format(start);
      const endDay = new Intl.DateTimeFormat('id-ID', { day: 'numeric' }).format(end);
      const startMonth = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(start);
      const endMonth = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(end);
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();

      if (startMonth === endMonth && startYear === endYear) {
        newFormatted = `${startDay} - ${endDay} ${startMonth} ${startYear}`;
      } else if (startYear === endYear) {
        newFormatted = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
      } else {
        newFormatted = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
      }
    }

    setFormatted(newFormatted);
    if (onFormattedChange) {
      onFormattedChange(newFormatted);
    }
  }, [date, view, onFormattedChange]);

  return (
    <Box display="flex" alignItems="center" gap={1} sx={sx}>
      <IconButton
        aria-label={view === 'month' ? 'previous month' : 'previous date'}
        onClick={onPrev}
        sx={{ width: 36, height: 36, bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}
        size="small"
      >
        <ChevronLeft size={16} />
      </IconButton>

      <Box
        sx={{
          width: { xs: 160, md: 200 },
          minHeight: 36,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: '14px', color: '#2A3547CC', opacity: 0.9, textAlign: 'center' }}>
          {formatted}
        </Typography>
      </Box>

      <IconButton
        aria-label={view === 'month' ? 'next month' : 'next date'}
        onClick={onNext}
        sx={{ width: 36, height: 36, bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}
        size="small"
      >
        <ChevronRight size={16} />
      </IconButton>

      {showBell && (
        <IconButton size="small" aria-label="notifications" onClick={onBell} sx={{ width: 36, height: 36, bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}>
          <Bell size={16} />
        </IconButton>
      )}
    </Box>
  );
}
