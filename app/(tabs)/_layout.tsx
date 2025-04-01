import { View } from 'react-native';
import Index from './index'; // Import the Index screen directly

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Index />
    </View>
  );
}