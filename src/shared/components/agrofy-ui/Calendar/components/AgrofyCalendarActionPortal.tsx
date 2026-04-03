import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { CalendarAction, CalendarEvent } from '../AgrofyCalendar.types';

// Tambahkan batasan (constraint) pada generic T agar lebih aman secara tipe
interface Props<T extends CalendarEvent> {
  anchorRect: DOMRect;
  event: T;
  actions: (event: CalendarEvent) => CalendarAction[];
  onClose: () => void;
}

export function AgrofyCalendarActionPortal<T extends CalendarEvent>({
  anchorRect,
  event,
  actions,
  onClose,
}: Props<T>) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (!ref.current?.contains(e.target as Node)) {
        onClose();
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const ACTION_HEIGHT = 40;
    const MENU_PADDING = 2;
    const MENU_WIDTH = 224;

    const eventActions = actions(event);

    const menuHeight = eventActions.length * ACTION_HEIGHT + MENU_PADDING;
    const viewportHeight = window.innerHeight;

    const willOverflowBottom =
    anchorRect.bottom + menuHeight + 8 > viewportHeight;

    const style: React.CSSProperties = {
    position: 'fixed',
    top: willOverflowBottom
        ? anchorRect.top - menuHeight
        : anchorRect.bottom + 4,
    left: anchorRect.right - MENU_WIDTH,
    width: MENU_WIDTH,
    zIndex: 9999,
    };

    return createPortal(
        <div
            ref={ref}
            style={style}
            className="bg-white border rounded-md shadow-md text-black"
        >
            {eventActions.map((action, idx) => {
            const disabled =
                typeof action.disabled === 'function'
                ? action.disabled(event)
                : action.disabled;

            return (
                <button
                key={idx}
                disabled={disabled}
                onClick={() => {
                    onClose();
                    action.onClick(event);
                }}
                className={`
                    w-full text-left px-4 py-2 text-sm
                    hover:bg-gray-100
                    ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}
                    ${
                    action.confirmationType === 'danger'
                        ? 'text-red-600'
                        : ''
                    }
                `}
                >
                {action.label}
                </button>
            );
            })}
        </div>,
        document.body
    );
}