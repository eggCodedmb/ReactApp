import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import Login from '../pages/Login';
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const customTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

const MainTabs = () => (
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

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen name="Auth" options={{headerShown: false}}>
            {() => <Login onLoginSuccess={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
