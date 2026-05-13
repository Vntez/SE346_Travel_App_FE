export interface Schedule {
  startDate: string;    // Ví dụ: Oct 30, 2024
  endDate: string;      // Ví dụ: Oct 30, 2024
  days: string[];       // Ví dụ: ['M', 'T', 'W', 'T', 'F']
  startTime: string;    // Ví dụ: '11:00 AM'
  endTime: string;      // Ví dụ: '01:00 PM'
  specificTime: boolean; // true: khung giờ cụ thể, false: cả ngày
}

export interface PromotionItem {
  id: string;
  title: string;        // Thay cho title để rõ nghĩa hơn
  isActive: boolean;
  schedule: Schedule;   // Chứa toàn bộ thông tin thời gian
}

