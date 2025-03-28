import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Storage from '../utils/storage';
import {me} from '../api/login';
interface User {
  id: string;
  nickname: string;
  email: string;
  username: string;
  avatar?: string;
  level?: string;
  startDate?: string;
  endDate?: string;
  points?: number;
}

const Profile = ({navigation}: {navigation: any}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await Storage.get('user');
        const {result, code} = await me();
        if (code === 0) {
          await Storage.set('user', {...userData, ...result.vip});
        }
        const newUser = await Storage.get('user');
        setUser(newUser);
      } catch (error) {
        console.error('加载用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('确认退出', '确定要退出当前账号吗？', [
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

  const renderInfoCard = (icon: string, title: string, value: string) => (
    <View style={styles.card}>
      <Icon name={icon} size={24} color="#7B61FF" />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>未登录用户</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.loginButtonText}>立即登录</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 头部背景 */}
      <LinearGradient
        colors={['#7B61FF', '#9C88FF']}
        style={styles.headerBackground}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* 主要内容 */}
      <View style={styles.content}>
        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image
              source={{uri: `http://192.168.1.114:3000${user.avatar}`}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account-circle" size={100} color="#7B61FF" />
            </View>
          )}
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        {/* 会员信息 */}
        <View style={styles.membershipCard}>
          <Text style={styles.membershipTitle}>VIP 会员</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${(user.points || 0) / 100}%`},
              ]}
            />
          </View>
          <View style={styles.membershipInfo}>
            <View>
              <Text style={styles.infoLabel}>当前等级</Text>
              <Text style={styles.infoValue}>{user.level || '无'}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>有效期至</Text>
              <Text style={styles.infoValue}>
                {user.endDate || '2024-12-31'}
              </Text>
            </View>
          </View>
        </View>

        {/* 信息卡片 */}
        {renderInfoCard('email', '电子邮箱', user.email)}
        {renderInfoCard(
          'calendar-today',
          '注册日期',
          user.startDate || '2023-01-01',
        )}
        {renderInfoCard('star', '当前积分', `${user.points || 0} 分`)}

        {/* 操作按钮 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#636E72',
    marginBottom: 20,
  },
  headerBackground: {
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  avatarPlaceholder: {
    backgroundColor: '#FFF',
    borderRadius: 60,
    padding: 10,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 15,
  },
  username: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 5,
  },
  membershipCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EDE7FF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7B61FF',
    borderRadius: 3,
  },
  membershipInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTextContainer: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: '#636E72',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
