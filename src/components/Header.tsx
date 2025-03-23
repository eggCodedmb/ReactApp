import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface HeaderProps {
  onBack: () => void;
}

export default function Header({onBack}: HeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>妙笔生画</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    fontSize: 32,
    lineHeight: 36,
    color: '#333333',
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  subtitleWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  highlight: {
    color: '#7B61FF',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusTime: {
    fontSize: 12,
    color: '#666666',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#666666',
  },
});
