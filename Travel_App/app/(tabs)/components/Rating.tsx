import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MAIN_COLOR = '#00AEEF'; // Màu xanh bạn yêu cầu
const BACKGROUND_COLOR = '#E0F0F7'; // Màu xanh nhạt cho nền thanh

export const RatingStartBar = ({ ratingValue, size }: { ratingValue: number; size: number }) => {
  return (
    <View style={{ flexDirection: 'row', marginLeft: 5 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let iconName: any = "star-outline";

        // 0.8 - 1.0 : 1 sao
        // 0.4 - 0.7 : nửa sao
        if (ratingValue >= star - 0.2) {
          iconName = "star";
        } else if (ratingValue >= star - 0.6) {
          iconName = "star-half";
        }

        return (
          <Ionicons
            key={star}
            name={iconName}
            size={size}
            color='#FFD700'
          />
        );
      })}
    </View>
  );
};

export const RatingBar = ({ stars, percentage }: { stars: number, percentage: number }) => {
  return (
    <View style={ratingBarStyles.barRowContainer}>
      <View style={ratingBarStyles.starContainer}>
        <Text style={ratingBarStyles.starText}>{stars}</Text>
      </View>

      <View style={ratingBarStyles.progressTrack}>
        <View 
          style={[
            ratingBarStyles.progressFilled, 
            { width: `${percentage}%` } // Chiều rộng tương ứng %
          ]} 
        />
      </View>

      <View style={ratingBarStyles.percentageContainer}>
        <Text style={ratingBarStyles.percentageText}>{percentage}%</Text>
      </View>
    </View>
  );
};

export const ratingBarStyles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    padding: 20, // Tạo khoảng cách lề trong
    //backgroundColor: '#fff',
    borderRadius: 20, // Bo tròn các góc lớn bên ngoài (theo hình ảnh)
    shadowColor: '#000', // Đổ bóng nhẹ cho chuyên nghiệp
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3, // Cho Android
  },
  barRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2, // Khoảng cách giữa các thanh
  },
  starContainer: {
    width: 20,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  starText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BACKGROUND_COLOR, // Số sao bên trái màu đen
  },
  progressTrack: {
    flex: 1, // Để thanh chiếm hết không gian còn lại ở giữa
    height: 12,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 6,
    overflow: 'hidden', // Quan trọng: để phần filled không tràn ra lề bo tròn
    marginRight: 15,
  },
  progressFilled: {
    height: '100%',
    backgroundColor: MAIN_COLOR,
    borderRadius: 6,
  },
  percentageContainer: {
    width: 25, // Giới hạn chiều rộng cố định để các số % căn thẳng hàng
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    color: BACKGROUND_COLOR, // Phần trăm bên phải màu đen
  },
});

export const calculateRatingStats = (data: any[]) => {
  const totalReviews = data.length;
  
  // Bước 1: Khởi tạo bộ đếm cho từng mức sao từ 1 đến 5
  const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Bước 2: Duyệt qua dữ liệu và đếm
  data.forEach(item => {
    if (counts[item.Rate] !== undefined) {
        counts[item.Rate]++;
    }
  });

  // Bước 3: Chuyển đổi thành mảng phần trăm theo thứ tự từ 5 sao -> 1 sao
  const stats = [5, 4, 3, 2, 1].map(star => {
    const count = counts[star];
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    return {
      stars: star,
      // Math.round để ra con số nguyên đẹp cho thanh tiến trình
      percentage: Math.round(percentage) 
    };
  });

  return stats;
};