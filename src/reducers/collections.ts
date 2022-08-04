import { actionTypes } from 'utils/config';

const initialState = {
  list: [] as ILaunchPadCollection[]
};

const reducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.GET_ALL_COLLECTIONS: {
      state = { ...state, list: payload };
      break;
    }

    default:
      break;
  }

  return state;
};

export default reducer;
