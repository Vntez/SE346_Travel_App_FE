import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PromotionData } from "../MOCK_DATA/promotion";
import { colors } from '../common/colors';
import PromotionCard from "../components/PromotionCard";
import PromotionEditor from '../components/PromotionEditor';
import { styles } from './AdLocationScreen.style';
import { formatDate } from '@/app/service/PromotionShedule';

const AddLocationScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Restaurant');
  const [isAdding, setIsAdding] = useState(false);
  const [promotions, setPromotions] = useState(PromotionData);
  const [editingId, setEditingId] = useState<string | null>(null);

   const [preview, setPreview] = useState<string>(''); // Lưu link để hiển thị tạm // data URL

  const handleToggle = (id: string) => {
    setPromotions(prevPromos => 
      prevPromos.map(promo => 
        promo.id === id 
          ? { 
              ...promo, 
              isActive: !promo.isActive, 
              status: !promo.isActive ? 'Active' : 'Inactive'
            } 
          : promo
      )
    );
  };

  const handleSave = (id: string | null, newData: any) => {
    if (id) {
      //Update
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...newData } : p));
      setEditingId(null);
    } else {
      //Add
      const newPromo = { 
        id: Date.now().toString(), 
        ...newData,
        isActive: true 
      };
      setPromotions([newPromo, ...promotions]);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    const updatedPromos = promotions.filter(item => item.id !== id);
    setPromotions(updatedPromos);
  };


 const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chọn ảnh
      allowsEditing: true, // Cho phép crop/xoay
      aspect: [16, 9], // Tỉ lệ khung hình (phù hợp cho panorama/cover)
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      // Nếu bạn có state formData tổng:
      // setFormData({ ...formData, image: uri }); 
      console.log("Image URI:", uri);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Location</Text>
        <TouchableOpacity>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Policy Reminder */}
        <View style={styles.alertContainer}>
          <Ionicons name="warning" size={20} color={colors.warning} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Policy Reminder</Text>
            <Text style={styles.alertText}>
              We have a strict 2-strike policy for verified information. Ensure all details are accurate.
            </Text>
          </View>
        </View>

        {/* Basic Information Section */}
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Place Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. The Grand View Hotel"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {['Restaurant', 'Hotel', 'Attraction', 'Cafe'].map((cat) => (
              <TouchableOpacity 
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, activeCategory === cat && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                  {cat === 'Restaurant' && '+ '} {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Tell visitors what makes this place special..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Location & Media Section */}
        <Text style={styles.sectionTitle}>Location & Media</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Pin Location</Text>
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT5oVzTfOwQWzcT6Atu7B0q--_Q46lzBnpoi5Ynl6t-jFeH_G0ddDJ2l3wkMx7ijFvl1pBfPloXeD3wytn487HTubcPPtWVbVWWuQ-2D9jjeeXK0dKYbyaevqcVY7kQUnaehCgek8p8BWfaGgYFfvwLvOEB5QeGLNemG6C-1uF3R7ApCE7cnP24Sdeb1Q34QTWc8DYR62RqIUpy6JVYpaFRVghXmCEopKS14rWn3x7KPZxnFl9mhPa4lCdGMLvf7rM3vlasLaSoo_c' }} 
              style={styles.mapImage} 
            />
            <TouchableOpacity style={styles.setPinButton}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 4 }}>Set Pin</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonText}>Save & Publish Location </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.uploadBox, { marginTop: 20 }]}
            onPress={() => handleImageChange()}
          >
            <View style={{ backgroundColor: colors.primaryLight, padding: 10, borderRadius: 30, marginBottom: 8 }}>
              <Ionicons name="cloud-upload" size={24} color={colors.primary} />
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Tap to upload panorama</Text>
            <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Supports JPG, PNG (Max 10MB)</Text>
          </TouchableOpacity>
        </View>

        {/* Current Promotions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Current Promotions</Text>
          {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="add-circle" size={18} color={colors.primary} />
            <Text style={[styles.linkText, { marginLeft: 4, fontWeight: 'bold' }]}>Add Deal</Text>
          </TouchableOpacity> */}
        </View>

        {/* Danh sách Promotions */}
        {promotions.map((item) => (
          editingId === item.id ? (
            <PromotionEditor 
              key={item.id}
              initialData={item}
              onSave={(data) => handleSave(item.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <PromotionCard 
              key={item.id} 
              item={item} 
              onToggle={handleToggle}
              onEdit={() => {setEditingId(item.id); setIsAdding(false);}} // Truyền thêm prop onEdit vào PromotionCard
              onDelete={() => handleDelete(item.id)}
            />
          )
        ))}

        {/* Seasonal CTA */}
        {!isAdding &&<View style={[styles.uploadBox, { padding: 16, borderStyle: 'dashed' }]}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Want to boost visitors?</Text>
          <TouchableOpacity onPress={() => {
            setIsAdding(true);
            setEditingId(null);
          }}>
            <Text style={[styles.linkText, { fontWeight: 'bold' }]}>Create a seasonal offer</Text>
          </TouchableOpacity>
        </View>
        }

        {/* 3. Hiển thị việc tạo mới nếu isAdding = true */}
        {isAdding && (
          <View style={{}}>
            <PromotionEditor 
              initialData={{ 
                title: '',
                schedule: {
                  startDate: formatDate(new Date()),
                  endDate: formatDate(new Date()),
                  days: ['M'],
                  startTime: '8:00 AM',
                  endTime: '5:00 PM',
                }
              }}
              onSave={(data) => handleSave(null, data)}
              onCancel={() => setIsAdding(false)}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default AddLocationScreen;