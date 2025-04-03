import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Header from '../components/Header';
import {getProgress, txtToimg} from '../api/sdApi';
import {useToast} from '../components/Toast';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button} from '@rneui/themed';
import {saveImageToGallery} from '../utils/download';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function ProgressScreen({route, navigation}) {
  const {taskId, initialImage, data} = route.params;
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [spinAnim] = useState(new Animated.Value(0));
  const toast = useToast();

  // 旋转动画
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // 渐显动画
  useEffect(() => {
    //
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const createImage = async () => {
      try {
        const res = await txtToimg(data);
        if (res.code === 0) {
          setResultImage(res.result.imgUrls[0]);
          setIsLoading(false);
        }
      } catch (error) {
        toast.show('error', {message: error.message});
        navigation.goBack();
      }
    };

    const interval = setInterval(async () => {
      try {
        const {result, code} = await getProgress({
          id_task: taskId,
          id_live_preview: -1,
          live_preview: true,
        });

        if (code === 0) {
          if (result.active) {
            setProgress(result.progress);
          } else {
            clearInterval(interval);
          }
        }
      } catch (error) {
        toast.show('error', {message: error.message});
        clearInterval(interval);
        navigation.goBack();
      }
    }, 800);
    createImage();

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    navigation.replace('Progress', {taskId, data});
  };
  const saveImage = async () => {
    // 保存到本地
    const img = `http://192.168.1.114:3000${resultImage}`;
    const success = await saveImageToGallery(img, toast);
    if (success) {
      console.log('图片保存成功');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} />

      <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
        {resultImage ? (
          <View style={styles.resultContainer}>
            <Image
              source={{uri: `http://192.168.1.114:3000${resultImage}`}}
              style={styles.resultImage}
              resizeMode="contain"
              onLoadEnd={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#7B61FF" />
              </View>
            )}

            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  /* 保存功能 */
                }}>
                <Icon name="download" size={24} color="#7B61FF" />
                {/* <Text style={styles.actionText}>保存图片</Text> */}
                <Button title="保存图片" type="clear" onPress={saveImage} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Creation')}>
                <Icon name="edit" size={24} color="#7B61FF" />
                {/* <Text style={styles.actionText}>重新创作</Text> */}
                <Button title="重新创作" type="clear" onPress={handleRetry} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={['#7B61FF', '#9B72FF']}
              style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </LinearGradient>

            <Text style={styles.hintText}>正在创作您的作品...</Text>
            <Text style={styles.tipText}>AI正在根据您的描述生成图像</Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  progressContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: '#7B61FF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  hintText: {
    fontSize: 18,
    color: '#2D3436',
    marginTop: 16,
    fontWeight: '500',
  },
  tipText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 8,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.7,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FF',
    width: SCREEN_WIDTH * 0.35,
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: '#7B61FF',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  retryText: {
    color: '#7B61FF',
    fontWeight: '500',
  },
});
