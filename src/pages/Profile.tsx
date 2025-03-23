import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text>我的</Text>
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
