import {UserNotificationData} from '../../../libraries/Structs/ControllerStructs';
import {TokenAuthQueryOptionsType, useTokenAuthQuery} from '../TokenAuthQuery';

/**
 * Retrieve info on the number of each type of notification supported by Swiftarr.
 * Login not required, but may respond differently if logged in.
 */
export const useUserNotificationDataQuery = (options: TokenAuthQueryOptionsType<UserNotificationData> = {}) => {
  return useTokenAuthQuery<UserNotificationData>('/notification/global', {
    staleTime: 1000 * 30,
    ...options,
  });
};
