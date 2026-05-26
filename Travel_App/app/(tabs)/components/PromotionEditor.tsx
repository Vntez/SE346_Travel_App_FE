import { formatDate, getTimeValue } from '@/app/service/PromotionShedule';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { showErrorAlert } from '@/components/app-alert';
import type { PromotionItem, Schedule } from '../types/promotion';
import { PromotionEditorStyles as styles } from './PromotionEditor.style';

type EditorData = {
  title: string;
  schedule: Schedule;
};

interface EditorProps {
  initialData?: Partial<PromotionItem> & { schedule?: Partial<Schedule> };
  onSave: (data: EditorData) => void;
  onCancel: () => void;
}

const todayString = () => formatDate(new Date());

const defaultSchedule = (): Schedule => ({
  startDate: todayString(),
  endDate: todayString(),
  days: ['M'],
  startTime: '8:00 AM',
  endTime: '5:00 PM',
  specificTime: false,
});

const days = [
  { value: 'M', label: 'T2' },
  { value: 'T', label: 'T3' },
  { value: 'W', label: 'T4' },
  { value: 'Th', label: 'T5' },
  { value: 'F', label: 'T6' },
  { value: 'Sa', label: 'T7' },
  { value: 'S', label: 'CN' },
];

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const PromotionEditor: React.FC<EditorProps> = ({ initialData, onSave, onCancel }) => {
  const schedule = useMemo(() => ({ ...defaultSchedule(), ...initialData?.schedule }), [initialData?.schedule]);
  const [title, setTitle] = useState(initialData?.title || '');
  const [startDate, setStartDate] = useState(schedule.startDate);
  const [endDate, setEndDate] = useState(schedule.endDate);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);
  const [selectedDays, setSelectedDays] = useState<string[]>(schedule.days || ['M']);
  const [specificTime, setSpecificTime] = useState(Boolean(schedule.specificTime));
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<'start' | 'end'>('start');
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<'start' | 'end'>('start');

  const isEditing = Boolean(initialData?.id);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const showDatePicker = (type: 'start' | 'end') => {
    setActiveDatePicker(type);
    setDatePickerVisible(true);
  };

  const showTimePicker = (type: 'start' | 'end') => {
    setActiveTimePicker(type);
    setTimePickerVisible(true);
  };

  const handleDateConfirm = (date: Date) => {
    const nextDate = formatDate(date);
    if (activeDatePicker === 'start') {
      setStartDate(nextDate);
      if (!endDate) setEndDate(nextDate);
    } else {
      setEndDate(nextDate);
    }
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (date: Date) => {
    const nextTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (activeTimePicker === 'start') {
      setStartTime(nextTime);
    } else {
      setEndTime(nextTime);
    }
    setTimePickerVisible(false);
  };

  const validate = () => {
    if (!title.trim()) {
      showErrorAlert('Vui lòng nhập tiêu đề ưu đãi.');
      return false;
    }

    if (!startDate || !endDate || selectedDays.length === 0) {
      showErrorAlert('Vui lòng chọn ngày bắt đầu, ngày kết thúc và ít nhất một ngày áp dụng.');
      return false;
    }

    const startD = parseDateString(startDate);
    const endD = parseDateString(endDate);
    if (!startD || !endD) {
      showErrorAlert('Ngày ưu đãi không hợp lệ.');
      return false;
    }

    if (startD.getTime() > endD.getTime()) {
      showErrorAlert('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
      return false;
    }

    if (specificTime) {
      if (!startTime || !endTime) {
        showErrorAlert('Vui lòng chọn giờ bắt đầu và giờ kết thúc.');
        return false;
      }

      if (getTimeValue(startTime) >= getTimeValue(endTime)) {
        showErrorAlert('Giờ bắt đầu phải trước giờ kết thúc.');
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      title: title.trim(),
      schedule: {
        startDate,
        endDate,
        days: selectedDays,
        startTime,
        endTime,
        specificTime,
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIcon}>
            <Ionicons name="pricetag-outline" size={20} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.headerEyebrow}>Ưu đãi</Text>
            <Text style={styles.title}>{isEditing ? 'Chỉnh sửa ưu đãi' : 'Tạo ưu đãi mới'}</Text>
          </View>
        </View>

        <Pressable style={styles.closeButton} onPress={onCancel}>
          <Ionicons name="close" size={20} color="#64748B" />
        </Pressable>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Giảm 20% cuối tuần"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
          multiline
        />
      </View>

      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <Text style={styles.label}>Bắt đầu</Text>
          <Pressable style={styles.dateInputBox} onPress={() => showDatePicker('start')}>
            <Text style={styles.dateText}>{startDate || 'Chọn ngày'}</Text>
            <Ionicons name="calendar-outline" size={17} color="#64748B" />
          </Pressable>
        </View>

        <View style={styles.dateField}>
          <Text style={styles.label}>Kết thúc</Text>
          <Pressable style={styles.dateInputBox} onPress={() => showDatePicker('end')}>
            <Text style={styles.dateText}>{endDate || 'Chọn ngày'}</Text>
            <Ionicons name="calendar-outline" size={17} color="#64748B" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.label}>Ngày áp dụng</Text>
      <View style={styles.daysRow}>
        {days.map((day) => {
          const active = selectedDays.includes(day.value);
          return (
            <Pressable
              key={day.value}
              style={[styles.dayCircle, active && styles.dayCircleActive]}
              onPress={() => toggleDay(day.value)}
            >
              <Text style={[styles.dayText, active && styles.dayTextActive]}>{day.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Thời gian</Text>
      <View style={styles.timeToggleContainer}>
        <Pressable
          style={[styles.timeToggleButton, !specificTime && styles.timeToggleButtonActive]}
          onPress={() => setSpecificTime(false)}
        >
          <Text style={[styles.timeToggleText, !specificTime && styles.timeToggleTextActive]}>Cả ngày</Text>
        </Pressable>

        <Pressable
          style={[styles.timeToggleButton, specificTime && styles.timeToggleButtonActive]}
          onPress={() => setSpecificTime(true)}
        >
          <Text style={[styles.timeToggleText, specificTime && styles.timeToggleTextActive]}>Theo giờ</Text>
        </Pressable>
      </View>

      {specificTime ? (
        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Giờ bắt đầu</Text>
            <Pressable style={styles.dateInputBox} onPress={() => showTimePicker('start')}>
              <Text style={styles.dateText}>{startTime}</Text>
              <Ionicons name="time-outline" size={17} color="#64748B" />
            </Pressable>
          </View>

          <View style={styles.dateField}>
            <Text style={styles.label}>Giờ kết thúc</Text>
            <Pressable style={styles.dateInputBox} onPress={() => showTimePicker('end')}>
              <Text style={styles.dateText}>{endTime}</Text>
              <Ionicons name="time-outline" size={17} color="#64748B" />
            </Pressable>
          </View>
        </View>
      ) : null}

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{isEditing ? 'Lưu ưu đãi' : 'Tạo ưu đãi'}</Text>
        <Ionicons name="checkmark" size={19} color="#FFFFFF" />
      </Pressable>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={timePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
        is24Hour={false}
      />
    </View>
  );
};

export default PromotionEditor;
