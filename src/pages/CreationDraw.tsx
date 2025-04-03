import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import TagSelector from '../components/TagSelector';
import {getModels, txtToimg} from '../api/sdApi';
import {randomId} from '../utils/randomId';
import {useDialog} from '../components/CustomDialog';
import {useToast} from '../components/Toast';
import Storage from '../utils/storage';
// 类型定义
type SizeTag = {
  label: string;
  value: WH;
};

type WH = {
  width: number;
  height: number;
};

type Model = {
  model_name: string;
  title: string;
};

export default function CreationScreen({navigation}) {
  const {showDialog} = useDialog();
  const toast = useToast();
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<WH | null>(null);
  const [modelsList, setModelsList] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  // 尺寸选项配置
  const SIZE_TAGS: SizeTag[] = [
    {label: '3:4', value: {width: 500, height: 667}},
    {label: '4:3', value: {width: 667, height: 500}},
    {label: '1:1', value: {width: 700, height: 700}},
    {label: '9:16', value: {width: 600, height: 900}},
    {label: '16:9', value: {width: 900, height: 600}},
  ];

  // 加载模型列表
  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await getModels();
        if (res.code === 0) {
          // 处理模型数据
          const data = res.result.map((item: any) => ({
            value: item.model_name,
            label: item.model_name,
          }));
          setModelsList(data);
        }
      } catch (error) {
        toast.show('error', {message: error.message});
        setModelsList([]);
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  // 处理生成请求
  const handleGenerate = async () => {
    if (!validateInput()) return;

    try {
      const taskId = randomId();

      const data = {
        prompt: description,
        width: selectedSize?.width,
        height: selectedSize?.height,
        force_task_id: taskId,
      };

      navigation.navigate('Progress', {
        taskId,
        data,
      });
      // const res = await txtToimg(params);
      // if (res.code === 0) {
      //   await Storage.set(taskId, res.result.imgUrls[0]);
      // }
    } catch (error) {
      toast.show('error', {message: error.message || '生成请求失败'});
    }
  };

  // 输入验证
  const validateInput = () => {
    if (!description.trim()) {
      showDialog({
        title: '提示',
        content: '请输入描述内容',
        buttons: [{text: '确定'}],
      });
      return false;
    }
    if (!selectedModel) {
      toast.show('info', {message: '请选择模型'});
      return false;
    }
    if (!selectedSize) {
      toast.show('info', {message: '请选择生成尺寸'});
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
        <Text style={styles.loadingText}>加载模型中...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* 输入区域 */}
        <Section title="输入描述词">
          <TextInput
            multiline
            placeholder="例：粉色银睛白色半长发二次元少女，露肩服装"
            placeholderTextColor="#999"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            maxLength={300}
          />
          <Text style={styles.counter}>{description.length}/300</Text>
        </Section>

        {/* 模型选择 */}
        <Section title="选择模型">
          <TagSelector
            tags={modelsList}
            selectedValue={selectedModel}
            onSelect={setSelectedModel}
          />
        </Section>

        {/* 尺寸选择 */}
        <Section title="选择尺寸">
          <TagSelector
            tags={SIZE_TAGS}
            selectedValue={selectedSize}
            onSelect={setSelectedSize}
            valueToString={(value: WH | null) =>
              value ? `${value.width}x${value.height}` : ''
            }
          />
          {selectedSize && (
            <Text style={styles.selectedSizeText}>
              已选尺寸：{selectedSize.width}x{selectedSize.height}
            </Text>
          )}
        </Section>

        {/* 生成按钮 */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}>
          <Text style={styles.generateText}>立即生成</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 子组件：区域区块
const Section = ({title, children}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// 样式表
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    color: '#333',
  },
  counter: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  generateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  selectedSizeText: {
    marginTop: 8,
    color: '#7B61FF',
    fontSize: 12,
    textAlign: 'center',
  },
});
