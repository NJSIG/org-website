import { EventsCalendarHeaderCellProps } from '../../types';

export const CalendarHeaderCell: React.FC<EventsCalendarHeaderCellProps> = ({ label }) => {
  return (
    <div className="h-16 max-w-16 flex items-center justify-center p-2" aria-label={label.long}>
      <span className="text-lg font-bold text-foreground">{label.short}</span>
    </div>
  );
};
