import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type AppAlertType = 'success' | 'error' | 'warning' | 'info';

type AppAlertAction = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AppAlertOptions = {
  title: string;
  message?: string;
  type?: AppAlertType;
  actions?: AppAlertAction[];
};

type AlertListener = (options: AppAlertOptions) => void;

const listeners = new Set<AlertListener>();

const apiErrorMessages: Record<string, string> = {
  EMAIL_TAKEN: 'Email đã được sử dụng.',
  'Email da duoc su dung': 'Email đã được sử dụng.',
  'Email hoac mat khau khong dung': 'Email hoặc mật khẩu không đúng.',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  'Mat khau phai co it nhat 8 ky tu': 'Mật khẩu phải có ít nhất 8 ký tự.',
  'Mat khau xac nhan khong khop': 'Mật khẩu xác nhận không khớp.',
  'Nhap email truoc khi dat lai mat khau': 'Nhập email trước khi đặt lại mật khẩu.',
  NOT_CONFIGURED: 'Tính năng này chưa được cấu hình trên máy chủ.',
  STORAGE_UNAVAILABLE: 'Kho lưu trữ ảnh chưa sẵn sàng.',
  USERNAME_TAKEN: 'Tên người dùng đã được sử dụng.',
  'Username da duoc su dung': 'Tên người dùng đã được sử dụng.',
  'Vui long dong y dieu khoan su dung': 'Vui lòng đồng ý với điều khoản sử dụng.',
  'Vui long nhap email va mat khau': 'Vui lòng nhập email và mật khẩu.',
};

const alertTheme = {
  success: {
    color: '#0F9F6E',
    background: '#E8F8F1',
    icon: 'checkmark-circle' as const,
  },
  error: {
    color: '#D92D20',
    background: '#FEF3F2',
    icon: 'alert-circle' as const,
  },
  warning: {
    color: '#B54708',
    background: '#FFFAEB',
    icon: 'warning' as const,
  },
  info: {
    color: '#0EA5E9',
    background: '#EAF6FF',
    icon: 'information-circle' as const,
  },
};

export function getFriendlyMessage(message?: string): string {
  if (!message) {
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }

  const normalized = message.trim();
  if (apiErrorMessages[normalized]) {
    return apiErrorMessages[normalized];
  }

  if (normalized.includes('NOT_CONFIGURED')) {
    return apiErrorMessages.NOT_CONFIGURED;
  }
  if (normalized.toLowerCase().includes('network error')) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng hoặc địa chỉ API.';
  }
  if (normalized.toLowerCase().includes('timeout')) {
    return 'Kết nối tới máy chủ quá thời gian chờ. Vui lòng thử lại.';
  }
  if (normalized === 'Something went wrong') {
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }

  return normalized;
}

export function showAppAlert(options: AppAlertOptions) {
  listeners.forEach((listener) => listener(options));
}

export function showErrorAlert(message?: string, title = 'Lỗi') {
  showAppAlert({
    title,
    message: getFriendlyMessage(message),
    type: 'error',
  });
}

export function showSuccessAlert(message: string, title = 'Thành công', actions?: AppAlertAction[]) {
  showAppAlert({
    title,
    message,
    type: 'success',
    actions,
  });
}

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AppAlertOptions | null>(null);

  useEffect(() => {
    const listener: AlertListener = (options) => {
      setAlert({
        type: 'info',
        ...options,
      });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const config = useMemo(() => alertTheme[alert?.type ?? 'info'], [alert?.type]);
  const actions = alert?.actions?.length ? alert.actions : [{ text: 'OK' }];
  const shouldScrollMessage = (alert?.message?.length ?? 0) > 220;

  const closeWithAction = (action?: AppAlertAction) => {
    setAlert(null);
    setTimeout(() => action?.onPress?.(), 120);
  };

  return (
    <>
      {children}
      <Modal transparent visible={Boolean(alert)} animationType="fade" statusBarTranslucent>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: config.background }]}>
              <Ionicons name={config.icon} size={30} color={config.color} />
            </View>

            <Text style={styles.title}>{alert?.title}</Text>

            {alert?.message && shouldScrollMessage ? (
              <ScrollView style={styles.messageScroll} contentContainerStyle={styles.messageContent}>
                <Text style={styles.message}>{alert.message}</Text>
              </ScrollView>
            ) : null}

            {alert?.message && !shouldScrollMessage ? (
              <View style={styles.messageContent}>
                <Text style={styles.message}>{alert.message}</Text>
              </View>
            ) : null}

            <View style={styles.actions}>
              {actions.map((action, index) => {
                const isSecondary = action.style === 'cancel';
                const isDestructive = action.style === 'destructive';
                const buttonColor = isDestructive ? alertTheme.error.color : config.color;

                return (
                  <Pressable
                    key={`${action.text}-${index}`}
                    style={[
                      styles.button,
                      isSecondary ? styles.secondaryButton : { backgroundColor: buttonColor },
                    ]}
                    onPress={() => closeWithAction(action)}
                  >
                    <Text style={[styles.buttonText, isSecondary && { color: '#344054' }]}>
                      {action.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  iconWrap: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    marginBottom: 14,
  },
  title: {
    color: '#101828',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageScroll: {
    width: '100%',
    maxHeight: 260,
  },
  messageContent: {
    width: '100%',
    paddingHorizontal: 4,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  message: {
    color: '#475467',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  secondaryButton: {
    backgroundColor: '#F2F4F7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
