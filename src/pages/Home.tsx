import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>首页内容</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
