import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@rneui/themed';
import {useToast} from '../components/Toast';
export default function Home() {
  const toast = useToast();
  return (
    <View style={styles.container}>
      <Button
        title="显示成功提示"
        onPress={() =>
          toast.show('info', {
            message: '操作成功',
            subMessage: '数据已保存',
          })
        }
      />
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
