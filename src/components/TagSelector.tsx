import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface TagSelectorProps {
  tags: string[];
  onSelect: (selected: string) => void;
}

export default function TagSelector({tags, onSelect}: TagSelectorProps) {
  const [selectedTag, setSelectedTag] = useState<string>('');

  const handlePress = (tag: string) => {
    // 当点击已选中的标签时不做任何改变
    if (tag === selectedTag) {
      return;
    }

    setSelectedTag(tag);
    onSelect(tag);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tags.map(tag => (
        <TouchableOpacity
          key={tag}
          style={[styles.tag, selectedTag === tag && styles.selectedTag]}
          onPress={() => handlePress(tag)}>
          {/* 标签内容显示 */}
          <View style={styles.tagContent}>
            {/* 风格标签图标 */}
            {tag.startsWith('通用') && <UniversalIcon />}
            {tag.startsWith('人像') && <PortraitIcon />}
            <Text style={styles.tagText}>{tag.replace(/\.\d+$/, '')}</Text>
          </View>

          {/* NEW角标 */}
          {tag.includes('NEW') && <View style={styles.newBadge} />}
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
