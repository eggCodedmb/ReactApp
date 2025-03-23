import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

type Tag = {
  label: string;
  value: string;
  hasNew?: boolean; // 添加NEW标记属性
};

interface TagSelectorProps {
  tags: Tag[];
  onSelect: (selected: string) => void;
}

export default function TagSelector({tags, onSelect}: TagSelectorProps) {
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]?.value || '');

  useEffect(() => {
    if (tags.length > 0) {
      onSelect(tags[0].value);
    }
  }, [onSelect, tags]);

  const handlePress = (tag: Tag) => {
    if (tag.value === selectedTag) return;
    setSelectedTag(tag.value);
    onSelect(tag.value);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tags.map(tag => (
        <TouchableOpacity
          key={tag.value}
          style={[styles.tag, selectedTag === tag.value && styles.selectedTag]}
          onPress={() => handlePress(tag)}>
          <View style={styles.tagContent}>
            {/* 根据标签类型显示图标 */}
            {tag.label.startsWith('通用') && <UniversalIcon />}
            {tag.label.startsWith('人像') && <PortraitIcon />}
            <Text style={styles.tagText}>
              {tag.label.replace(/\.\d+$/, '')}
            </Text>
          </View>
          {/* NEW标记 */}
          {tag.hasNew && <View style={styles.newBadge} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
// 图标组件示例
const UniversalIcon = () => (
  <View style={styles.icon}>
    <Text>🎨</Text>
  </View>
);

const PortraitIcon = () => (
  <View style={styles.icon}>
    <Text>📷</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  tag: {
    width: 100,
    height: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
    position: 'relative',
  },
  selectedTag: {
    borderWidth: 2,
    borderColor: '#7B61FF',
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: '#666666',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
  },
  tagContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
});
