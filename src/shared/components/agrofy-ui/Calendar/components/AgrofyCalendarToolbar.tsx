// CalendarToolbar.tsx
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@/shared/components/agrofy-ui';
import DatePill from '@/shared/components/agrofy-ui/DatePill/DatePill';
import { useFormattedDate } from '@/features/schedule/clinic-schedule/context/FormattedDateContext'
import ThemeText from '@/shared/theme/themeText';
import { IconSearch } from '@tabler/icons-react';

type RangeType = 'hari' | 'minggu' | 'bulan';

export interface Props {
  view: 'hari' | 'minggu' | 'bulan';
  prevMonth?: () => void;
  nextMonth?: () => void;
  prevWeek?: () => void;
  nextWeek?: () => void;
  prevDate?: () => void;
  nextDate?: () => void;
  range: RangeType;
  setRange: (r: RangeType) => void;
  currentDate: Date;
  isActive: boolean | undefined;
  onStatusChange?: (s: boolean | undefined) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export const CalendarToolbar: React.FC<Props> = ({
  prevMonth,
  nextMonth,
  prevWeek,
  nextWeek,
  prevDate,
  nextDate,
  range,
  setRange,
  currentDate,
  isActive,
  onStatusChange,
  search,
  onSearchChange,
}) => {
  
  const { setFormattedDate } = useFormattedDate();
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <div role="tablist" aria-label="range" className="flex items-center bg-white w-fit h-[36px] border rounded-md">
          <Button variant={range === 'hari' ? 'accent' : 'ghost'} onClick={() => setRange('hari')} className={`${range === 'hari' ? 'text-primary' : 'text-black/80'} rounded-r-none rounded-l-md ring-0`}>Hari Ini</Button>
          <Button variant={range === 'minggu' ? 'accent' : 'ghost'} onClick={() => setRange('minggu')} className={`${range === 'minggu' ? 'text-primary' : 'text-black/80'} rounded-none ring-0`}>Minggu Ini</Button>
          <Button variant={range === 'bulan' ? 'accent' : 'ghost'} onClick={() => setRange('bulan')} className={`${range === 'bulan' ? 'text-primary' : 'text-black/80'} rounded-l-none rounded-r-md ring-0`}>Bulan Ini</Button>
        </div>

        <DatePill
          date={currentDate}
          showBell={false}
          view={range === 'bulan' ? 'month' : range === 'minggu' ? 'week' : 'date'}
          onPrev={range === 'bulan' ? prevMonth : range === 'minggu' ? prevWeek : prevDate}
          onNext={range === 'bulan' ? nextMonth : range === 'minggu' ? nextWeek : nextDate}
          onBell={() => { }}
          onFormattedChange={setFormattedDate}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FormControlLabel
          control={<Checkbox checked={!!isActive} onChange={(e) => onStatusChange?.(e.target.checked ? true : undefined)} />}
          label={<Typography sx={{ ...ThemeText.BodyS, fontWeight: 400 }}>Hanya lihat user yang aktif</Typography>}
        />
        <TextField
          id='employee-filter-search-input'
          className='bg-white rounded-[8px] '
          placeholder="Cari Pasien"
          size="small"
          value={search}
          onChange={(e: any) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.5 }} />,
          }}
        />
      </Box>

    </Box>
  );
}
