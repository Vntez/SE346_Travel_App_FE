
export const getScheduleString = (schedule: Schedule): string => {
  const { startDate, endDate, days, startTime, endTime, specificTime } = schedule;
  
  // Map chữ cái viết tắt sang tên đầy đủ (tùy chọn)
  const dayMap: { [key: string]: string } = { 
    'M': 'Mon', 
    'T': 'Tue',
    'W': 'Wed', 
    'Th': 'Thu',
    'F': 'Fri', 
    'Sa': 'Sat',
    'S': 'Sun' 
  };
  
  // Lưu ý: Trong logic thực tế, bạn cần phân biệt T (Tue/Thu) và S (Sat/Sun) 
  // bằng cách lưu Index (0-6) thay vì chữ cái nếu muốn chính xác tuyệt đối.
  const daysText = days.map(day => dayMap[day]).join(', ');
  
  const timeText = specificTime ? `${startTime} - ${endTime}` : 'All day';

  return `Promotion valid from ${startDate} to ${endDate} on ${daysText} at ${timeText}`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Hàm chuyển đổi chuỗi "HH:mm AM/PM" thành giá trị số để so sánh
export const getTimeValue = (timeStr: string) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes; // Trả về tổng số phút trong ngày
};