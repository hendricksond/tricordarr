import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CommonStackComponents, CommonStackParamList} from '../../../Navigation/CommonScreens';
import {ForumThreadScreenBase} from './ForumThreadScreenBase';
import {useForumThreadQuery} from '../../../Queries/Forum/ForumThreadQueries.ts';

type Props = NativeStackScreenProps<CommonStackParamList, CommonStackComponents.forumThreadScreen>;
export const ForumThreadScreen = ({route}: Props) => {
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useForumThreadQuery(route.params.forumID);

  return (
    <ForumThreadScreenBase
      data={data}
      refetch={refetch}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      fetchPreviousPage={fetchPreviousPage}
      isFetchingNextPage={isFetchingNextPage}
      isFetchingPreviousPage={isFetchingPreviousPage}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      invertList={route.params.forumListData?.postCount === route.params.forumListData?.readCount}
      forumListData={route.params.forumListData}
    />
  );
};
