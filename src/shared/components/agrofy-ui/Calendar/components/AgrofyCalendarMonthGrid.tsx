// MonthGrid.tsx
import dayjs from 'dayjs';
import { CalendarEventCard } from './AgrofyCalendarEventCard';
import { CalendarAction } from '../AgrofyCalendar.types';
import { useState } from 'react';
import { AgrofyCalendarPopoverMoreEvent } from './AgrofyCalendarPopoverMoreEvent';
import { CalendarEvent } from '../AgrofyCalendar.types';

interface Props {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  actions? : (Event: CalendarEvent) => CalendarAction[];
}

export function MonthGrid({ date, events, onEventClick, actions }: Props) {
  const start = dayjs(date).startOf('month').startOf('week');
  const end = dayjs(date).endOf('month').endOf('week');

  const days: dayjs.Dayjs[] = [];
  let d = start;
  while (d.isBefore(end)) {
    days.push(d);
    d = d.add(1, 'day');
  }

  const MAX_EVENTS_PER_DAY = 3;
  const [popoverDay, setPopoverDay] = useState<dayjs.Dayjs | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);

  return (
    <div className="grid grid-cols-7 border overflow-auto">
      {days.map(day => {
        const isOutsideMonth = !day.isSame(date, 'month');
        const dayEvents = events.filter(e =>
          dayjs(e.start).isSame(day, 'day')
        );

        return (
          <div
            key={day.toString()}
            className={`
              min-h-[120px] border p-2
              ${isOutsideMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-black'}
            `}
            style={
              isOutsideMonth
                ? {
                    backgroundImage:
                      'repeating-linear-gradient(45deg, #f1f1f1ff, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)',
                  }
                : undefined
            }
          >
            <div className="text-xs   mb-1">
              {day.format('DD')}
            </div>

            <div className="space-y-1">
              {dayEvents.slice(0, MAX_EVENTS_PER_DAY).map(event => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  filter="month"
                  actions={actions}
                />
              ))}

              {dayEvents.length > MAX_EVENTS_PER_DAY && (
                <div
                  className="
                    text-[10px]
                    text-gray-600
                    bg-gray-100
                    rounded
                    px-2 py-0.5
                    cursor-pointer
                    hover:bg-gray-200
                  "
                  onClick={e => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    setAnchorRect(rect);
                    setPopoverDay(day);
                    setPopoverEvents(dayEvents);
                  }}
                >
                  +{dayEvents.length - MAX_EVENTS_PER_DAY} more
                </div>
              )}
            </div>
          </div>
        );
      })}

      {popoverDay && anchorRect && (
        <AgrofyCalendarPopoverMoreEvent
          anchorRect={anchorRect}
          date={popoverDay}
          events={popoverEvents}
          onClose={() => setPopoverDay(null)}
          onEventClick={onEventClick}
          actions={actions}
        />
      )}
    </div>
  );
}
