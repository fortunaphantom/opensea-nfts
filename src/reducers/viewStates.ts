import { actionTypes } from 'utils/config';

const initialState = {
  loading: false
};

const reducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.VIEW_STATE_LOADING: {
      state = { ...state, loading: payload };
      break;
    }

    default:
      break;
  }

  return state;
};

export default reducer;
