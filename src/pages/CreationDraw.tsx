import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import TagSelector from '../components/TagSelector';
import {getModels, txtToimg, getProgress} from '../api/sdApi';
import {randomId} from '../utils/randomId';

type progress = {
  active: boolean;
  queued: boolean;
  completed: boolean;
  progress: number;
  eta: string;
  live_preview: string;
  id_live_preview: number;
  textinfo: string;
};

export default function CreationScreen({navigation}) {
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [modelsList, setModelsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // 尺寸选项
  const sizeTags = [
    {label: '3:4', value: '500x600'},
    {label: '4:3', value: '600x500'},
    {label: '1:1', value: '700x700'},
    {label: '9:16', value: '600x900'},
    {label: '16:9', value: '900x600'},
  ];

  // 加载模型列表
  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await getModels();
        // 转换数据结构适配选择器
        const formattedModels = res.result.models.map(
          (model: {model_name: any; title: any}) => ({
            ...model,
            label: model.model_name,
            value: model.title,
          }),
        );
        setModelsList(formattedModels);
      } catch (error) {
        Alert.alert('加载失败', '无法获取模型列表');
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [modelsList]);

  // 处理生成请求
  const handleGenerate = async () => {
    if (!description.trim()) {
      Alert.alert('提示', '请输入描述内容');
      return;
    }

    try {
      setGenerating(true);
      const newTaskId = randomId();
      const params = {
        prompt: description,
        force_task_id: newTaskId,
      };

      const params2 = {
        id_task: newTaskId,
        id_live_preview: -1,
      };

      // 启动生成任务
      const imgResult = await txtToimg(params);
      // 轮询进度
      const interval = setInterval(async () => {
        const {result, code} = await getProgress(params2);
        if (code === 0) {
          setProgress(result.progress);
          console.log(result.progress); //进度0-1
          if (result.active === false) {
            clearInterval(interval);
            navigation.navigate('Result', {
              image: imgResult.result[0],
            });
          }
        }
      }, 1000);
    } catch (error) {
      Alert.alert('生成失败', error.message);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  // 加载状态显示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
        <Text style={styles.loadingText}>加载模型中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 描述词输入区域 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>输入描述词</Text>
            <TouchableOpacity style={styles.polishButton}>
              <Text style={styles.polishText}>描述词润色</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            multiline
            placeholder="如：粉色银睛白色半长发二次元少女，露肩服装"
            placeholderTextColor="#999999"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            maxLength={300}
          />
          <Text style={styles.counter}>{description.length}/300</Text>
        </View>

        {/* 模型选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择模型</Text>
          <TagSelector
            tags={modelsList}
            onSelect={selected => setSelectedModel(selected[0])}
          />
        </View>

        {/* 尺寸选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择尺寸</Text>
          <TagSelector
            tags={sizeTags}
            onSelect={selected => setSelectedSize(selected[0])}
          />
        </View>

        {/* 生成按钮 */}
        <TouchableOpacity
          style={[styles.generateButton, generating && styles.disabledButton]}
          onPress={handleGenerate}
          disabled={generating}>
          {generating ? (
            <View style={styles.progressContainer}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.progressText}>
                生成中... {Math.round(progress * 100)}%
              </Text>
            </View>
          ) : (
            <Text style={styles.generateText}>立即生成</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  polishButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  polishText: {
    color: '#7B61FF',
    fontSize: 12,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    color: '#333333',
  },
  counter: {
    textAlign: 'right',
    color: '#999999',
    fontSize: 12,
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginVertical: 24,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  remainingText: {
    color: '#FFFFFFAA',
    fontSize: 12,
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  disabledButton: {
    backgroundColor: '#A89FFF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressText: {
    color: '#FFF',
    fontSize: 14,
  },
});
