import React, {createContext, useContext} from 'react';
import Toast, {ToastConfig} from 'react-native-toast-message';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ToastType = 'success' | 'error' | 'info' | 'loading';
type ToastParams = {
  message: string;
  subMessage?: string;
  duration?: number;
};

interface ToastContextType {
  show: (type: ToastType, params: ToastParams) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType>({
  show: () => {},
  hide: () => {},
});

// Toast 配置
const toastConfig: ToastConfig = {
  success: ({text1, text2}) => (
    <View style={[styles.container, styles.success]}>
      <Icon name="check-circle" size={24} color="#fff" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.subtitle}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({text1}) => (
    <View style={[styles.container, styles.error]}>
      <Icon name="error" size={24} color="#fff" />
      <Text style={styles.title}>{text1}</Text>
    </View>
  ),
  info: ({text1}) => (
    <View style={[styles.container, styles.info]}>
      <Icon name="info" size={24} color="#fff" />
      <Text style={styles.title}>{text1}</Text>
    </View>
  ),
  loading: ({text1}) => (
    <View style={[styles.container, styles.loading]}>
      <ActivityIndicator size="small" color="#fff" />
      <Text style={styles.title}>{text1}</Text>
    </View>
  ),
};

// Toast 提供者组件
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const show = (
    type: ToastType,
    {message, subMessage, duration = 3000}: ToastParams,
  ) => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: type === 'loading' ? 0 : duration,
    });
  };

  const hide = () => Toast.hide();

  return (
    <ToastContext.Provider value={{show, hide}}>
      {children}
      <Toast config={toastConfig} position="top" />
    </ToastContext.Provider>
  );
};

// 自定义 Hook
export const useToast = (): ToastContextType => {
  return useContext(ToastContext);
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    minHeight: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  loading: {
    backgroundColor: '#9E9E9E',
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
});
