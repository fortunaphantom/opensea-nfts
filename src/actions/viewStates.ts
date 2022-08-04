import { actionTypes } from 'utils/config';

export const setLoading = (loading: boolean) => ({
  type: actionTypes.VIEW_STATE_LOADING,
  payload: loading
});
