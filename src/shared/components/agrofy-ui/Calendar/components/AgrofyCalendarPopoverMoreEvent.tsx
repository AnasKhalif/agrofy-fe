import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { CalendarEvent,CalendarAction } from '../AgrofyCalendar.types';
import { CalendarEventCard } from './AgrofyCalendarEventCard';

interface Props {
  anchorRect: DOMRect;
  date: dayjs.Dayjs;
    events: CalendarEvent[];
    onClose: () => void;
    onEventClick: (event: CalendarEvent) => void;
  actions?: (event: CalendarEvent) => CalendarAction[];
}

export function AgrofyCalendarPopoverMoreEvent({
  anchorRect,
  date,
  events,
  onClose,
  onEventClick,
  actions,
}: Props) {
    const EVENT_HEIGHT = 56;
    const MAX_VISIBLE_EVENTS = 3;
    const MAX_HEIGHT = EVENT_HEIGHT * MAX_VISIBLE_EVENTS;

    const viewportHeight = window.innerHeight;

    const estimatedHeight =
    40 + Math.min(events.length, MAX_VISIBLE_EVENTS) * EVENT_HEIGHT;

    const willOverflowBottom =
    anchorRect.bottom + estimatedHeight + 12 > viewportHeight;

    const style: React.CSSProperties = {
    position: 'fixed',
    top: willOverflowBottom
        ? anchorRect.top - estimatedHeight - 6
        : anchorRect.bottom + 6,
    left: anchorRect.left,
    width: 300,
    zIndex: 9999,
    };

    return createPortal(
    <div style={style} className="bg-white border rounded-md shadow-lg p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">
            {date.format('dddd, DD MMM YYYY')}
        </div>
        <button
            className="text-xs text-gray-500"
            onClick={onClose}
        >
            ✕
        </button>
        </div>

        {/* Event List */}
        <div
        className="space-y-1 overflow-y-auto"
        style={{ maxHeight: MAX_HEIGHT }}
        >
        {events.map(event => (
            <CalendarEventCard
            key={event.id}
            event={event}
            filter="month"
            onClick={() => {
                onClose();
                onEventClick(event);
            }}
            actions={actions}
            />
        ))}
        </div>
    </div>,
    document.body
    );
}
