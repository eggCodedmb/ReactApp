import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import Login from '../pages/Login';
import MainTabs from '../pages/MainTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from 'react-native';

export type RootStackParamList = {
  Auth: {onLoginSuccess: () => void};
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 创建导航引用
export const navigationRef = React.createRef<any>();

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Auth');

  // 初始化检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      setInitialRoute(user ? 'Main' : 'Auth');
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 处理登录成功后的导航
  const handleLoginSuccess = () => {
    navigationRef.current?.resetRoot({
      index: 0,
      routes: [{name: 'Main'}],
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Auth"
          component={Login}
          initialParams={{onLoginSuccess: handleLoginSuccess}}
        />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
