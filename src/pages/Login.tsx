import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {login, register} from '../api/login';
import {useRoute, RouteProp} from '@react-navigation/native';
import storage from '../utils/storage';
export default function Login() {
  type LoginRouteParams = {
    onLoginSuccess?: () => void;
  };
  const route = useRoute<RouteProp<{params: LoginRouteParams}, 'params'>>();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: 'dmb1234',
    password: '1234Dong',
    confirmPassword: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 从路由参数获取登录成功回调
  const onLoginSuccess = route.params?.onLoginSuccess;

  // 表单验证规则
  const validateForm = () => {
    const {username, password, confirmPassword, email} = formData;
    const errors = [];

    if (!username.trim()) errors.push('用户名不能为空');
    if (!password) errors.push('密码不能为空');

    if (isRegistering) {
      if (password !== confirmPassword) errors.push('两次密码输入不一致');
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push('请输入有效的邮箱地址');
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    return true;
  };

  // 表单提交处理
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isRegistering) {
        const res = await register(formData);
        if (res.code === 0) {
          Alert.alert('注册成功', '请使用新账号登录', [
            {
              text: '确定',
              onPress: () => {
                setIsRegistering(false);
                setFormData(prev => ({
                  ...prev,
                  password: '',
                  confirmPassword: '',
                  email: '',
                }));
              },
            },
          ]);
        } else {
          setError(res.message || '注册失败');
        }
      } else {
        const res = await login({
          username: formData.username,
          password: formData.password,
        });

        if (res.code === 0) {
          await storage.set('token', res.result.token);
          const user = {...res.result.user};
          await storage.set('user', {...user});
          onLoginSuccess?.();
        } else {
          setError(res.message || '登录失败');
        }
      }
    } catch (err) {
      setError((err as Error).message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* 头部标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isRegistering ? '创建账号' : '欢迎回来'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering ? '开始您的旅程' : '请登录您的账户'}
        </Text>
      </View>

      {/* 错误提示 */}
      {!!error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 表单区域 */}
      <View style={styles.form}>
        {isRegistering && (
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="电子邮箱"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="用户名"
            placeholderTextColor="#999"
            value={formData.username}
            onChangeText={text => handleInputChange('username', text)}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="密码"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        {isRegistering && (
          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              placeholder="确认密码"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={text => handleInputChange('confirmPassword', text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegistering ? '注 册' : '登 录'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 底部切换链接 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isRegistering ? '已有账号？' : '还没有账号？'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}>
          <Text style={styles.link}>
            {isRegistering ? '立即登录' : '立即注册'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 新增样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#2D3436',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#7B61FF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#636E72',
    fontSize: 14,
  },
  link: {
    color: '#7B61FF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
