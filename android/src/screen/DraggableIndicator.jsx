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
import { View, StyleSheet, Dimensions, Button, Alert, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const DraggableIndicator = () => {
  const translateX = useSharedValue(width / 2 - 25);
  const translateY = useSharedValue(height / 2 - 25);
  const elementRefs = useRef([]);
  const [elementLayouts, setElementLayouts] = useState([]);
  const handlers = useRef([]);

  useEffect(() => {
    const measureLayouts = () => {
      const newLayouts = elementRefs.current.map((ref) => {
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
        setElementLayouts(layouts.filter(Boolean));
      });
    };

    measureLayouts();
  }, []);

  const checkOverlap = (x, y) => {
    elementLayouts.forEach((layout, index) => {
      if (
        layout &&
        x + 50 >= layout.x &&
        x <= layout.x + layout.width &&
        y + 50 >= layout.y &&
        y <= layout.y + layout.height
      ) {
        runOnJS(triggerElementPress)(index);
      }
    });
  };

  const triggerElementPress = (index) => {
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

  const registerHandler = (index, handler) => {
    handlers.current[index] = handler;
  };

  const handlersClick = () => {
    Alert.alert("Click me pressed!");
  };

  return (
    <View style={styles.container}>
      {[
        { type: 'button', title: 'Button 1' },
        { type: 'button', title: 'Button 2' },
        { type: 'text', title: 'Text 1' },
        { type: 'text', title: 'Text 2' },
        { type: 'button', title: 'Click me' },  // Added click me element
      ].map((item, index) => (
        <View
          key={index}
          style={[styles.elementContainer, { top: height / 4 + 75 * index }]}
          ref={(ref) => {
            elementRefs.current[index] = ref;
            if (item.type === 'button') {
              registerHandler(index, () => Alert.alert(`${item.title} clicked!`));
            } else if (item.type === 'text') {
              registerHandler(index, () => Alert.alert(`${item.title} pressed!`));
            } else if (item.type === 'clickme') {
              registerHandler(index, handlersClick);
            }
          }}
          onLayout={() => {
            if (elementRefs.current[index]) {
              elementRefs.current[index].measure((fx, fy, w, h, px, py) => {
                setElementLayouts((prevLayouts) => {
                  const newLayouts = [...prevLayouts];
                  newLayouts[index] = { x: px, y: py, width: w, height: h };
                  return newLayouts;
                });
              });
            }
          }}
        >
          {item.type === 'button' ? (
            <TouchableOpacity
              onPress={() => handlers.current[index] && handlers.current[index]()}
            >
              <View style={styles.button}>
                <Button
                  title={item.title}
                  onPress={() => {
                    Alert.alert(`${item.title} clicked!`);
                  }}
                />
              </View>
            </TouchableOpacity>
          ) : item.type === 'text' ? (
            <TouchableOpacity
              onPress={() => handlers.current[index] && handlers.current[index]()}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handlersClick()}
            >
              <View style={{}}>
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
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
  elementContainer: {
    position: 'absolute',
    left: width / 4 - 50,
    width: 100,
    height: 50,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickMeContainer: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 50,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Ensure it does not interfere with indicator
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default DraggableIndicator;
