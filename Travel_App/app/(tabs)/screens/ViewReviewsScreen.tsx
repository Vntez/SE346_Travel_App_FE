import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../common/colors';
import { calculateRatingStats, RatingBar, ratingBarStyles, RatingStartBar } from '../components/Rating';
import { PicturesContainer } from '../components/ReviewPicture';
import { ReviewData } from '../MOCK_DATA/Review';
import styles from './ViewReviewsScreen.styles';

export default function ViewReviewsScreen({ navigation }: any) {
  const [reviewText, setReviewText] = useState('');

  const ReviewItem = ({ item }: { item: any }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(item.likes);

    const handlePress = () => {
      if (isLiked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    };

    return (
      <View style={{ backgroundColor: colors.white, margin: 10, padding: 15, borderRadius: 20, elevation: 3 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }}>
            <View style={[styles.avatarBorder, { width: 50, height: 50, overflow: 'hidden', borderRadius: 25 }]}>
              <Image
                source={{ uri: item.avatar }}
                style={{ height: '100%', width: '100%' }}
                resizeMode='cover'
              />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>
                {item.username}
              </Text>
              <View style={{ alignItems: 'flex-start', marginLeft: 0 }}>
                <RatingStartBar ratingValue={item.Rate} size={20} />
              </View>
            </View>
          </View>
          <Text style={{ color: '#908a8a', fontSize: 13 }}>
            {item.date}
          </Text>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: '#4a4a4a', fontSize: 15, lineHeight: 22 }}>
            {item.content}
          </Text>
        </View>

        <PicturesContainer pictures={item.images} />

        <View style={{ flexDirection: 'row', columnGap: 25, marginTop: 5 }}>
          <TouchableHighlight underlayColor="transparent" onPress={handlePress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
              <Fontisto name="like" size={20} color={isLiked ? colors.primary : "#908a8a"} />
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>{likesCount}</Text>
            </View>
          </TouchableHighlight>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <Octicons name="report" size={20} color="#908a8a" />
            <Text style={{ color: '#908a8a', fontSize: 16 }}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const raingStats = calculateRatingStats(ReviewData);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={ReviewData}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View>
            <View style={{ alignItems: 'center' }}>
              <ImageBackground
                source={{ uri: "https://i.pinimg.com/1200x/6f/54/22/6f542272eef1c2846c752192ff2cd542.jpg" }}
                style={[styles.imageFrame, { width: '100%', height: 450 }]}
                resizeMode="cover"
              >
                <View style={[styles.overlay, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                  <Pressable
                    style={[styles.roundButton, {
                      position: 'absolute',
                      left: 15,
                      top: 15,
                      zIndex: 1,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: 20,
                      padding: 5
                    }]}
                    onPress={() => navigation.navigate("Detail Location")}
                  >
                    <Ionicons name="chevron-back" size={25} color="white" />
                  </Pressable>

                  <Text style={{ color: colors.primary, fontSize: 60, fontWeight: 'bold' }}>4.9</Text>
                  <RatingStartBar ratingValue={4.9} size={30} />
                  <Text style={{ color: "#fff", fontSize: 16, marginTop: 10, letterSpacing: 1 }}>
                    850 VERIFIED REVIEWS
                  </Text>

                  <View style={ratingBarStyles.mainContainer}>
                    {raingStats.map((stat) => (
                      <RatingBar
                        key={stat.stars}
                        stars={stat.stars}
                        percentage={stat.percentage}
                      />
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.bottomInputContainer}>
        <TouchableOpacity style={styles.addPhotoIcon}>
          <Ionicons name="camera-outline" size={24} color="#908a8a" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: reviewText ? colors.primary : '#ddd' }]}
          disabled={!reviewText}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
