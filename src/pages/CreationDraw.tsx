import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';
import TagSelector from '../components/TagSelector';

export default function CreationScreen() {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  console.log('selectedStyle:', selectedStyle);
  console.log('selectedSize:', selectedSize);

  const styleTags = [
    {label: '通用6.0', value: 'sd15'},
    {label: '人像5.2', value: 'sd16'},
    {label: '3D动漫', value: 'sd17'},
    {label: '彩绘日漫', value: 'sd18'},
  ];
  const sizeTags = [
    {label: '3:4', value: '500x600'},
    {label: '4:3', value: '600x500'},
    {label: '1:1', value: '700x700'},
    {label: '9:16', value: '600x900'},
    {label: '16:9', value: '900x600'},
  ];
  return (
    <View style={styles.container}>
      <Header onBack={() => console.log('Back')} />

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

        {/* 风格选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择风格</Text>
          <TagSelector
            tags={styleTags}
            onSelect={selected => setSelectedStyle(selected[0])}
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
        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateText}>立即生成</Text>
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
});
