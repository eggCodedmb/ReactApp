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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {login, register} from '../api/login';
interface Props {
  onLoginSuccess: () => void;
}

export default function AuthScreen({onLoginSuccess}: Props) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!username || !password) {
      setError('用户名和密码为必填项');
      return false;
    }
    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('两次密码输入不一致');
        return false;
      }
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setError('请输入有效的邮箱地址');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isRegistering) {
        // 处理注册逻辑
        const res = await register({username, password, email});
        if (res.code === 200) {
          Alert.alert('注册成功', '请使用新账号登录');
          setIsRegistering(false);
        }
      } else {
        // 处理登录逻辑
        const res = await login({username, password});
        if (res.code === 200) {
          await AsyncStorage.setItem('user', JSON.stringify(res.result));
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.message || '请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isRegistering ? '创建账号' : '欢迎回来'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering ? '开始您的旅程' : '请登录您的账户'}
        </Text>
      </View>

      {!!error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        {isRegistering && (
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="电子邮箱"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="用户名"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="密码"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isRegistering ? '已有账号？' : '还没有账号？'}
        </Text>
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
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
});
