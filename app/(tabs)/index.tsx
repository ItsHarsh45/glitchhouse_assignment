import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Share2, Settings, CircleCheck, CreditCard as Edit3, Heart, Bookmark, Folder, Pencil, Users } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useEffect, useState, useMemo } from 'react';
import { SplashScreen } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInRight,
} from 'react-native-reanimated';

// Constants
const ASSETS = {
  BACKGROUND_IMAGE: require('./img1.png'), // Background image for profile section
  PROFILE_IMAGE: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', // New profile picture
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

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('collections');
  const [fontsLoaded] = useFonts({
    'Manrope-Regular': Manrope_400Regular,
    'Manrope-SemiBold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section with Background */}
        <View style={styles.profileContainer} onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          // Optionally, you can use this height to dynamically adjust if needed
        }}>
          <Image source={ASSETS.BACKGROUND_IMAGE} style={styles.backgroundImage} />
          <AnimatedView entering={FadeInDown.duration(600)} style={styles.profile}>
            <View style={styles.profileTopRow}>
              <View style={styles.profileImageContainer}>
                <AnimatedImage
                  source={{ uri: ASSETS.PROFILE_IMAGE }}
                  style={styles.profileImage}
                />
                {/* Square Gradient Border */}
                <View style={styles.gradientBorderOuter} />
                <View style={styles.gradientBorderInner} />
              </View>
              
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.iconButtonTransparent}>
                  <Settings color="#fff" size={22} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonTransparent}>
                  <Share2 color="#fff" size={22} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameAndEditContainer}>
                <View style={styles.nameContainer}>
                  <Text style={styles.username}>@theo_from_hsr</Text>
                  <CircleCheck color="#00ff9d" size={20} strokeWidth={2.5} />
                </View>
                
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>EDIT PROFILE</Text>
                  <Pencil size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationRow}>
                <View style={styles.location}>
                  <Image source={{ uri: ASSETS.FLAG_IMAGE }} style={styles.flag} />
                  <Text style={styles.locationText}>INDIA</Text>
                </View>
              </View>
              
              <View style={styles.bioContainer}>
                <Text style={styles.bio}>18 y/o with high ambitions, want to build cool stuff!</Text>
                <AnimatedView style={styles.statTransparent}>
                  <View style={styles.followingContainer}>
                    <Users size={16} color="#fff" />
                    <Text style={styles.statNumber}>2</Text>
                  </View>
                  <Text style={styles.statLabel}>FOLLOWING</Text>
                </AnimatedView>
              </View>
            </View>
          </AnimatedView>
        </View>
        
        {/* Content Section without Background */}
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
    <Icon size={16} color={isActive ? '#00ff9d' : '#888'} />
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const CollectionCard = ({ icon: Icon, title }) => (
  <View style={styles.collection}>
    <Image source={{ uri: ASSETS.COLLECTION_IMAGE }} style={styles.collectionImage} />
    <View style={styles.overlay}>
      <Icon size={16} color="#fff" />
      <Text style={styles.collectionTitle}>{title}</Text>
    </View>
  </View>
);

const Footer = () => (
  <AnimatedView entering={FadeInUp.duration(400).delay(900)} style={styles.footer}>
    <Image source={require('./img2.png')} style={styles.footerLogo} />
  </AnimatedView>
);

// Styles with refined appearance to match reference UI
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
    fontFamily: 'Manrope-Regular',
  },
  container: { 
    flex: 1, 
    backgroundColor: 'transparent',
  },
  profileContainer: {
    position: 'relative',
    minHeight: 300, // Minimum height to ensure content fits
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Extend to the bottom of profileContainer
    width: '100%',
    height: '100%', // Dynamic height based on container
    resizeMode: 'cover',
    zIndex: 0,
  },
  profile: { 
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 30 : 60,
    paddingBottom: 10,
    zIndex: 1,
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
    borderRadius: 0, // Square profile image
    zIndex: 2,
  },
  // Square Gradient Border - using neon green as seen in image
  gradientBorderOuter: {
    position: 'absolute',
    width: '110%', // Slightly larger to create a border effect
    height: '110%',
    borderRadius: 0, // Square border
    backgroundColor: 'rgba(0, 255, 157, 0.2)', // Outer gradient-like effect
    zIndex: 1,
    top: -5,
    left: -5,
  },
  gradientBorderInner: {
    position: 'absolute',
    width: '105%', // Inner gradient-like effect
    height: '105%',
    borderRadius: 0, // Square border
    backgroundColor: 'rgba(0, 255, 157, 0.4)', // Inner gradient-like effect
    zIndex: 1,
    top: -3,
    left: -3,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButtonTransparent: {
    width: 42,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    gap: 8,
  },
  // Name and edit button container
  nameAndEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
  },
  username: { 
    color: '#fff', 
    fontSize: 18, 
    fontFamily: 'Manrope-SemiBold'
  },
  // Updated edit button to be more visible with white text
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Subtle background instead of highlight
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: { 
    color: '#fff', // Changed to white for better visibility
    fontSize: 10, 
    fontFamily: 'Manrope-SemiBold', 
    letterSpacing: 0.5,
  },
  // Location row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 0,
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
    fontFamily: 'Manrope-Regular', 
    letterSpacing: 0.5,
  },
  bioContainer: {
    gap: 12,
    marginTop: 4,
  },
  bio: { 
    color: '#ddd', 
    fontSize: 14, 
    fontFamily: 'Manrope-Regular', 
    lineHeight: 20,
  },
  statTransparent: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 0, // Removed padding to move left
    borderRadius: 0,
    alignSelf: 'flex-start',
  },
  // Following container moved to the left
  followingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statNumber: { 
    color: '#fff', 
    fontSize: 16, 
    fontFamily: 'Manrope-Bold',
    textAlign: 'center',
  },
  statLabel: { 
    color: '#fff', // Changed from #888 to white
    fontSize: 10, 
    fontFamily: 'Manrope-Regular', 
    letterSpacing: 0.5,
  },
  content: { 
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#111', // Darker tab background
    borderRadius: 0, // Square tab container
    padding: 0, // Remove padding to match image
    height: 48, // Fixed height for tabs
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    gap: 8,
    height: '100%', 
  },
  activeTab: { 
    backgroundColor: 'transparent', // No background for active tab
    borderBottomWidth: 2,
    borderBottomColor: '#00ff9d',
    borderRadius: 0, // Square active tab 
  },
  tabText: { 
    color: '#888', 
    fontSize: 12, 
    fontFamily: 'Manrope-SemiBold', 
    letterSpacing: 0.5,
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
    borderRadius: 0, // Square collection 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222', // Subtle border seen in image
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
  collectionTitle: { 
    color: '#fff', 
    fontSize: 12, 
    fontFamily: 'Manrope-SemiBold', 
    letterSpacing: 0.5,
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
    color: '#888',
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-SemiBold',
    marginBottom: 4,
  },
  navItemSubtitle: { 
    color: '#888', 
    fontSize: 11, 
    fontFamily: 'Manrope-Regular' 
  },
  arrowText: { 
    color: '#888', 
    fontSize: 18,
    fontFamily: 'Manrope-Regular',
  },
  footer: { 
    alignItems: 'center', 
    padding: 20 
  },
  footerLogo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
});
