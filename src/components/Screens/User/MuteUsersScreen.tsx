import React from 'react';
import {AppView} from '../../Views/AppView';
import {ScrollingContentView} from '../../Views/Content/ScrollingContentView';
import {PaddedContentView} from '../../Views/Content/PaddedContentView';
import {UserSearchBar} from '../../Search/UserSearchBar';
import {UserHeader} from '../../../libraries/Structs/ControllerStructs';
import {Text} from 'react-native-paper';
import {RefreshControl} from 'react-native';
import {usePrivilege} from '../../Context/Contexts/PrivilegeContext';
import {UserListItem} from '../../Lists/Items/UserListItem';
import {AppIcons} from '../../../libraries/Enums/Icons';
import {ModeratorMuteText, UserMuteText} from '../../Text/UserRelationsText';
import {useUserMutesQuery} from '../../Queries/Users/UserMuteQueries.ts';
import {ItalicText} from '../../Text/ItalicText';
import {LoadingView} from '../../Views/Static/LoadingView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CommonStackComponents, CommonStackParamList} from '../../Navigation/CommonScreens';
import {useUserMuteMutation} from '../../Queries/Users/UserMuteMutations.ts';
import {useQueryClient} from '@tanstack/react-query';

type Props = NativeStackScreenProps<CommonStackParamList, CommonStackComponents.muteUsers>;
export const MuteUsersScreen = ({navigation}: Props) => {
  const {hasModerator} = usePrivilege();
  const userMuteMutation = useUserMuteMutation();
  const {data, isFetching, refetch} = useUserMutesQuery();
  const queryClient = useQueryClient();

  const handleUnmuteUser = (userHeader: UserHeader) => {
    userMuteMutation.mutate(
      {
        action: 'unmute',
        userID: userHeader.userID,
      },
      {
        onSuccess: async () => {
          const invalidations = UserHeader.getRelationKeys().map(key => {
            return queryClient.invalidateQueries(key);
          });
          await Promise.all(invalidations);
        },
      },
    );
  };

  const handleMuteUser = (userHeader: UserHeader) => {
    userMuteMutation.mutate(
      {
        action: 'mute',
        userID: userHeader.userID,
      },
      {
        onSuccess: async () => {
          const invalidations = UserHeader.getRelationKeys().map(key => {
            return queryClient.invalidateQueries(key);
          });
          await Promise.all(invalidations);
        },
      },
    );
  };

  if (data === undefined) {
    return <LoadingView />;
  }

  return (
    <AppView>
      <ScrollingContentView
        refreshControl={<RefreshControl refreshing={isFetching || userMuteMutation.isLoading} onRefresh={refetch} />}>
        <PaddedContentView>
          <UserMuteText />
          {hasModerator && <ModeratorMuteText />}
        </PaddedContentView>
        <PaddedContentView>
          <UserSearchBar excludeHeaders={data} onPress={handleMuteUser} />
        </PaddedContentView>
        <PaddedContentView>
          <Text variant={'labelMedium'}>Muted Users:</Text>
          {data.length === 0 && <ItalicText>You have not muted any users.</ItalicText>}
          {data.map((relatedUserHeader, i) => (
            <UserListItem
              key={i}
              userHeader={relatedUserHeader}
              buttonIcon={AppIcons.unmute}
              onPress={() =>
                navigation.push(CommonStackComponents.userProfileScreen, {
                  userID: relatedUserHeader.userID,
                })
              }
              buttonOnPress={handleUnmuteUser}
            />
          ))}
        </PaddedContentView>
      </ScrollingContentView>
    </AppView>
  );
};
