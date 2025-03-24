import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Storage from '../utils/storage';
import {IUser} from '../types/user';
import {uploadFile} from '../api/upload';

interface SettingsProps {
  navigation: any;
}

const Settings = ({navigation}: SettingsProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await Storage.get('user');
        if (userData) {
          setUser(userData);
          setFormData({
            nickname: userData.nickname,
            email: userData.email,
            avatar: userData.avatar,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      {text: '取消', style: 'cancel'},
      {
        text: '确定',
        onPress: async () => {
          await Storage.remove('user');
          navigation.reset({
            index: 0,
            routes: [{name: 'Auth'}],
          });
        },
      },
    ]);
  };

  const handleAvatarUpdate = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });

      console.log(image);

      const res = await uploadFile(image.path);
      console.log(res);

      setFormData(prev => ({...prev, avatar: image.path}));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...formData,
      } as IUser;

      await Storage.set('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      Alert.alert('修改成功');
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 头像编辑 */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleAvatarUpdate}>
          {formData.avatar ? (
            <Image source={{uri: formData.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="camera-alt" size={32} color="#7B61FF" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.avatarHint}>点击更换头像</Text>
      </View>

      {/* 基本信息表单 */}
      <View style={styles.formSection}>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>昵称</Text>
          <TextInput
            style={styles.input}
            value={formData.nickname}
            onChangeText={text =>
              setFormData(prev => ({...prev, nickname: text}))
            }
            editable={editMode}
          />
        </View>

        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>电子邮箱</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={text => setFormData(prev => ({...prev, email: text}))}
            editable={editMode}
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionSection}>
        {editMode ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}>
              <Text style={styles.buttonText}>保存修改</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditMode(false)}>
              <Text style={styles.buttonText}>取消编辑</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setEditMode(true)}>
            <Text style={styles.buttonText}>编辑资料</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}>
          <Text style={styles.buttonText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EDE7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  avatarHint: {
    color: '#636E72',
    marginTop: 8,
    fontSize: 14,
  },
  formSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputItem: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3436',
  },
  actionSection: {
    gap: 12,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#7B61FF',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#FFC107',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default Settings;
