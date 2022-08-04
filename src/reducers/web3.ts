import { actionTypes } from 'utils/config';

const initialState = {
  web3: null as any,
  selectedAddress: undefined as any,
};


const reducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.WALLET_CONNECTED: {
      state = {
        ...state,
        web3: payload,
        selectedAddress: window?.ethereum?.selectedAddress
      };
      break;
    }

    case actionTypes.WALLET_DISCONNECTED: {
      state = {
        ...state,
        web3: null,
        selectedAddress: null
      };
      break;
    }

    default:
      break;
  }

  return state;
};

export default reducer;
