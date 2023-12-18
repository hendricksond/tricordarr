// https://www.reddit.com/r/typescript/comments/vdk8we/is_there_a_type_for_objects_with_arbitrary_keys/
import {EventType} from '../Enums/EventType';
import {FezType} from '../Enums/FezType';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {GestureResponderEvent, StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface KvObject {
  [key: string]: string | null;
}

export type StringOrError = string | Error;

// Taken from the WebSocket class.
export type WebSocketOptions = {
  headers: {[headerName: string]: string};
  [optionName: string]: any;
} | null;

export type KeywordAction = 'add' | 'remove';

export type KeywordType = 'alertwords' | 'mutewords';

export type CruiseDayData = {
  date: Date;
  cruiseDay: number;
};

export type CruiseDayTime = {
  dayMinutes: number;
  cruiseDay: number;
};

export type ScheduleFilterSettings = {
  eventTypeFilter?: keyof typeof EventType;
  eventFavoriteFilter?: boolean;
  lfgTypeFilter?: keyof typeof FezType;
  showJoinedLfgs?: boolean;
  showOpenLfgs?: boolean;
};

export type ScheduleCardMarkerType = 'now' | 'soon' | undefined;

export interface ImageQueryData {
  base64?: string;
  mimeType: string;
  dataURI: string;
  fileName: string;
}

export interface SegmentedButtonType {
  value: string;
  icon?: IconSource;
  disabled?: boolean;
  accessibilityLabel?: string;
  checkedColor?: string;
  uncheckedColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
  label?: string;
  showSelectedCheck?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}
