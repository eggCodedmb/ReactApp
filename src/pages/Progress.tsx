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
        });

        if (code === 0) {
          setProgress(result.progress);
          if (result.active === false) {
            clearInterval(interval);
            setResultImage(result.images?.[0]?.url);
          }
        }
      } catch (error) {
        toast.show('error', {message: error.message});
        clearInterval(interval);
      }
    }, 3000000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        {resultImage ? (
          <Image
            source={{uri: resultImage}}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    height: '80%',
    borderRadius: 12,
  },
});
