import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl} from 'react-native';
import {AppView} from '../../Views/AppView';
import {NotLoggedInView} from '../../Views/Static/NotLoggedInView';
import {LoadingView} from '../../Views/Static/LoadingView';
import {SeamailNewFAB} from '../../Buttons/FloatingActionButtons/SeamailNewFAB';
import {useSeamailListQuery} from '../../Queries/Fez/FezQueries';
import {usePrivilege} from '../../Context/Contexts/PrivilegeContext';
import {FezListActions} from '../../Reducers/Fez/FezListReducers';
import {useSocket} from '../../Context/Contexts/SocketContext';
import {NotificationTypeData, SocketNotificationData} from '../../../libraries/Structs/SocketStructs';
import {useTwitarr} from '../../Context/Contexts/TwitarrContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SeamailStackParamList} from '../../Navigation/Stacks/SeamailStack';
import {NavigatorIDs, SeamailStackScreenComponents} from '../../../libraries/Enums/Navigation';
import {useIsFocused} from '@react-navigation/native';
import {SeamailFlatList} from '../../Lists/Seamail/SeamailFlatList';
import {useAuth} from '../../Context/Contexts/AuthContext';
import {useUserNotificationData} from '../../Context/Contexts/UserNotificationDataContext';

type SeamailListScreenProps = NativeStackScreenProps<
  SeamailStackParamList,
  SeamailStackScreenComponents.seamailListScreen,
  NavigatorIDs.seamailStack
>;

export const SeamailListScreen = ({}: SeamailListScreenProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const {asPrivilegedUser} = usePrivilege();
  const {fezList, dispatchFezList, setFez, searchString} = useTwitarr();
  const {data, isLoading, refetch, isFetchingNextPage, hasNextPage, fetchNextPage} = useSeamailListQuery({
    forUser: asPrivilegedUser,
    search: searchString,
  });
  const {notificationSocket, closeFezSocket} = useSocket();
  const isFocused = useIsFocused();
  const {isLoggedIn} = useAuth();
  const {refetchUserNotificationData} = useUserNotificationData();

  const handleLoadNext = () => {
    if (!isFetchingNextPage && hasNextPage) {
      setRefreshing(true);
      fetchNextPage().finally(() => setRefreshing(false));
    }
  };

  useEffect(() => {
    if (data && data.pages) {
      dispatchFezList({
        type: FezListActions.set,
        fezList: data.pages.flatMap(p => p.fezzes),
      });
    }
  }, [data, dispatchFezList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      refetchUserNotificationData();
      setRefreshing(false);
    });
  }, [refetch, refetchUserNotificationData]);

  useEffect(() => {
    if (isLoggedIn) {
      onRefresh();
    }
  }, [asPrivilegedUser, searchString, onRefresh, isLoggedIn]);

  const notificationHandler = useCallback(
    (event: WebSocketMessageEvent) => {
      const socketMessage = JSON.parse(event.data) as SocketNotificationData;
      if (SocketNotificationData.getType(socketMessage) === NotificationTypeData.seamailUnreadMsg) {
        if (fezList.some(f => f.fezID === socketMessage.contentID)) {
          dispatchFezList({
            type: FezListActions.incrementPostCount,
            fezID: socketMessage.contentID,
          });
          dispatchFezList({
            type: FezListActions.moveToTop,
            fezID: socketMessage.contentID,
          });
        } else {
          // This is kinda a lazy way out, but it works.
          // Not using onRefresh() so that we don't show the sudden refreshing circle.
          // Hopefully that's a decent idea.
          refetch();
        }
      }
    },
    [dispatchFezList, fezList, refetch],
  );

  useEffect(() => {
    if (notificationSocket) {
      notificationSocket.addEventListener('message', notificationHandler);
    }
    return () => {
      if (notificationSocket) {
        notificationSocket.removeEventListener('message', notificationHandler);
      }
    };
  }, [notificationHandler, notificationSocket]);

  useEffect(() => {
    if (isFocused) {
      closeFezSocket();
      setFez(undefined);
    }
  }, [isFocused, closeFezSocket, setFez]);

  if (!isLoggedIn) {
    return <NotLoggedInView />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <AppView>
      <SeamailFlatList
        fezList={fezList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleLoadNext}
      />
      <SeamailNewFAB />
    </AppView>
  );
};
