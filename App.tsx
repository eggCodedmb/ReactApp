import React from 'react';
import {View, StyleSheet} from 'react-native';
import CreationScreen from './src/pages/CreationScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <CreationScreen />
    </View>
  );
}

export default App;
