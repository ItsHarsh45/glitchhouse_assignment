import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Heart, Bookmark, Folder, Pencil } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useMemo } from 'react';
import { SplashScreen } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInRight,
} from 'react-native-reanimated';

import CollectionsIcon from '../../assets/icons/CollectionsIcon.svg';
import ManageTagsIcon from '../../assets/icons/ManageTagsIcon.svg';
import ShareIcon from '../../assets/icons/Share.svg';
import SettingsIcon from '../../assets/icons/Settings.svg';
import GreenTickIcon from '../../assets/icons/GreenTick.svg';
import FollowingIcon from '../../assets/icons/Following.svg';

const ASSETS = {
  BACKGROUND_IMAGE: require('./img1.png'),
  PROFILE_IMAGE: require('./pro.png'),
  COLLECTION_IMAGES: {
    liked: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3',
      'https://images.unsplash.com/photo-1575909812264-6902b55846ad',
      'https://images.unsplash.com/photo-1593642532454-e138e28a63f4',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90'
    ],
    saved: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89',
      'https://images.unsplash.com/photo-1563089145-599997674d42',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868'
    ]
  },
  FLAG_IMAGE: 'https://flagcdn.com/w20/in.png',
};

const TABS = [
  { id: 'collections', icon: CollectionsIcon, label: 'COLLECTIONS' },
  { id: 'manageTags', icon: ManageTagsIcon, label: 'MANAGE TAGS' },
];

const COLLECTIONS = [
  { icon: Heart, title: 'LIKED (32)', delay: 600, images: ASSETS.COLLECTION_IMAGES.liked },
  { icon: Bookmark, title: 'SAVED (23)', delay: 700, images: ASSETS.COLLECTION_IMAGES.saved },
];

const MANAGE_TAGS = [
  { id: 'difficulty', title: 'YOUR DIFFICULTY✨', subtitle: 'Choose your challenge level', delay: 300 },
  { id: 'interests', title: 'INTERESTS YOU LIKE✨', subtitle: 'Curated builds for your interests', delay: 400 },
  { id: 'tools', title: 'TOOLS USED🛠️', subtitle: 'Tailored tool suggestions', delay: 500 },
];

SplashScreen.preventAutoHideAsync();

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('collections');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fontsLoaded, fontError] = useFonts({
    'CircularStd-Light': require('../../assets/fonts/CircularStd-Light.ttf'),
    'CooperHewitt-Medium': require('../../assets/fonts/CooperHewitt-Medium.otf'),
  });

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoading(true);
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        setError('Failed to initialize screen: ' + e.message);
        console.error('Initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
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
                <StackedCollectionCard icon={item.icon} title={item.title} images={item.images} />
              </AnimatedTouchable>
            ))}
          </View>
          <AnimatedTouchable entering={FadeInUp.duration(400).delay(800)} style={styles.filesSection}>
            <StackedSimpleCard icon={Folder} title="FILES (3)" />
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
            <View style={styles.navItemContent}>
              <View style={styles.navItemTextContainer}>
                <Text style={styles.navItemTitle}>{item.title}</Text>
                <Text style={styles.navItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </AnimatedTouchable>
        ))}
      </AnimatedView>
    );
  }, [activeTab]);

  if (isLoading) {
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.errorText}>Font loading failed: {fontError.message}</Text>
      </View>
    );
  }

  const currentDate = new Date('2025-04-03');
  const joinDate = new Date(currentDate);
  joinDate.setDate(currentDate.getDate() - 222);
  const daysSinceJoined = Math.floor((currentDate - joinDate) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <View style={styles.profileContainer}>
          <Image source={ASSETS.BACKGROUND_IMAGE} style={styles.backgroundImage} />
          <AnimatedView entering={FadeInDown.duration(600)} style={styles.profile}>
            <View style={styles.profileTopRow}>
              <View style={styles.profileImageContainer}>
                <AnimatedImage
                  source={ASSETS.PROFILE_IMAGE}
                  style={styles.profileImage}
                />
                <View style={styles.gradientBorderOuter} />
                <View style={styles.gradientBorderInner} />
              </View>
              
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.iconButtonTransparent}>
                  <SettingsIcon width={22} height={22} fill="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonTransparent}>
                  <ShareIcon width={22} height={22} fill="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameAndEditContainer}>
                <View style={styles.nameContainer}>
                  <Text style={styles.username}>@theo_from_hsr</Text>
                  <GreenTickIcon width={20} height={20} />
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
                    <FollowingIcon width={19.36} height={19.36} fill="#fff" />
                    <Text style={styles.statNumber}>2</Text>
                  </View>
                  <Text style={styles.statLabel}>FOLLOWING</Text>
                </AnimatedView>
              </View>
            </View>
          </AnimatedView>
        </View>
        
        <AnimatedView entering={FadeInUp.duration(600).delay(300)} style={styles.content}>
          <View style={styles.tabsContainer}>
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
          </View>
          <View style={styles.contentContainer}>
            {tabContent}
          </View>
        </AnimatedView>

        <Footer daysSinceJoined={daysSinceJoined} />
      </ScrollView>
    </View>
  );
}

const Tab = ({ id, icon: Icon, label, isActive, onPress }) => (
  <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress}>
    <Icon width={16} height={16} fill={isActive ? '#00ff9d' : '#888'} />
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const StackedSimpleCard = ({ icon: Icon, title }) => (
  <View style={styles.stackedCollection}>
    <View style={[styles.stackedCardBackground, styles.thirdCardBackgroundDown]} />
    <View style={[styles.stackedCardBackground, styles.secondCardBackgroundDown]} />
    <View style={styles.mainCard}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1623934199716-dc28818a6ec7' }} 
        style={styles.collectionImage} 
      />
      <View style={styles.overlay}>
        <Icon size={16} color="#fff" />
        <Text style={styles.collectionTitle}>{title}</Text>
      </View>
    </View>
  </View>
);

const StackedCollectionCard = ({ icon: Icon, title, images }) => (
  <View style={styles.stackedCollection}>
    <View style={[styles.stackedCardBackground, styles.thirdCardBackgroundDown]} />
    <View style={[styles.stackedCardBackground, styles.secondCardBackgroundDown]} />
    <View style={styles.mainCard}>
      <View style={styles.collageGrid}>
        {images.map((image, index) => (
          <Image 
            key={index}
            source={{ uri: image }} 
            style={styles.collageImage}
          />
        ))}
      </View>
      <View style={styles.collageOverlay}>
        <Icon size={16} color="#fff" />
        <Text style={styles.collectionTitle}>{title}</Text>
      </View>
    </View>
  </View>
);

const Footer = ({ daysSinceJoined }) => (
  <AnimatedView entering={FadeInUp.duration(400).delay(900)} style={styles.footer}>
    <View style={styles.gridLinesContainer}>
      {[...Array(8)].map((_, index) => (
        <View
          key={`h${index}`}
          style={[
            styles.gridLineHorizontal,
            {
              opacity: Math.max(0.4 - Math.abs(index - 3) * 0.1, 0),
              top: `${(index + 1) * 11.25}%`,
            }
          ]}
        />
      ))}
    </View>
    
    <Image source={require('./img2.png')} style={styles.footerLogo} />
    <Text style={styles.joinedText}>JOINED {daysSinceJoined} DAYS AGO</Text>
  </AnimatedView>
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: { 
    flex: 1, 
    backgroundColor: 'transparent',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'CircularStd-Light',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'CircularStd-Light',
    textAlign: 'center',
    padding: 20,
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
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    zIndex: 1,
    top: -5,
    left: -5,
  },
  gradientBorderInner: {
    position: 'absolute',
    width: '105%',
    height: '105%',
    borderRadius: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
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
    paddingVertical: 6,
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
    padding: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderStyle: 'dashed',
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
    paddingVertical: 6,
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
    backgroundColor: '#000',
    flex: 1,
  },
  tabsContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    marginBottom: 4,
  },
  tabs: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
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
  contentContainer: {
    backgroundColor: '#111',
    padding: 16, 
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 500,
  },
  footer: { 
    alignItems: 'center', 
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#111',
    position: 'relative',
    height: 100,
  },
  gridLinesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#fff',
  },
  footerLogo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 10,
    zIndex: 1,
  },
  joinedText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'CooperHewitt-Medium',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  grid: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 16 
  },
  gridItem: { 
    flex: 1 
  },
  stackedCollection: {
    position: 'relative',
    height: 190,
    marginBottom: 4,
  },
  stackedCardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    zIndex: 1,
  },
  secondCardBackgroundDown: {
    bottom: -5,
    left: 3,
    right: 3,
    height: '98%',
    backgroundColor: '#1a1a1a',
    zIndex: 2,
  },
  thirdCardBackgroundDown: {
    bottom: -10,
    left: 6,
    right: 6,
    height: '96%',
    backgroundColor: '#151515',
    zIndex: 1,
  },
  mainCard: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
    zIndex: 3,
  },
  collectionImage: { 
    width: '100%',
    height: '100%', 
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
  collageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collageImage: {
    width: '48%',
    height: '48%',
    margin: '1%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  collageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    marginBottom: 20 
  },
  manageTagsContainer: {
    paddingHorizontal: 0,
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
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navItemTextContainer: {
    flexDirection: 'column',
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
});