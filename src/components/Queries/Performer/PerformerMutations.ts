import {useTokenAuthMutation} from '../TokenAuthMutation';
import {useSwiftarrQueryClient} from '../../Context/Contexts/SwiftarrQueryClientContext.ts';
import {PerformerUploadData} from '../../../libraries/Structs/ControllerStructs.tsx';

export const usePerformerUpsertMutation = () => {
  const {apiPost} = useSwiftarrQueryClient();

  interface QueryHandlerProps {
    eventID: string;
    performerData: PerformerUploadData;
  }

  const queryHandler = async (props: QueryHandlerProps) => {
    return await apiPost(`/performer/forevent/${props.eventID}`, props.performerData);
  };

  return useTokenAuthMutation(queryHandler);
};

export const usePerformerDeleteForEventMutation = () => {
  const {apiDelete} = useSwiftarrQueryClient();

  interface QueryHandlerProps {
    eventID: string;
  }

  const queryHandler = async (props: QueryHandlerProps) => {
    return await apiDelete(`/performer/forevent/${props.eventID}`);
  };

  return useTokenAuthMutation(queryHandler);
};

export const usePerformerDeleteMutation = () => {
  const {apiDelete} = useSwiftarrQueryClient();

  interface QueryHandlerProps {
    performerID?: string;
  }

  // Deleting self is a user thing. Deleting by ID is a Moderator thing.
  const queryHandler = async ({performerID = 'self'}: QueryHandlerProps) => {
    return await apiDelete(`/performer/${performerID}`);
  };

  return useTokenAuthMutation(queryHandler);
};
