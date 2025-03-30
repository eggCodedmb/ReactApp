import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Tag<T> = {
  label: string;
  value: T;
  hasNew?: boolean;
};

interface TagSelectorProps<T> {
  tags: Tag<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  valueToString?: (value: T) => string;
  containerStyle?: StyleProp<ViewStyle>;
  tagStyle?: StyleProp<ViewStyle>;
}

export default function TagSelector<T>({
  tags,
  selectedValue,
  onSelect,
  valueToString = String,
  containerStyle,
  tagStyle,
}: TagSelectorProps<T>) {
  const getValueKey = (value: T) => valueToString(value);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, containerStyle]}>
      {tags.map((tag, index) => {
        const isSelected =
          getValueKey(tag.value) === getValueKey(selectedValue);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.tag, tagStyle, isSelected && styles.selectedTag]}
            onPress={() => onSelect(tag.value)}>
            <View style={styles.tagContent}>
              {/* 根据标签类型显示图标 */}
              {tag.label.startsWith('通用') && <UniversalIcon />}
              {tag.label.startsWith('人像') && <PortraitIcon />}
              <Text style={styles.tagText}>
                {tag.label.replace(/\.\d+$/, '')}
              </Text>
            </View>
            {tag.hasNew && <View style={styles.newBadge} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// 图标组件（可替换为实际图标组件）
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
