import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Share2, Settings, CircleCheck, CreditCard as Edit3, Heart, Bookmark, Folder, Pencil, Users } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useMemo } from 'react';
import { SplashScreen } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInRight,
} from 'react-native-reanimated';

// Constants
const ASSETS = {
  BACKGROUND_IMAGE: require('./imga.gif'),
  PROFILE_IMAGE: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
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

  // Debugging: Log the font paths
  try {
    const circularFont = require('../../assets/fonts/CircularStd-Light.ttf');
    console.log('CircularStd-Light.ttf resolved:', circularFont);
  } catch (error) {
    console.error('Error resolving CircularStd-Light.ttf:', error);
  }

  try {
    const cooperFont = require('../../assets/fonts/CooperHewitt-Medium.otf');
    console.log('CooperHewitt-Medium.otf resolved:', cooperFont);
  } catch (error) {
    console.error('Error resolving CooperHewitt-Medium.otf:', error);
  }

  const [fontsLoaded] = useFonts({
    'CircularStd-Light': require('../../assets/fonts/CircularStd-Light.ttf'),
    'CooperHewitt-Medium': require('../../assets/fonts/CooperHewitt-Medium.otf'),
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
        <View style={styles.profileContainer}>
          <Image source={ASSETS.BACKGROUND_IMAGE} style={styles.backgroundImage} />
          <AnimatedView entering={FadeInDown.duration(600)} style={styles.profile}>
            <View style={styles.profileTopRow}>
              <View style={styles.profileImageContainer}>
                <AnimatedImage
                  source={{ uri: ASSETS.PROFILE_IMAGE }}
                  style={styles.profileImage}
                />
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
        
        {/* Content Section */}
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

// Components
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

// Styles
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: { 
    flex: 1, 
    backgroundColor: 'transparent',
  },
  profileContainer: {
    position: 'relative',
    minHeight: 300,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    borderRadius: 0,
    zIndex: 2,
  },
  gradientBorderOuter: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    borderRadius: 0,
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    zIndex: 1,
    top: -5,
    left: -5,
  },
  gradientBorderInner: {
    position: 'absolute',
    width: '105%',
    height: '105%',
    borderRadius: 0,
    backgroundColor: 'rgba(0, 255, 157, 0.4)',
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
    fontFamily: 'CooperHewitt-Medium',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: { 
    color: '#fff',
    fontSize: 10, 
    fontFamily: 'CooperHewitt-Medium', 
    letterSpacing: 0.5,
  },
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
    fontFamily: 'CircularStd-Light', 
    letterSpacing: 0.5,
  },
  bioContainer: {
    gap: 12,
    marginTop: 4,
  },
  bio: { 
    color: '#ddd', 
    fontSize: 14, 
    fontFamily: 'CircularStd-Light', 
    lineHeight: 20,
  },
  statTransparent: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 0,
    alignSelf: 'flex-start',
  },
  followingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statNumber: { 
    color: '#fff', 
    fontSize: 16, 
    fontFamily: 'CooperHewitt-Medium',
    textAlign: 'center',
  },
  statLabel: { 
    color: '#fff',
    fontSize: 10, 
    fontFamily: 'CircularStd-Light', 
    letterSpacing: 0.5,
  },
  content: { 
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  tabs: {
    flexDirection: 'row',
    width: '100%', // Extend to edge-to-edge
    marginBottom: 24,
    backgroundColor: '#111', // Background only for the tab height
    borderRadius: 0,
    padding: 0,
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
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#00ff9d',
    borderRadius: 0,
  },
  tabText: { 
    color: '#888', 
    fontSize: 12, 
    fontFamily: 'CooperHewitt-Medium', 
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
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
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
    fontFamily: 'CooperHewitt-Medium', 
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
    fontFamily: 'CircularStd-Light',
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
    fontFamily: 'CooperHewitt-Medium',
    marginBottom: 4,
  },
  navItemSubtitle: { 
    color: '#888', 
    fontSize: 11, 
    fontFamily: 'CircularStd-Light' 
  },
  arrowText: { 
    color: '#888', 
    fontSize: 18,
    fontFamily: 'CircularStd-Light',
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