import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string; // Dấu ? nghĩa là không bắt buộc phải có
  children: ReactNode; // Cho phép truyền Text, View hoặc bất cứ gì vào giữa thẻ
}

const SimpleModal = ({ visible, onClose, title, children } : Props) => {
  if (!visible) return null;

  return (
    <View style={modalStyles.container}>
      {/* Lớp nền mờ */}
      <TouchableOpacity 
        style={modalStyles.overlay} 
        activeOpacity={1} 
        onPress={onClose} 
      />

      {/* Nội dung Modal */}
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.title}>{title}</Text>
        
        <View style={modalStyles.content}>
          {children}
        </View>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={{ }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Đổ bóng cho Android
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
  },
});

export default SimpleModal;