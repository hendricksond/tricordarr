import {
  check as checkPermission,
  request as requestPermission,
  requestMultiple,
  RESULTS,
  PERMISSIONS,
} from 'react-native-permissions';
import {Alert, Linking, BackHandler} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export class AppPermissions {
  permission: any;
  title: string;
  description: string;
  onChange: () => void;

  static NOTIFICATIONS = new AppPermissions(
    PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    'Notifications',
    'Show Twitarr notifications on this device.',
  );

  // https://github.com/react-native-netinfo/react-native-netinfo/issues/593
  // If NetInfo.fetch() was called before permissions were given the current wifi
  // would be undefined. This ensures the cached information gets refreshed
  // when the permission gets granted.
  static LOCATION = new AppPermissions(
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    'Location',
    "Determine if you're on the boat by looking at the WiFi network. Helps conserve battery.",
    () => NetInfo.refresh(),
  );

  constructor(permission: any, title: string, description: string, onChange: () => void = () => {}) {
    this.permission = permission;
    this.title = title;
    this.description = description;
    this.onChange = onChange;
  }

  // https://github.com/zoontek/react-native-permissions
  async check() {
    const result = await checkPermission(this.permission);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
    return result;
  }

  // This is a no-op if the permission is already granted.
  async request() {
    return await requestPermission(this.permission);
  }

  static requestRequiredPermissions = async () => {
    let perm = [PERMISSIONS.ANDROID.POST_NOTIFICATIONS, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    let permissionStatuses = await requestMultiple(perm);

    if (permissionStatuses[perm[0]] !== RESULTS.GRANTED || permissionStatuses[perm[1]] !== RESULTS.GRANTED) {
      Alert.alert(
        'Insufficient permissions!',
        'This app requires both Notifications and Precise Location permissions. Please enable them in the app settings',
        [
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ],
      );
      return false;
    }
    return true;
  };
}
