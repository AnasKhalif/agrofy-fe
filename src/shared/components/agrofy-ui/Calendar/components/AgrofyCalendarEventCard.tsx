// CalendarEventCard.tsx
// import dayjs from 'dayjs';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';
import { AgrofyCalendarActions } from './AgrofyCalendarAction';
import { Badge } from '@/shared/components/agrofy-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/agrofy-ui/ui/avatar';
import { getSessionStatusLabel, SessionStatus } from '@/app/api/clinic_schedule';
import { AgrofyCalendarEventPopover } from './AgrofyCalendarEventPopover';
import { useRef, useState } from 'react';

interface Props {
  event: CalendarEvent;
  actions?: (Event: CalendarEvent) => CalendarAction[];
  onClick?: () => void;
  height? : number;
  width? : number;
  filter : 'day' | 'week' | 'month';
}

export function CalendarEventCard({
  event,
  actions,
  onClick,
  height,
  width,
  filter
}: Props) {

  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  let variant = 'blue';
    if (event.status_transaction === 'arrived') variant = 'arrived';
    if (event.status_transaction === 'cancelled') variant = 'red';
    if (event.status_transaction === 'scheduled') variant = 'scheduled';
    if (event.status_transaction === 'rescheduled') variant = 'rescheduled';
    if (event.status_transaction === 'in_progress') variant = 'in_progress';
    if (event.status_transaction === 'paid') variant = 'paid';

  let bgEvent = '#E3EEFD';
    if (event.status_transaction === 'arrived') bgEvent = '#FAF4D5';
    if (event.status_transaction === 'cancelled') bgEvent = 'red';
    if (event.status_transaction === 'scheduled') bgEvent = '#F9F7D6';
    if (event.status_transaction === 'rescheduled') bgEvent = '#EDE1FC';
    if (event.status_transaction === 'in_progress_consultation') bgEvent = '#E3EEFD';
    if (event.status_transaction === 'in_progress') bgEvent = '#E3EEFD';
    if (event.status_transaction === 'paid') bgEvent = '#E1FFFA';
  
  const MAX_BADGES = 3;
  const isMonth = filter === 'month';
  const isCompactView = (width as number) <= 50;

  const splitBadges = (items: string[] = []) => {
    const visible = items.slice(0, MAX_BADGES);
    const remaining = items.length - visible.length;
    return { visible, remaining };
  };

  const { visible, remaining } = splitBadges(event.items);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setShowActions(false);
      }}
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        setShowActions(true);
      }}
      style={{backgroundColor: bgEvent}}
      className={`
        group relative h-full w-full
        rounded-md
        text-black
        cursor-pointer
        overflow-visible
        hover:brightness-95
      `}
    >
      <div className={`relative z-10 ${isCompactView ? 'p-1' : 'p-2'}`}>

        {isCompactView ? (
          <div className="flex flex-col items-center py-2 px-2">
            <div className="text-xs font-medium text-gray-900 text-center truncate w-full">
              {event.patient_name}
            </div>
            <Badge
              variant={variant}
              className="flex text-[10px] px-1.5 py-0.5 w-full justify-center !text-center truncate !border-[#5D87FF1A]"
            >
              {getSessionStatusLabel(
                event.status_transaction as SessionStatus
              )}
            </Badge>
          </div>
        ) : (
          <>
            {/* MONTH VIEW (MINIMAL) */}
            {isMonth ? (
              <div className="flex items-center justify-between gap-1">
                <div className="text-xs font-medium text-gray-900 truncate">
                  {event.patient_name}
                </div>

                <Badge
                  variant={variant}
                  className="text-[10px] px-1.5 py-0.5 text-right !border-[#5D87FF1A]"
                >
                  {getSessionStatusLabel(
                    event.status_transaction as SessionStatus
                  )}
                </Badge>
              </div>
            ) : (
              <>

                {/* TITLE */}
                <div className={`flex text-xs items-start font-medium justify-between px-3 
                  ${(height as number > 69) ? 'py-2' : 'py-0 mb-1'}`
                }>
                  <div className={`flex items-center gap-2 truncate`}>
                    {(height as number) > 44 && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={event.photo_patient} alt={event.title} />
                        <AvatarFallback>
                          {event.title?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.patient_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Dr.{event.doctor_name}
                      </div>
                    </div>
                  </div>

                  <div className="px-1.5 pt-0.5">
                    <Badge variant={variant} className='truncate !border-[#5D87FF1A]'>
                      {getSessionStatusLabel(
                        event.status_transaction as SessionStatus
                      )}
                    </Badge>
                  </div>
                </div>

                {/* ITEM BADGES */}
                {visible.length > 0 && (height as number) > 44 && (
                  <div className="flex flex-wrap gap-1 px-3">
                    {visible.map((item, idx) => (
                      <Badge
                        key={idx}
                        // variant="gray"
                        className='text-[10px] text-bold px-2 py-0.5 !bg-white !text-black !border-gray-200'
                      >
                        {item}
                      </Badge>
                    ))}

                    {remaining > 0 && (
                      <Badge
                        variant="gray"
                        className="text-[10px] px-2 py-0.5 text-gray-600"
                      >
                        +{remaining}
                      </Badge>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {hover && ref.current && (
        <AgrofyCalendarEventPopover
          anchorRect={ref.current.getBoundingClientRect()}
          event={event}
          actionsPopOver={actions}
          actionValue={showActions}
        />
      )}

      {/* ACTIONS */}
      {actions && (
        <div
          className={`
              absolute top-0 right-1 pr-1
              ${height as number > 69 ? 'pt-3 pr-1' : 'pt-1 pr-1'}
              z-20
            `}
          onClick={e => {
            e.stopPropagation();
            setShowActions(true);
          }}
        >
            <AgrofyCalendarActions
              event={event}
              actions={actions}
              actionValue={showActions}
            />
        </div>
      )}
    </div>
  );
}