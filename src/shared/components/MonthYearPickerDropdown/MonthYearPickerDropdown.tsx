import { Box, FormControl, InputLabel, Menu, MenuItem, Button as MUIButton, Select, SelectChangeEvent } from '@mui/material';
import { Calendar, ChevronDown } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '../agrofy-ui';

export type MonthYear = { month: number; year: number };

interface Props {
    value?: MonthYear | null;
    onChange?: (value: MonthYear) => void;
    label?: string;
    minYear?: number;
    maxYear?: number;
    yearsBack?: number; // if minYear not provided, use maxYear - yearsBack
}

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const MonthYearPickerDropdown: React.FC<Props> = ({ value, onChange, maxYear, minYear, yearsBack = 10 }) => {
    const now = new Date();
    const defaultYear = value?.year ?? now.getFullYear();
    const defaultMonth = value?.month ?? now.getMonth() + 1;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear);

    const maxY = maxYear ?? now.getFullYear();
    const minY = minYear ?? (maxY - yearsBack);

    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = maxY; y >= minY; y--) arr.push(y);
        return arr;
    }, [minY, maxY]);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
        // initialize with current value when opening
        setSelectedMonth(value?.month ?? defaultMonth);
        setSelectedYear(value?.year ?? defaultYear);
    };

    const handleClose = () => setAnchorEl(null);

    const handleApply = () => {
        onChange?.({ month: selectedMonth, year: selectedYear });
        handleClose();
    };

    const handleMonthChange = (e: SelectChangeEvent<number>) => {
        const v = Number(e.target.value);
        setSelectedMonth(v);
    };

    const handleYearChange = (e: SelectChangeEvent<number>) => {
        const v = Number(e.target.value);
        setSelectedYear(v);
    };

    const labelText = value
        ? `${monthNames[(value.month || 1) - 1]} ${value.year}`
        : `${monthNames[defaultMonth - 1]} ${defaultYear}`;

    return (
        <>
            <Button
                onClick={handleOpen}
                color='gray'
                className='bg-white'
                variant="outlined"
                style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8 }}
            >
                <Calendar size={16} />
                <span>{labelText}</span>
                <ChevronDown size={16} />
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { p: 2, minWidth: 320 } }}
            >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="month-select-label">Bulan</InputLabel>
                        <Select
                            labelId="month-select-label"
                            value={String(selectedMonth)}
                            label="Bulan"
                            onChange={handleMonthChange as any}
                        >
                            {monthNames.map((m, i) => (
                                <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel id="year-select-label">Tahun</InputLabel>
                        <Select
                            labelId="year-select-label"
                            value={String(selectedYear)}
                            label="Tahun"
                            onChange={handleYearChange as any}
                        >
                            {years.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <MUIButton size="small" onClick={handleClose}>Batal</MUIButton>
                    <MUIButton variant="contained" size="small" onClick={handleApply}>Pilih</MUIButton>
                </Box>
            </Menu>
        </>
    );
};

export default MonthYearPickerDropdown;
