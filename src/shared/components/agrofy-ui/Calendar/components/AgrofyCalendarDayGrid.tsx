import dayjs from 'dayjs';
import { CalendarEventCard } from './AgrofyCalendarEventCard';
import { getOverlappingEvents } from '../AgrofyCalendar.utils';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/agrofy-ui/ui/avatar';

interface Props {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  actions?: (event: CalendarEvent) => CalendarAction[];
}

export function DayGrid({ date, events, onEventClick, actions }: Props) {    
    const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);
    const HOUR_HEIGHT = 120;
    const dayEvents = events.filter(e =>
        dayjs(e.start).isSame(date, 'day')
    );

    const isEmpty = dayEvents.length === 0;

    // ⬇️ RESOURCE SOURCE SWITCH
    const rooms = isEmpty
        ? [{ resource: '', photo_room: '' }] // dummy column like Google Calendar
        : Array.from(
            new Map(dayEvents.map(e => [e.resource, e])).values()
        );

    const timeLabel = (h: number) => (h >= 12 ? `${h}pm` : `${h}am`);    

    return (
        <div className="bg-white rounded-[12px] border border-gray-200 overflow-visible">
            <div className="border overflow-auto bg-white">
            {/* HEADER */}
            <div
                className="grid sticky top-0 bg-white z-10 border-b"
                style={{
                gridTemplateColumns: `80px repeat(${rooms.length}, 33.333vw)`,
                }}
            >
                <div className="border-r p-3 text-xs font-medium text-center text-black">
                    GMT<br />+07:00
                </div>

                {rooms.map((room, i) => (
                <div
                    key={i}
                    className="flex border-r p-3 text-sm font-medium items-center text-black gap-2"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={room.photo_room} alt={room.resource} />
                        <AvatarFallback>
                            {room.resource?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {!isEmpty && room.resource ? room.resource : 'Belum memilih ruangan'}
                </div>
                ))}
            </div>

            {/* BODY */}
            {HOURS.map(hour => (
                <div
                key={hour}
                className="grid border-t"
                style={{
                    gridTemplateColumns: `80px repeat(${rooms.length}, 33.333vw)`,
                }}
                >
                {/* TIME */}
                <div className="border-r text-xs font-medium text-center pt-2 text-black">
                    {timeLabel(hour)}
                </div>

                {/* COLUMNS */}
                {rooms.map((room, idx) => {
                    const hourEvents = isEmpty
                    ? []
                    : dayEvents.filter(e =>
                        dayjs(e.start).hour() === hour &&
                        e.resource === room.resource
                        );
                    
                    const overlapGroups = getOverlappingEvents(hourEvents);
                    

                    return (
                    <div
                        key={idx}
                        className="relative border-r"
                        style={{ height: HOUR_HEIGHT }}
                    >
                        {/* 15 MIN GRID */}
                        <div className="absolute inset-0 pointer-events-none">
                        {[0, 1, 2, 3].map(i => (
                            <div
                            key={i}
                            className="border-t border-gray-200"
                            style={{
                                position: 'absolute',
                                top: `${(i / 4) * 100}%`,
                                width: '100%',
                            }}
                            />
                        ))}
                        </div>

                        {/* EVENTS (ONLY IF DATA EXISTS) */}
                        {overlapGroups.flatMap(group =>
                            group.map((event, index) => {
                                const start = dayjs(event.start);
                                const end = dayjs(event.end);

                                const top = ((start.minute() / 60) * 100) + 3;
                                const height = ((end.diff(start, 'minute') / 60) * 100) - 6;

                                const width = 100 / group.length;
                                const left = index * width;

                                return (
                                <div
                                    key={event.id}
                                    className="absolute z-10 px-[3px]"
                                    style={{
                                    top: `${top}%`,
                                    height: `${height}%`,
                                    width: `${width}%`,
                                    left: `${left}%`,
                                    }}
                                    
                                >
                                    <CalendarEventCard
                                        event={event}
                                        onClick={() => onEventClick(event)}
                                        height={height}
                                        actions={actions}
                                        filter="day"
                                    />
                                </div>
                                );
                            })
                        )}
                    </div>
                    );
                })}
                </div>
            ))}
            </div>
        </div>
    );
}