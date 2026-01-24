import dayjs from 'dayjs';
import { CalendarEvent } from './AgrofyCalendar.types';

export function getOverlappingEvents(events: CalendarEvent[]) {
  const sorted = [...events].sort(
    (a, b) => dayjs(a.start).unix() - dayjs(b.start).unix()
  );

  const groups: CalendarEvent[][] = [];

  sorted.forEach(event => {
    let placed = false;

    for (const group of groups) {
      const overlaps = group.some(e =>
        dayjs(event.start).isBefore(e.end) &&
        dayjs(event.end).isAfter(e.start)
      );

      if (overlaps) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([event]);
    }
  });

  return groups;
}
