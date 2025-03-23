import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CreationDraw from '../pages/CreationDraw';
import Profile from '../pages/Profile';
import CustomTabBar from '../components/CustomTabBar';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  Home: undefined;
  Creation: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const customTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

export default function Main() {
  return (
    <Tab.Navigator tabBar={customTabBar}>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen
        name="Creation"
        component={CreationDraw}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
