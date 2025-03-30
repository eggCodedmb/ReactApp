import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import {getProgress} from '../api/sdApi';
import {useToast} from '../components/Toast';
import Storage from '../utils/storage';
export default function ProgressScreen({route, navigation}) {
  const {taskId, initialImage} = route.params;
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(initialImage);
  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const {result, code} = await getProgress({
          id_task: taskId,
          id_live_preview: -1,
          live_preview: true,
        });

        console.log(result);
        if (code === 0) {
          if (result.active) {
            setProgress(result.progress);
            if (result.completed) {
            }
          } else {
            setTimeout(async () => {
              const img = await Storage.get(taskId);
              setResultImage(img);
            }, 2000);
            clearInterval(interval);
          }
        }
      } catch (error) {
        toast.show('error', {message: error.message});
        clearInterval(interval);
        navigation.navigate('Creation');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        {resultImage ? (
          <Image
            source={{uri: `http://192.168.1.114:3000${resultImage}`}}
            style={styles.resultImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#7B61FF" />
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
            <Text style={styles.hintText}>正在生成您的创意作品...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    gap: 20,
  },
  progressText: {
    fontSize: 24,
    color: '#7B61FF',
    fontWeight: '600',
  },
  hintText: {
    color: '#666',
    fontSize: 16,
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
