import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Share2, Settings, CircleCheck, CreditCard as Edit3, Heart, Bookmark, Folder } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useEffect, useState, useMemo } from 'react';
import { SplashScreen } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInRight,
  SlideInRight, 
  withSpring, 
  useAnimatedStyle, 
  withSequence, 
  withDelay, 
  withTiming, 
  withRepeat,
  useSharedValue 
} from 'react-native-reanimated';

// Constants
const ASSETS = {
  PROFILE_IMAGE: 'https://images.unsplash.com/photo-1517849845537-4d257902454a',
  COLLECTION_IMAGE: 'https://images.unsplash.com/photo-1623934199716-dc28818a6ec7',
  FLAG_IMAGE: 'https://flagcdn.com/w20/in.png',
};

const TABS = [
  { id: 'collections', icon: Folder, label: 'Collections' },
  { id: 'manageTags', icon: CircleCheck, label: 'Manage Tags' },
];

const COLLECTIONS = [
  { icon: Heart, title: 'Liked (32)', delay: 600 },
  { icon: Bookmark, title: 'Saved (23)', delay: 700 },
];

const MANAGE_TAGS = [
  { id: 'difficulty', title: 'Your Difficulty', subtitle: 'Choose your challenge level', delay: 300 },
  { id: 'interests', title: 'Interests You Like', subtitle: 'Curated builds for your interests', delay: 400 },
  { id: 'tools', title: 'Tools Used', subtitle: 'Tailored tool suggestions', delay: 500 },
];

SplashScreen.preventAutoHideAsync();

// Animated Components
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Particle and Wave Configurations
const STARS = [
  { top: '20%', left: '30%', size: 4, durationX: 5000, durationY: 4000, translateX: 10, translateY: -15, opacity: 0.7 },
  { top: '50%', left: '70%', size: 3, durationX: 6000, durationY: 0, translateX: -20, translateY: 0, opacity: 0.6 },
  { top: '80%', left: '20%', size: 5, durationX: 0, durationY: 4500, translateX: 0, translateY: 15, opacity: 0.5 },
  { top: '30%', left: '80%', size: 2, durationX: 7000, durationY: 0, translateX: 25, translateY: 0, opacity: 0.4 },
  { top: '70%', left: '50%', size: 4, durationX: 0, durationY: 0, translateX: 0, translateY: 0, opacity: 0.5, fadeDuration: 3000 },
  { top: '10%', left: '60%', size: 3, durationX: 5500, durationY: 3500, translateX: -15, translateY: 10, opacity: 0.6 },
  { top: '90%', left: '40%', size: 4, durationX: 6500, durationY: 0, translateX: 20, translateY: 0, opacity: 0.5 },
  { top: '40%', left: '90%', size: 2, durationX: 0, durationY: 5000, translateX: 0, translateY: -20, opacity: 0.4 },
];

const WAVES = [
  { top: 0, height: 100, duration: 7000, translate: 50, opacity: 0.2, color: 'rgba(88, 101, 242, 0.1)' },
  { top: 0, height: 150, duration: 8000, translate: 30, opacity: 0.15, color: 'rgba(0, 255, 157, 0.05)', direction: 'Y' },
  { top: '60%', height: 120, duration: 9000, translate: -40, opacity: 0.1, color: 'rgba(255, 255, 255, 0.03)' },
  { top: '30%', height: 80, duration: 6000, translate: 60, opacity: 0.12, color: 'rgba(88, 101, 242, 0.08)' },
  { top: '80%', height: 90, duration: 8500, translate: -50, opacity: 0.08, color: 'rgba(0, 255, 157, 0.03)' },
];

const CIRCLES = [
  { top: '40%', left: '10%', size: 50, duration: 6000, scale: 1.2, opacity: 0.3 },
  { top: '60%', left: '60%', size: 70, duration: 5000, translateY: -20, opacity: 0.2 },
  { top: '20%', left: '50%', size: 60, duration: 7000, scale: 1.3, opacity: 0.25 },
];

const LINES = [
  { top: '15%', left: 0, width: '100%', height: 1, duration: 8000, translateX: 30, opacity: 0.1 },
  { top: '75%', left: 0, width: '100%', height: 1, duration: 9000, translateX: -30, opacity: 0.1 },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('collections');
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Shared values for profile image animation
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Shared values for background patterns
  const starValues = STARS.map(() => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(0.5),
  }));

  const waveValues = WAVES.map(() => useSharedValue(0));
  const circleValues = CIRCLES.map(() => ({
    scale: useSharedValue(1),
    translateY: useSharedValue(0),
  }));
  const lineValues = LINES.map(() => useSharedValue(0));

  // Profile image animation style
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  // Animated styles for background patterns
  const starStyles = starValues.map((value, index) => useAnimatedStyle(() => {
    const config = STARS[index];
    return {
      transform: [
        { translateX: config.durationX ? value.translateX.value : 0 },
        { translateY: config.durationY ? value.translateY.value : 0 },
      ],
      opacity: config.fadeDuration ? value.opacity.value : config.opacity,
    };
  }));

  const waveStyles = waveValues.map((value, index) => useAnimatedStyle(() => {
    const config = WAVES[index];
    return {
      transform: [
        config.direction === 'Y'
          ? { translateY: value.value }
          : { translateX: value.value },
      ],
      opacity: config.opacity,
    };
  }));

  const circleStyles = circleValues.map((value, index) => useAnimatedStyle(() => {
    const config = CIRCLES[index];
    return {
      transform: [
        config.scale ? { scale: value.scale.value } : { scale: 1 },
        config.translateY ? { translateY: value.translateY.value } : { translateY: 0 },
      ],
      opacity: config.opacity,
    };
  }));

  const lineStyles = lineValues.map((value, index) => useAnimatedStyle(() => ({
    transform: [{ translateX: value.value }],
    opacity: LINES[index].opacity,
  })));

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Initial profile image animation
      scale.value = withSequence(withSpring(1.1), withDelay(100, withSpring(1)));
      translateY.value = withSequence(withSpring(-5), withDelay(100, withSpring(0)));

      // Background pattern animations
      starValues.forEach((value, index) => {
        const config = STARS[index];
        if (config.durationX) {
          value.translateX.value = withRepeat(
            withTiming(config.translateX, { duration: config.durationX }),
            -1,
            true
          );
        }
        if (config.durationY) {
          value.translateY.value = withRepeat(
            withTiming(config.translateY, { duration: config.durationY }),
            -1,
            true
          );
        }
        if (config.fadeDuration) {
          value.opacity.value = withRepeat(
            withTiming(0.8, { duration: config.fadeDuration }),
            -1,
            true
          );
        }
      });

      waveValues.forEach((value, index) => {
        const config = WAVES[index];
        value.value = withRepeat(
          withTiming(config.translate, { duration: config.duration }),
          -1,
          true
        );
      });

      circleValues.forEach((value, index) => {
        const config = CIRCLES[index];
        if (config.scale) {
          value.scale.value = withRepeat(
            withTiming(config.scale, { duration: config.duration }),
            -1,
            true
          );
        }
        if (config.translateY) {
          value.translateY.value = withRepeat(
            withTiming(config.translateY, { duration: config.duration }),
            -1,
            true
          );
        }
      });

      lineValues.forEach((value, index) => {
        const config = LINES[index];
        value.value = withRepeat(
          withTiming(config.translateX, { duration: config.duration }),
          -1,
          true
        );
      });
    }
  }, [fontsLoaded]);

  const tabContent = useMemo(() => {
    if (activeTab === 'collections') {
      return (
        <>
          <View style={styles.grid}>
            {COLLECTIONS.map((item, index) => (
              <AnimatedTouchable
                key={index}
                entering={FadeInUp.duration(400).delay(item.delay)}
                style={styles.gridItem}
              >
                <CollectionCard icon={item.icon} title={item.title} />
              </AnimatedTouchable>
            ))}
          </View>
          <AnimatedTouchable entering={FadeInUp.duration(400).delay(800)} style={styles.filesSection}>
            <CollectionCard icon={Folder} title="Files (3)" />
          </AnimatedTouchable>
        </>
      );
    }
    return (
      <AnimatedView style={styles.manageTagsContainer}>
        <AnimatedView entering={FadeInDown.duration(400).delay(200)} style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>
            Our recommendations work best when you let us know these things:
          </Text>
        </AnimatedView>
        
        {MANAGE_TAGS.map((item, index) => (
          <AnimatedTouchable 
            key={item.id} 
            entering={FadeInRight.duration(400).delay(item.delay)}
            style={styles.navItem}
          >
            <View>
              <Text style={styles.navItemTitle}>{item.title}</Text>
              <Text style={styles.navItemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </AnimatedTouchable>
        ))}
      </AnimatedView>
    );
  }, [activeTab]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.outerContainer}>
      {/* Animated Background with Patterns */}
      <View style={styles.backgroundBase}>
        {/* Wavy Patterns */}
        {WAVES.map((wave, index) => (
          <AnimatedView
            key={`wave-${index}`}
            style={[styles.wave, { top: wave.top, height: wave.height, backgroundColor: wave.color }, waveStyles[index]]}
          />
        ))}
        {/* Starry Particles */}
        {STARS.map((star, index) => (
          <AnimatedView
            key={`star-${index}`}
            style={[styles.star, { top: star.top, left: star.left, width: star.size, height: star.size, borderRadius: star.size / 2 }, starStyles[index]]}
          />
        ))}
        {/* Pulsing Circles */}
        {CIRCLES.map((circle, index) => (
          <AnimatedView
            key={`circle-${index}`}
            style={[styles.circle, { top: circle.top, left: circle.left, width: circle.size, height: circle.size, borderRadius: circle.size / 2 }, circleStyles[index]]}
          />
        ))}
        {/* Subtle Lines */}
        {LINES.map((line, index) => (
          <AnimatedView
            key={`line-${index}`}
            style={[styles.line, { top: line.top, width: line.width, height: line.height }, lineStyles[index]]}
          />
        ))}
      </View>

      {/* Foreground Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <AnimatedView entering={FadeInDown.duration(600)} style={styles.profile}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileImageContainer}>
              <AnimatedImage
                source={{ uri: ASSETS.PROFILE_IMAGE }}
                style={[styles.profileImage, animatedImageStyle]}
              />
              <View style={styles.profileBorderOuter} />
              <View style={styles.profileBorderInner} />
            </View>
            
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Settings color="#fff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share2 color="#fff" size={22} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.username}>@theo_from_hsr</Text>
              <CircleCheck color="#00ff9d" size={20} strokeWidth={2.5} />
            </View>
            
            <View style={styles.location}>
              <Image source={{ uri: ASSETS.FLAG_IMAGE }} style={styles.flag} />
              <Text style={styles.locationText}>India</Text>
            </View>
            
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={14} color="#666" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <View style={styles.bioContainer}>
              <Text style={styles.bio}>18 y/o with high ambitions, want to build cool stuff!</Text>
              <AnimatedView style={styles.stat}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Following</Text>
              </AnimatedView>
            </View>
          </View>
        </AnimatedView>
        
        <AnimatedView entering={FadeInUp.duration(600).delay(300)} style={styles.content}>
          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <Tab
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onPress={() => setActiveTab(tab.id)}
              />
            ))}
          </View>
          {tabContent}
          <Footer />
        </AnimatedView>
      </ScrollView>
    </View>
  );
}

// Tab, CollectionCard, and Footer components
const Tab = ({ id, icon: Icon, label, isActive, onPress }) => (
  <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress}>
    <Icon size={16} color={isActive ? '#00ff9d' : '#fff'} />
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const CollectionCard = ({ icon: Icon, title }) => (
  <View style={styles.collection}>
    <Image source={{ uri: ASSETS.COLLECTION_IMAGE }} style={styles.collectionImage} />
    <View style={styles.overlay}>
      <Icon size={16} color="#fff" style={styles.collectionIcon} />
      <Text style={styles.collectionTitle}>{title}</Text>
    </View>
  </View>
);

const Footer = () => (
  <AnimatedView entering={FadeInUp.duration(400).delay(900)} style={styles.footer}>
    <Text style={styles.footerText}>glitch | house</Text>
  </AnimatedView>
);

// Styles
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#18191C', // Discord-like dark gray
    zIndex: 0,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 50,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
  },
  line: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  container: { 
    flex: 1, 
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  profile: { 
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 30 : 60,
    paddingBottom: 30,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    width: 85,
    height: 85,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 2,
  },
  profileBorderOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ff9d',
    borderStyle: 'solid',
    zIndex: 1,
  },
  profileBorderInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ff9d',
    borderStyle: 'dashed',
    opacity: 0.6,
    zIndex: 1,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    gap: 8,
  },
  nameContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
  },
  username: { 
    color: '#fff', 
    fontSize: 18, 
    fontFamily: 'Inter-SemiBold' 
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  flag: { 
    width: 18, 
    height: 12 
  },
  locationText: { 
    color: '#fff', 
    fontSize: 11, 
    fontFamily: 'Inter-Regular', 
    textTransform: 'uppercase' 
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editButtonText: { 
    color: '#999', 
    fontSize: 11, 
    fontFamily: 'Inter-Regular', 
    textTransform: 'uppercase' 
  },
  bioContainer: {
    gap: 8,
  },
  bio: { 
    color: '#ddd', 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    lineHeight: 20,
  },
  stat: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statNumber: { 
    color: '#fff', 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold',
  },
  statLabel: { 
    color: '#999', 
    fontSize: 11, 
    fontFamily: 'Inter-Regular', 
    textTransform: 'uppercase',
  },
  content: { 
    paddingBottom: 20 
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 4,
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    gap: 6 
  },
  activeTab: { 
    backgroundColor: 'rgba(0, 255, 157, 0.2)', 
    borderRadius: 8 
  },
  tabText: { 
    color: '#fff', 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    textTransform: 'uppercase' 
  },
  activeTabText: { 
    color: '#00ff9d' 
  },
  grid: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    gap: 12, 
    marginBottom: 16 
  },
  gridItem: { 
    flex: 1 
  },
  collection: { 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  collectionImage: { 
    width: '100%', 
    height: 160, 
    resizeMode: 'cover' 
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collectionIcon: { 
    opacity: 0.9 
  },
  collectionTitle: { 
    color: '#fff', 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    textTransform: 'uppercase' 
  },
  filesSection: { 
    paddingHorizontal: 16, 
    marginBottom: 20 
  },
  manageTagsContainer: {
    paddingHorizontal: 16,
  },
  recommendationContainer: {
    marginBottom: 16,
  },
  recommendationText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 18,
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItemTitle: { 
    color: '#fff', 
    fontSize: 13, 
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  navItemSubtitle: { 
    color: '#999', 
    fontSize: 11, 
    fontFamily: 'Inter-Regular' 
  },
  arrowText: { 
    color: '#999', 
    fontSize: 18 
  },
  footer: { 
    alignItems: 'center', 
    padding: 20 
  },
  footerText: { 
    color: '#fff', 
    fontSize: 14, 
    fontFamily: 'Inter-SemiBold',
  },
});