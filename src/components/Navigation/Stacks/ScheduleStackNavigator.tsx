import React from 'react';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScheduleStackComponents} from '../../../libraries/Enums/Navigation';
import {useNavigation} from '@react-navigation/native';
import {useStyles} from '../../Context/Contexts/StyleContext';
import {ScheduleDayScreen} from '../../Screens/Schedule/ScheduleDayScreen';
import {useDrawer} from '../../Context/Contexts/DrawerContext';
import {useCruise} from '../../Context/Contexts/CruiseContext';
import {ScheduleEventSearchScreen} from '../../Screens/Schedule/ScheduleEventSearchScreen';
import {ScheduleSettingsScreen} from '../../Screens/Schedule/ScheduleSettingsScreen';
import {LfgOwnedScreen} from '../../Screens/Schedule/LfgOwnedScreen';
import {LfgHelpScreen} from '../../Screens/Schedule/LfgHelpScreen';
import {LfgJoinedScreen} from '../../Screens/Schedule/LfgJoinedScreen';

export type ScheduleStackParamList = {
  ScheduleDayScreen: {
    cruiseDay: number;
  };
  ScheduleEventSearchScreen: undefined;
  ScheduleSettingsScreen: undefined;
  LfgOwnedScreen: undefined;
  LfgHelpScreen: undefined;
  LfgJoinedScreen: undefined;
};

export const ScheduleStackNavigator = () => {
  const {screenOptions} = useStyles();
  const Stack = createNativeStackNavigator<ScheduleStackParamList>();
  const {getLeftMainHeaderButtons} = useDrawer();
  const {cruiseDayToday} = useCruise();

  return (
    <Stack.Navigator
      initialRouteName={ScheduleStackComponents.scheduleDayScreen}
      screenOptions={{...screenOptions, headerShown: true}}>
      <Stack.Screen
        name={ScheduleStackComponents.scheduleDayScreen}
        component={ScheduleDayScreen}
        options={{
          headerLeft: getLeftMainHeaderButtons,
          title: 'Schedule',
        }}
        initialParams={{
          cruiseDay: cruiseDayToday,
        }}
      />
      <Stack.Screen
        name={ScheduleStackComponents.scheduleEventSearchScreen}
        component={ScheduleEventSearchScreen}
        options={{title: 'Search Events'}}
      />
      <Stack.Screen
        name={ScheduleStackComponents.scheduleSettingsScreen}
        component={ScheduleSettingsScreen}
        options={{title: 'Schedule Settings'}}
      />
      <Stack.Screen
        name={ScheduleStackComponents.lfgOwnedScreen}
        component={LfgOwnedScreen}
        options={{title: 'Owned LFGs'}}
      />
      <Stack.Screen
        name={ScheduleStackComponents.lfgHelpScreen}
        component={LfgHelpScreen}
        options={{title: 'Looking For Group FAQ'}}
      />
      <Stack.Screen
        name={ScheduleStackComponents.lfgJoinedScreen}
        component={LfgJoinedScreen}
        options={{title: 'Joined LFGs'}}
      />
    </Stack.Navigator>
  );
};

export const useScheduleStack = () => useNavigation<NativeStackNavigationProp<ScheduleStackParamList>>();
