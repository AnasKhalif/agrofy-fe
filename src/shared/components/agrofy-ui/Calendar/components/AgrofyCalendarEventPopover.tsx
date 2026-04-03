import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/agrofy-ui/ui/avatar';
import { getSessionStatusLabel, SessionStatus } from '@/app/api/clinic_schedule';
import { Badge } from '@/shared/components/agrofy-ui';
// import { CalendarAction } from '../AgrofyCalendar.types';
import { AgrofyCalendarActions } from './AgrofyCalendarAction';
import { useState } from 'react';

interface Props {
  anchorRect: DOMRect;
  event: CalendarEvent;
  actionsPopOver?: (Event: CalendarEvent) => CalendarAction[];
  actionValue: boolean;
}

export function AgrofyCalendarEventPopover({
  anchorRect,
  event,
  actionsPopOver,
  actionValue,
}: Props) {
  const POPOVER_WIDTH = 260;
  const GAP = 8;

  const [showActions, setShowActions] = useState(actionValue);
  
  const viewportWidth = window.innerWidth;

  const showOnRight =
    anchorRect.right + GAP + POPOVER_WIDTH <= viewportWidth;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: anchorRect.top,
    left: showOnRight
      ? anchorRect.right + GAP
      : anchorRect.left - POPOVER_WIDTH - GAP,
    width: POPOVER_WIDTH,
    zIndex: 9999,
  };

  if (!Array.isArray(event.items) || event.items.length === 0) {
    return null;
  }

  let variant = 'blue';
    if (event.status_transaction === 'arrived') variant = 'arrived';
    if (event.status_transaction === 'cancelled') variant = 'red';
    if (event.status_transaction === 'scheduled') variant = 'scheduled';
    if (event.status_transaction === 'rescheduled') variant = 'rescheduled';
    if (event.status_transaction === 'in_progress') variant = 'in_progress';
    if (event.status_transaction === 'paid') variant = 'paid';

  return createPortal(
    <div
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        setShowActions(true);
      }}
      onMouseLeave={() => setShowActions(false)}
      style={style}
      className="
        bg-white
        border
        rounded-md
        shadow-lg
        p-3
        text-sm
      "
    >
        <div className='flex justify-center'>
            <Badge variant={variant}>{getSessionStatusLabel(event.status_transaction as SessionStatus)}</Badge>
        </div>
        <div className="flex text-xs font-medium leading-tight truncate justify-between mb-4 pr-2">
          <div className="flex items-center gap-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.photo_patient} alt={event.title} />
                <AvatarFallback>
                  {event.title?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            <div>
              <div className="text-sm font-medium text-gray-900">{event.patient_name}</div>
              <div className="text-xs text-gray-500">Dr.{event.doctor_name}</div>

            </div>
          </div>
        </div>

      <div className="text-xs text-gray-600">
        {dayjs(event.start).format('HH:mm')} –{' '}
        {dayjs(event.end).format('HH:mm')}
      </div>

      {event.items?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {event.items.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-black"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
        {actionsPopOver && (
            <div
            className="
                absolute top-1 right-1
                z-20
            "
            onClick={e => e.stopPropagation()}
            >
            <AgrofyCalendarActions
                event={event}
                actions={actionsPopOver}
                actionValue={showActions}
            />
            </div>
        )}
    </div>,
    document.body
  );
}
