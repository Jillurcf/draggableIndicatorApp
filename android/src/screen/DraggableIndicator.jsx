// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, Dimensions, Button, Alert } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';

// const { width, height } = Dimensions.get('window');

// const DraggableIndicator = () => {
//   const translateX = useSharedValue(width / 2 - 25);
//   const translateY = useSharedValue(height / 2 - 25);
//   const buttonRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
//   const [buttonLayouts, setButtonLayouts] = useState([]);

//   useEffect(() => {
//     buttonRefs.forEach((ref, index) => {
//       if (ref.current) {
//         ref.current.measure((fx, fy, w, h, px, py) => {
//           setButtonLayouts(layouts => {
//             const newLayouts = [...layouts];
//             newLayouts[index] = { x: px, y: py, width: w, height: h };
//             console.log(newLayouts)
//             return newLayouts;
//           });
//         });
//       }
//     });
//   }, []);

//   const checkOverlap = (x, y) => {
//     buttonLayouts.forEach((layout, index) => {
//       if (
//         layout &&
//         x + 50 >= layout.x &&
//         x <= layout.x + layout.width &&
//         y + 50 >= layout.y &&
//         y <= layout.y + layout.height
//       ) {
//         runOnJS(handleButtonClick)(index);
//       }
//     });
//   };

//   const handleButtonClick = (index) => {
//     Alert.alert(`Button ${index + 1} clicked!`);
//   };

//   const panGesture = Gesture.Pan()
//     .onStart((event, context = {offsetX: 0, offsetY: 0}) => {
//       console.log("49",context.offsetX)
//       console.log("50",event)
//       context.offsetX = event.absoluteX - translateX.value;
//       context.offsetY = event.absoluteY - translateY.value;
//     })
//     .onUpdate((event, context = {offsetX: 0, offsetY: 0}) => {
//       translateX.value = event.absoluteX - context.offsetX;
//       translateY.value = event.absoluteY - context.offsetY;
//       runOnJS(checkOverlap)(translateX.value, translateY.value);
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//       ],
//     };
//   });

//   return (
//     <View style={styles.container}>
//       {buttonRefs.map((ref, index) => (
//         <View
//           key={index}
//           ref={ref}
//           style={[styles.buttonContainer, { top: height / 2 + 100 * index }]}
//           onLayout={() => {
//             if (ref.current) {
//               ref.current.measure((fx, fy, w, h, px, py) => {
//                 setButtonLayouts(layouts => {
//                   const newLayouts = [...layouts];
//                   newLayouts[index] = { x: px, y: py, width: w, height: h };
//                   return newLayouts;
//                 });
//               });
//             }
//           }}
//         >
//           <Button title={`Button ${index + 1}`} onPress={() => handleButtonClick(index)} />
//         </View>
//       ))}
//       <GestureDetector gesture={panGesture}>
//         <Animated.View style={[styles.indicator, animatedStyle]} />
//       </GestureDetector>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   indicator: {
//     width: 50,
//     height: 50,
//     backgroundColor: 'blue',
//     borderRadius: 25,
//     position: 'absolute',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     left: width / 2 - 50,
//     width: 100,
//     height: 50,
//   },
// });

// export default DraggableIndicator;


import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Button, Alert, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const DraggableIndicator = () => {
  const translateX = useSharedValue(width / 2 - 25);
  const translateY = useSharedValue(height / 2 - 25);
  const buttonRefs = useRef([]);
  const [buttonLayouts, setButtonLayouts] = useState([]);
  const handlers = useRef([]);

  useEffect(() => {
    const measureLayouts = () => {
      const newLayouts = buttonRefs.current.map((ref) => {
        return new Promise((resolve) => {
          if (ref) {
            ref.measure((fx, fy, w, h, px, py) => {
              resolve({ x: px, y: py, width: w, height: h });
            });
          } else {
            resolve(null);
          }
        });
      });

      Promise.all(newLayouts).then((layouts) => {
        setButtonLayouts(layouts.filter(Boolean));
      });
    };

    measureLayouts();
  }, []);

  const checkOverlap = (x, y) => {
    buttonLayouts.forEach((layout, index) => {
      if (
        layout &&
        x + 50 >= layout.x &&
        x <= layout.x + layout.width &&
        y + 50 >= layout.y &&
        y <= layout.y + layout.height
      ) {
        runOnJS(triggerButtonPress)(index);
      }
    });
  };

  const triggerButtonPress = (index) => {
    if (handlers.current[index]) {
      handlers.current[index]();
    }
  };

  const panGesture = Gesture.Pan()
    .onStart((event, context = { offsetX: 0, offsetY: 0 }) => {
      context.offsetX = event.absoluteX - translateX.value;
      context.offsetY = event.absoluteY - translateY.value;
    })
    .onUpdate((event, context = { offsetX: 0, offsetY: 0 }) => {
      translateX.value = event.absoluteX - context.offsetX;
      translateY.value = event.absoluteY - context.offsetY;
      runOnJS(checkOverlap)(translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((_, index) => (
        <View
          key={index}
          style={[styles.buttonContainer, { top: height / 2 + 100 * index }]}
          ref={(ref) => {
            buttonRefs.current[index] = ref;
            handlers.current[index] = () => Alert.alert(`Button ${index + 1} clicked!`);
          }}
          onLayout={() => {
            if (buttonRefs.current[index]) {
              buttonRefs.current[index].measure((fx, fy, w, h, px, py) => {
                setButtonLayouts((prevLayouts) => {
                  const newLayouts = [...prevLayouts];
                  newLayouts[index] = { x: px, y: py, width: w, height: h };
                  return newLayouts;
                });
              });
            }
          }}
        >
          <TouchableOpacity
            onPress={() => handlers.current[index] && handlers.current[index]()}
          >
            <View style={styles.button}>
              <Button
                title={`Button ${index + 1}`}
                onPress={() => Alert.alert(`Button ${index + 1} clicked!`)}
              />
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.indicator, animatedStyle]} />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
    position: 'absolute',
  },
  buttonContainer: {
    position: 'absolute',
    left: width / 2 - 50,
    width: 100,
    height: 50,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DraggableIndicator;
