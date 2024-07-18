import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import DraggableIndicator from './android/src/screen/DraggableIndicator';


import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <DraggableIndicator />
      </SafeAreaView>
     </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
