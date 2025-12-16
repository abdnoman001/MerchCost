import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InputScreen from './src/screens/InputScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Input">
        <Stack.Screen
          name="Input"
          component={InputScreen}
          options={{ title: 'New Cost Sheet' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Cost Breakdown' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

