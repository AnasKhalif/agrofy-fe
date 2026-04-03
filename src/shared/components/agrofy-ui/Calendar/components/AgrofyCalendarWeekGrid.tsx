import dayjs from 'dayjs';
import { CalendarEventCard } from './AgrofyCalendarEventCard';
import { getOverlappingEvents } from '../AgrofyCalendar.utils';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';
import { useState } from 'react';
import { AgrofyCalendarPopoverMoreEvent } from './AgrofyCalendarPopoverMoreEvent';

interface Props {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    actions?: (event: CalendarEvent) => CalendarAction[];
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07–18
const HOUR_HEIGHT = 120;

export function WeekGrid({ date, events, onEventClick, actions }: Props) {
    // Pindahkan state ke dalam fungsi komponen
    const [popoverDay, setPopoverDay] = useState<dayjs.Dayjs | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);

    const start = dayjs(date).startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));

    const time = (n: number) => (n >= 12 ? 'pm' : 'am');

    const handleMoreClick = (e: React.MouseEvent<HTMLDivElement>, day: dayjs.Dayjs, hourEvents: CalendarEvent[]) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setAnchorRect(rect);
        setPopoverDay(day);
        setPopoverEvents(hourEvents);
    };

    return (
        <div className="border overflow-auto">
            {/* HEADER */}
            <div
                className="grid sticky top-0 bg-white z-10"
                style={{
                    gridTemplateColumns: `80px repeat(7, 250px)`,
                }}
            >
                <div className="border-r p-3 text-xs font-medium text-center text-black">
                    GMT<br />+07:00
                </div>

                {days.map(day => (
                    <div
                        key={day.toString()}
                        className="border-r p-3 text-sm font-medium text-center text-black"
                    >
                        {day.format('ddd DD')}
                    </div>
                ))}
            </div>

            {/* BODY */}
            {HOURS.map(hour => (
                <div
                    key={hour}
                    className="grid border-t"
                    style={{
                        gridTemplateColumns: `80px repeat(7, 250px)`,
                        height: HOUR_HEIGHT,
                    }}
                >
                    {/* TIME */}
                    <div className="border-r text-xs font-medium text-center pt-2 text-black">
                        {hour}{time(hour)}
                    </div>

                    {/* DAY COLUMNS */}
                    {days.map(day => {
                        const hourEvents = events.filter(e =>
                            dayjs(e.start).isSame(day, 'day') &&
                            dayjs(e.start).hour() === hour
                        );

                        // Tentukan event mana yang akan ditampilkan dan mana yang akan disembunyikan
                        const MAX_VISIBLE_EVENTS = 2;
                        const visibleEvents = hourEvents.slice(0, MAX_VISIBLE_EVENTS);
                        const hiddenEventsCount = hourEvents.length - MAX_VISIBLE_EVENTS;
                        const overlapGroups = getOverlappingEvents(hourEvents);

                        return (
                            <div
                                key={day.toString()}
                                className="border-r relative"
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

                                {/* EVENTS */}
                                {overlapGroups.map(group =>
                                    group.map((event) => {
                                        // Hanya render event jika termasuk dalam daftar `visibleEvents`
                                        if (!visibleEvents.some(e => e.id === event.id)) {
                                            return null;
                                        }

                                        const start = dayjs(event.start);
                                        const end = dayjs(event.end);
                                        const top = (start.minute() / 60) * 100;
                                        const height = (end.diff(start, 'minute') / 60) * 100;
                                        const width = 100 / (group.length > 2 ? 2 : group.length);
                                        const left = group.indexOf(event) * width;

                                        return (
                                            <div
                                                key={event.id}
                                                className="absolute z-10 px-[1px]"
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
                                                    filter={'week'}
                                                    width={width}
                                                    actions={actions}
                                                />
                                            </div>
                                        );
                                    })
                                )}

                                {/* "+X more" LINK */}
                                {hiddenEventsCount > 0 && (
                                    <div
                                        className="
                                            absolute bottom-1 right-1
                                            text-[10px]
                                            text-gray-600
                                            bg-gray-100
                                            rounded
                                            px-2 py-0.5
                                            cursor-pointer
                                            hover:bg-gray-200
                                            z-20
                                        "
                                        onClick={(e) => handleMoreClick(e, day, hourEvents)}
                                    >
                                        +{hiddenEventsCount} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* POPOVER FOR MORE EVENTS */}
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