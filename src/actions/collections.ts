import api from 'utils/api';
import { actionTypes } from 'utils/config';

export const getAllCollections = () => (dispatch: any) => {
  return new Promise((resolve, reject) => {
      api.get("/launch-pad-collections").then((res) => {
        dispatch({
          type: actionTypes.GET_ALL_COLLECTIONS,
          payload: res.data
        });
        resolve(res);
      }, (err) => {
        reject(err);
      }).catch((reason: any) => {
        reject(reason);
      });
  });
};
