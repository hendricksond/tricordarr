import {EventData, FezData} from '../../../libraries/Structs/ControllerStructs.tsx';
import React, {Dispatch, ReactElement, SetStateAction, useCallback} from 'react';
import {RefreshControlProps} from 'react-native';
import {CommonStackComponents, useCommonStack} from '../../Navigation/CommonScreens.tsx';
import {getScheduleItemMarker} from '../../../libraries/Schedule.ts';
import {useConfig} from '../../Context/Contexts/ConfigContext.ts';
import {EventCardListItem} from '../Items/Event/EventCardListItem.tsx';
import {PersonalEventCardListItem} from '../Items/PersonalEvent/PersonalEventCardListItem.tsx';
import {useCruise} from '../../Context/Contexts/CruiseContext.ts';
import useDateTime from '../../../libraries/DateTime.ts';
import {ScheduleFlatListBase} from './ScheduleFlatListBase.tsx';
import {ScheduleFlatListSeparator} from '../../../libraries/Types';
import {FlashList} from '@shopify/flash-list';
import {FezType} from '../../../libraries/Enums/FezType.ts';
import {FezCard} from '../../Cards/Schedule/FezCard.tsx';

interface ScheduleFlatListProps<TItem> {
  items: TItem[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  listRef: React.RefObject<FlashList<TItem>>;
  separator?: ScheduleFlatListSeparator;
  listHeader?: ReactElement;
  listFooter?: ReactElement;
  initialScrollIndex?: number;
  setRefreshing?: Dispatch<SetStateAction<boolean>>;
  onScrollThreshold?: (condition: boolean) => void;
}

export const ScheduleFlatList = <TItem extends EventData | FezData>({
  items,
  refreshControl,
  separator = 'time',
  listRef,
  setRefreshing,
  onScrollThreshold,
}: ScheduleFlatListProps<TItem>) => {
  const commonNavigation = useCommonStack();
  const {appConfig} = useConfig();
  const {startDate, endDate} = useCruise();
  const minutelyUpdatingDate = useDateTime('minute');

  // https://reactnative.dev/docs/optimizing-flatlist-configuration
  const renderItem = useCallback(
    ({item}: {item: TItem}) => {
      const marker = getScheduleItemMarker(item, appConfig.portTimeZoneID, minutelyUpdatingDate, startDate, endDate);
      if ('fezID' in item) {
        if (FezType.isLFGType(item.fezType)) {
          return (
            <FezCard
              fez={item}
              onPress={() =>
                commonNavigation.push(CommonStackComponents.lfgScreen, {
                  fezID: item.fezID,
                })
              }
              marker={marker}
              showIcon={true}
            />
          );
        } else {
          return (
            <PersonalEventCardListItem
              eventData={item}
              onPress={() => commonNavigation.push(CommonStackComponents.personalEventScreen, {eventID: item.fezID})}
              marker={marker}
            />
          );
        }
      } else if ('eventID' in item) {
        return (
          <EventCardListItem
            eventData={item}
            onPress={() => commonNavigation.push(CommonStackComponents.eventScreen, {eventID: item.eventID})}
            marker={marker}
            setRefreshing={setRefreshing}
          />
        );
      }
      return <></>;
    },
    [appConfig.portTimeZoneID, minutelyUpdatingDate, startDate, endDate, setRefreshing, commonNavigation],
  );

  const keyExtractor = (item: TItem) => {
    if ('fezID' in item) {
      return item.fezID;
    } else {
      return item.eventID;
    }
  };

  return (
    <ScheduleFlatListBase
      listRef={listRef}
      keyExtractor={keyExtractor}
      items={items}
      renderItem={renderItem}
      separator={separator}
      refreshControl={refreshControl}
      onScrollThreshold={onScrollThreshold}
      estimatedItemSize={120}
      extraData={minutelyUpdatingDate}
    />
  );
};
