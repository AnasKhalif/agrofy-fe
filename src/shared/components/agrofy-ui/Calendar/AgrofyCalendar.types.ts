// calendar.types.ts
import { Appointment } from "@/app/api/clinic_schedule";

export type CalendarViewType = 'hari' | 'minggu' | 'bulan';
export type SessionStatus = 'arrived' | 'in_progress' | 'in_progress_consultation' | 'awaiting_payment' | 'paid' | 'cancelled';
export type ScheduleStatus = 'arrived' | 'rescheduled' | 'scheduled' | 'cancelled';

export const getSessionStatusLabel = (status: SessionStatus | ScheduleStatus): string => {
  switch (status) {
    case 'arrived':
      return 'Tiba';
    case 'in_progress':
      return 'Sedang Berlangsung';
    case 'in_progress_consultation':
      return 'Sedang Konsultasi';
    case 'awaiting_payment':
      return 'Menunggu Pembayaran';
    case 'paid':
      return 'Lunas';
    case 'cancelled':
      return 'Dibatalkan';
    case 'scheduled':
      return 'Dijadwalkan';
    case 'rescheduled':
      return 'Dijadwalkan Ulang';
    default:
      return status;
  }
}

export const getScheduleStatusLabel = (status: ScheduleStatus): string => {
  switch (status) {
    case 'arrived':
      return 'Tiba';
    case 'rescheduled':
      return 'Dijadwalkan Ulang';
    case 'scheduled':
      return 'Dijadwalkan';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status;
  }
};

export interface CalendarEvent {
  id: string ;
  doctor_name? : string;
  patient_name?: string;
  title: string;
  photo_room? : string;
  photo_patient? : string;
  status_transaction? : ScheduleStatus | SessionStatus;
  duration?: number;
  start: string; // ISO
  end: string;   // ISO
  resource?: string;
  color?: string;
  items?: string[];
  appointment: Appointment;
}

export interface CalendarAction<T = CalendarEvent> {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (event: T) => void;
  needsConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: (event: T) => string;
  confirmationType?: 'danger' | 'default';
  disabled?: boolean | ((event: T) => boolean);
}
