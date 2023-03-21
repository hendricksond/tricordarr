import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-paper';
import {SeamailView} from '../../Screens/Seamail/Seamail';

export const SeamailStack = () => {
  const Stack = createNativeStackNavigator();
  const theme = useTheme();
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTitleStyle: {
      color: theme.colors.onBackground,
    },
    headerTintColor: theme.colors.onBackground,
  };

  return (
    <Stack.Navigator initialRouteName={'SeamailScreen'} screenOptions={screenOptions}>
      <Stack.Screen name={'SeamailScreen'} component={SeamailView} options={{title: 'Seamail'}} />
    </Stack.Navigator>
  );
};