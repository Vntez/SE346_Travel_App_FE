import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VNTezSplashScreenProps = {
  overlay?: boolean;
};

export default function VNTezSplashScreen({ overlay = false }: VNTezSplashScreenProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 820,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 820,
          useNativeDriver: true,
        }),
      ])
    );

    const progressLoop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    progressLoop.start();

    return () => {
      pulseLoop.stop();
      progressLoop.stop();
    };
  }, [progress, pulse]);

  const logoScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const logoOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const progressTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-88, 88],
  });

  return (
    <SafeAreaView style={[styles.screen, overlay && styles.overlay]}>
      <View style={styles.brandBlock}>
        <Animated.View
          style={[
            styles.logoMark,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Ionicons name="navigate" size={42} color="#0284C7" />
        </Animated.View>

        <Text style={styles.brandName}>VNTez</Text>
        <Text style={styles.tagline}>Khám phá Việt Nam theo cách của bạn</Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                transform: [{ translateX: progressTranslate }],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  brandBlock: {
    width: '100%',
    alignItems: 'center',
  },
  logoMark: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    marginBottom: 22,
    shadowColor: '#075985',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 54,
    lineHeight: 64,
    fontWeight: '900',
  },
  tagline: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
  },
  progressTrack: {
    width: 176,
    height: 5,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 32,
  },
  progressBar: {
    width: 88,
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
