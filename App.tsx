import React from 'react';
import {View, StyleSheet} from 'react-native';
import Navigation from './src/navigation';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Navigation />
    </View>
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
