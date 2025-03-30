import React from 'react';
import {View, StyleSheet} from 'react-native';
import Navigation from './src/navigation';
import {ToastProvider} from './src/components/Toast';
import {DialogProvider} from './src/components/CustomDialog';
function App(): React.JSX.Element {
  return (
    <DialogProvider>
      <ToastProvider>
        <View style={styles.container}>
          <Navigation />
        </View>
      </ToastProvider>
    </DialogProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});
