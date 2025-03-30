import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../pages/Home';
import CreationDraw from '../pages/CreationDraw';
import Profile from '../pages/Profile';
import Settings from '../pages/Setting';
import CustomTabBar from '../components/CustomTabBar';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Home: undefined;
  Creation: undefined;
  Profile: undefined;
  User: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const ProfileStack = createStackNavigator();

// Profile模块的专属导航栈
const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Profile">
    <ProfileStack.Screen name="Profile" component={Profile} />
    <ProfileStack.Screen name="Settings" component={Settings} />
  </ProfileStack.Navigator>
);

const customTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={customTabBar}>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen
        name="Creation"
        component={CreationDraw}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="User"
        component={ProfileStackScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
