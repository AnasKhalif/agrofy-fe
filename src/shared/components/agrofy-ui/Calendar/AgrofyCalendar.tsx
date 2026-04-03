import { useState } from 'react';
import { CalendarToolbar } from './components/AgrofyCalendarToolbar';
import { MonthGrid } from './components/AgrofyCalendarMonthGrid';
import { WeekGrid } from './components/AgrofyCalendarWeekGrid';
import { DayGrid } from './components/AgrofyCalendarDayGrid';
import { CalendarEvent } from './AgrofyCalendar.types';
import { CalendarAction } from './AgrofyCalendar.types';
import { Appointment } from '@/app/api/clinic_schedule';
import { SelectRoomModal } from '@/features/schedule/clinic-schedule/components/SelectRoomModal';
import { useBoolean } from '@/shared/hooks/useBoolean';
import DetailDrawer from '@/features/schedule/doctor-schedule/components/details/DetailDrawer';

type RangeType = 'hari' | 'minggu' | 'bulan';

interface Props {
  events: CalendarEvent[];
  initialView?: 'hari' | 'minggu' | 'bulan';
  onEventClick?: (event: CalendarEvent) => void;
  prevMonth?: () => void;
  nextMonth?: () => void;
  prevWeek?: () => void;
  nextWeek?: () => void;
  prevDate?: () => void;
  nextDate?: () => void;
  range: RangeType;
  setRange: (r: RangeType) => void;
  currentDate: Date;
  onRescheduleClick: (appointment: Appointment) => void;
  onManagePhotoClick: (patientId: string, scheduleId?: string) => void;
  onCheckClick: (appointmentId: string, roomId: string) => void;
  onPaymentClick: (appointment: Appointment) => void;
  onSignDocumentsClick: (appointment: Appointment) => void;
  isActive: boolean | undefined;
  onStatusChange?: (s: boolean | undefined) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function CalendarView({
  events,
  initialView = 'hari',
  onEventClick,
  prevMonth,
  nextMonth,
  prevWeek,
  nextWeek,
  prevDate,
  nextDate,
  range,
  setRange,
  currentDate,
  onRescheduleClick,
  onManagePhotoClick,
  onCheckClick,
  onPaymentClick,
  onSignDocumentsClick,
  isActive,
  onStatusChange,
  search,
  onSearchChange,
}: Props) {
  const [view, _] = useState<'hari' | 'minggu' | 'bulan'>(initialView);
  const roomModal = useBoolean();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const detailDrawerModal = useBoolean();
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<CalendarEvent | null>(null);

  const handleOpenRoomModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    roomModal.setTrue();
  };

  const handleConfirmRoom = (roomId: string) => {
    if (selectedAppointment) {
      onCheckClick(selectedAppointment.id, roomId);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) onEventClick(event);
  };

  const handleViewDetails = (event: CalendarEvent) => {
      setSelectedDetailEvent(event);
      detailDrawerModal.setTrue();
  };

  // const calendarActions: CalendarAction[] = [
  //   {
  //     label: 'Lihat Detail',
  //     onClick: (event) => {
  //       console.log('DETAIL', event.id);
  //     },
  //   },
  //   {
  //     label: 'Sudah Tiba',
  //     onClick: (event) => {
  //       console.log('ARRIVED', event.id);
  //     },
  //     disabled: (event) => event.status_transaction !== 'scheduled',
  //   },
  //   {
  //     label: 'Pembayaran',
  //     onClick: (event) => {
  //       console.log('PAYMENT', event.id);
  //     },
  //   },
  //   {
  //     label: 'Reschedule',
  //     onClick: (event) => {
  //       console.log('RESCHEDULE', event.id);
  //     },
  //   },
  //   {
  //     label: 'Batal',
  //     confirmationType: 'danger',
  //     confirmationTitle: 'Batalkan Jadwal',
  //     confirmationMessage: (event) =>
  //       `Batalkan jadwal ${event.patient_name}?`,
  //     onClick: (event) => {
  //       console.log('CANCEL', event.id);
  //     },
  //   },
  // ];

  const getActions = (event: CalendarEvent): CalendarAction[] => {
      const actions: CalendarAction[] = [];

      const status = event.status_transaction as string;

      const allowedStatusesForReschedule = [
          'in progress', 'in_progress_consultation', 'rescheduled', 
          'awaiting_payment', 'paid', 'done', 'cancelled'
      ];
      const canReschedule = !allowedStatusesForReschedule.includes(status);

      const appointmentData = event.appointment;
      console.log('appointmentData:', appointmentData);

      if(event.status_transaction !== 'scheduled') {
        actions.push({
            label: 'Lihat Detail',
            onClick: () => handleViewDetails(event),
        });
      }
      if (canReschedule) {
          actions.push({
              label: 'Reschedule',
              onClick: () => onRescheduleClick(event.appointment),
          });
      }

      if (status === 'awaiting_payment' || status === 'paid') {
          actions.push({
              label: 'Pembayaran',
              onClick: () => onPaymentClick(event.appointment), 
          });
      }

      if (status === 'arrived' || status === 'in_progress' || status === 'in_progress_consultation') {
          actions.push({
              id: `manage-photo-${event.appointment.booking_id}`, 
              label: 'Atur Foto',
              onClick: () => onManagePhotoClick(event.appointment.patient_id, event.id), 
          });
      }

      if (status === 'arrived') {
          actions.push({
              label: 'TTD Pernjanjian Tindakan',
              onClick: () => onSignDocumentsClick(event.appointment), 
          });
      }

      if (status === 'scheduled') {
          actions.push({
              label: 'Sudah Tiba',
              onClick: () => handleOpenRoomModal(event.appointment),
          });

      }

      return actions;
  };

  return (
    <div>
      <CalendarToolbar
        view={view}
        range={range}
        setRange={setRange}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
        prevDate={prevDate}
        nextDate={nextDate}
        currentDate={currentDate}
        isActive={isActive}
        onStatusChange={onStatusChange}
        search={search}
        onSearchChange={onSearchChange}
      />

      {range === 'bulan' && (
        <MonthGrid 
          date={currentDate} 
          events={events} 
          onEventClick={handleEventClick} 
          actions={getActions}
        />
      )}

      {range === 'minggu' && (
        <WeekGrid 
          date={currentDate} 
          events={events} 
          onEventClick={handleEventClick} 
          actions={getActions}
        />
      )}

      {range === 'hari' && (
        <DayGrid 
          date={currentDate} 
          events={events} 
          onEventClick={handleEventClick} 
          actions={getActions}
        />
      )}

      <SelectRoomModal
        open={roomModal.value}
        onClose={roomModal.setFalse}
        onConfirm={handleConfirmRoom}
        appointment={selectedAppointment}
      />

      <SelectRoomModal
            open={roomModal.value}
            onClose={roomModal.setFalse}
            onConfirm={handleConfirmRoom}
            appointment={selectedAppointment}
        />

        {selectedDetailEvent && (
            <DetailDrawer
                open={detailDrawerModal.value}
                onClose={() => {
                    detailDrawerModal.setFalse();
                    setSelectedDetailEvent(null);
                }}
                row={selectedDetailEvent.appointment}
                onReschedule={() => {
                    // setRescheduleDrawerOpen(true);
                    // detailDrawerModal.setFalse();
                }}
            />
        )}
    </div>
  );
}
