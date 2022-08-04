import { actionTypes } from 'utils/config';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
      bridge: "https://bridge.walletconnect.org/",
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: false, // optional
  providerOptions, // required
});

let web3: any;

export const connectWallet = () => (dispatch: any) => {
  return new Promise((resolve, reject) => {
      web3Modal
        .connect()
        .then(
          (providerRes: any) => {
            web3 = new Web3(providerRes);
            dispatch({
              type: actionTypes.WALLET_CONNECTED,
              payload: web3,
            });
            resolve(web3);
          },
          (err: any) => {
          }
        )
        .catch((reason: any) => {
        });
        
  });
};


export const disconnectWallet = () => async (dispatch: any) => {
  await web3Modal.clearCachedProvider();
  dispatch({
    type: actionTypes.WALLET_DISCONNECTED,
    payload: null
  });
};
