import { Schedule } from '../(tabs)/types/promotion';

export const getScheduleString = (schedule: Schedule): string => {
  const { startDate, endDate, days, startTime, endTime, specificTime } = schedule;

  const dayMap: Record<string, string> = {
    M: 'Thứ 2',
    T: 'Thứ 3',
    W: 'Thứ 4',
    Th: 'Thứ 5',
    F: 'Thứ 6',
    Sa: 'Thứ 7',
    S: 'Chủ nhật',
  };

  const daysText = days.length ? days.map((day) => dayMap[day] ?? day).join(', ') : 'chưa chọn ngày';
  const timeText = specificTime ? `${startTime} - ${endTime}` : 'cả ngày';

  return `Áp dụng từ ${startDate || 'ngày bắt đầu'} đến ${endDate || 'ngày kết thúc'}, vào ${daysText}, thời gian ${timeText}.`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getTimeValue = (timeStr: string) => {
  if (!timeStr) return 0;

  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
