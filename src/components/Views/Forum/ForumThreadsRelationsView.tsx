import React, {useCallback, useEffect, useState} from 'react';
import {ScrollingContentView} from '../Content/ScrollingContentView';
import {RefreshControl, View} from 'react-native';
import {LoadingView} from '../Static/LoadingView';
import {Text} from 'react-native-paper';
import {useTwitarr} from '../../Context/Contexts/TwitarrContext';
import {PaddedContentView} from '../Content/PaddedContentView';
import {ForumListDataActions} from '../../Reducers/Forum/ForumListDataReducer';
import {ForumThreadFlatList} from '../../Lists/Forums/ForumThreadFlatList';
import {ForumSortOrder} from '../../../libraries/Enums/ForumSortFilter';
import {useFilter} from '../../Context/Contexts/FilterContext';
import {ForumRelationQueryType, useForumRelationQuery} from '../../Queries/Forum/ForumRelationQueries';
import {CategoryData} from '../../../libraries/Structs/ControllerStructs';

export const ForumThreadsRelationsView = ({
  relationType,
  category,
}: {
  relationType: ForumRelationQueryType;
  category?: CategoryData;
}) => {
  const {forumSortOrder} = useFilter();
  const {
    data,
    refetch,
    isLoading,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useForumRelationQuery(relationType, {
    cat: category?.categoryID,
    sort: forumSortOrder !== ForumSortOrder.event ? forumSortOrder : undefined,
  });
  const [refreshing, setRefreshing] = useState(false);
  const {forumListData, dispatchForumListData} = useTwitarr();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  const handleLoadNext = () => {
    if (!isFetchingNextPage && hasNextPage) {
      setRefreshing(true);
      fetchNextPage().finally(() => setRefreshing(false));
    }
  };
  const handleLoadPrevious = () => {
    if (!isFetchingPreviousPage && hasPreviousPage) {
      setRefreshing(true);
      fetchPreviousPage().finally(() => setRefreshing(false));
    }
  };

  useEffect(() => {
    if (data && data.pages) {
      dispatchForumListData({
        type: ForumListDataActions.setList,
        threadList: data.pages.flatMap(p => p.forumThreads || []),
      });
    }
  }, [data, dispatchForumListData]);

  if (!data) {
    return <LoadingView />;
  }

  if (forumListData.length === 0) {
    return (
      <View>
        <ScrollingContentView
          isStack={true}
          refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />}>
          <PaddedContentView padTop={true}>
            <Text>There aren't any forums matching these filters.</Text>
          </PaddedContentView>
        </ScrollingContentView>
      </View>
    );
  }

  return (
    <View>
      <ForumThreadFlatList
        forumListData={forumListData}
        handleLoadNext={handleLoadNext}
        handleLoadPrevious={handleLoadPrevious}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </View>
  );
};
