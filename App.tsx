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
    flex: 1,
    backgroundColor: 'white',
  },
});
