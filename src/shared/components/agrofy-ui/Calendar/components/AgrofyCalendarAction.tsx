import { useRef, useState } from 'react';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';
import { AgrofyCalendarActionPortal } from './AgrofyCalendarActionPortal';

interface Props {
  event: CalendarEvent;
  actions: (Event: CalendarEvent) => CalendarAction[];
  actionValue: boolean;
}

export function AgrofyCalendarActions({
  event,
  actions,
  actionValue,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(actionValue);

  return (
    <>
      <button
        ref={ref}
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="p-1 rounded"
      >
        ⋮
      </button>

      {(open || actionValue === true) && ref.current && (
        <AgrofyCalendarActionPortal
          anchorRect={ref.current.getBoundingClientRect()}
          event={event}
          actions={actions}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
