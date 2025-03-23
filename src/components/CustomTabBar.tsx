// src/components/CustomTabBar.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

export default function CustomTabBar({state, navigation}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* 底部导航背景 */}
      <View style={styles.tabBackground}>
        {/* 导航按钮容器 */}
        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const isCenter = index === 1;

            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tabButton,
                  isCenter && styles.centerButton,
                  isFocused && styles.activeButton,
                ]}
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.8}>
                {/* 中间按钮特殊样式 */}
                {isCenter ? (
                  <View style={styles.centerButtonInner}>
                    <Icon
                      name="palette"
                      size={28}
                      color="#FFF"
                      style={styles.centerIcon}
                    />
                    <View style={styles.centerButtonShadow} />
                  </View>
                ) : (
                  // 普通按钮内容
                  <View style={styles.tabContent}>
                    <Icon
                      name={getIconName(route.name)}
                      size={24}
                      color={isFocused ? '#7B61FF' : '#666'}
                    />
                    <Text
                      style={[styles.tabText, isFocused && styles.activeText]}>
                      {getLabel(route.name)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// 获取按钮标签
const getLabel = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return '首页';
    case 'Creation':
      return 'AI创作';
    case 'Profile':
      return '我的';
    default:
      return '';
  }
};

// 获取图标名称
const getIconName = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home';
    case 'Profile':
      return 'person';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabBackground: {
    backgroundColor: '#FFF',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    left: width / 2 - 36,
    top: -24,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7B61FF',
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    backgroundColor: '#7B61FF40',
    shadowColor: '#7B61FF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tabContent: {
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeText: {
    color: '#7B61FF',
    fontWeight: '500',
  },
  centerIcon: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeButton: {
    // 普通按钮激活状态样式
  },
});
