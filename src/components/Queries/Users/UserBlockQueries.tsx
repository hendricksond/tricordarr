import axios, {AxiosError, AxiosResponse} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {ErrorResponse, UserHeader} from '../../../libraries/Structs/ControllerStructs';
import {useTokenAuthQuery} from '../TokenAuthQuery';

interface UserBlockMutationProps {
  userID: string;
  action: 'block' | 'unblock';
}

const queryHandler = async ({userID, action}: UserBlockMutationProps): Promise<AxiosResponse<void>> => {
  return await axios.post(`/users/${userID}/${action}`);
};

export const useUserBlockMutation = (retry = 0) => {
  return useMutation<AxiosResponse<void>, AxiosError<ErrorResponse>, UserBlockMutationProps>(queryHandler, {
    retry: retry,
  });
};

export const useUserBlocksQuery = () => {
  return useTokenAuthQuery<UserHeader[]>({
    queryKey: ['/users/blocks'],
  });
};
