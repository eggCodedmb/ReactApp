// storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageKey = 'user' | 'token' | 'settings';

const Storage = {
  // 同步获取
  get: async (key: StorageKey): Promise<any> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`获取 ${key} 失败:`, error);
      return null;
    }
  },

  // 同步设置
  set: async (key: StorageKey, value: any): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`存储 ${key} 失败:`, error);
      return false;
    }
  },

  // 同步删除
  remove: async (key: StorageKey): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除 ${key} 失败:`, error);
      return false;
    }
  },

  // 同步清空
  clearAll: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('清空存储失败:', error);
      return false;
    }
  },
};

export default Storage;
