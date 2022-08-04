import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'actions/viewStates';
import { NotificationManager } from 'components/Notification';
import { useParams } from 'react-router-dom';
import { getCollectionApi } from 'utils/api';
import Collection from 'components/Collection';
import contractAbi from 'contracts/Nfty_Nft.json';
import Web3 from 'web3';

interface ILaunchPad {}

const LaunchPad = (props: ILaunchPad) => {
  const {chainId, contractAddress} = useParams();
  const [collection, setCollection] = useState<ILaunchPadCollection | null>(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [contract, setContract] = useState<any>();
  const web3 = useSelector<any, any>(state => state.web3.web3);
  const dispatch = useDispatch() as any;

  useEffect(() => {
    if (chainId && contractAddress) {
      getCollectionApi(Number(chainId || "0"), contractAddress || "").then((res) => {
        setCollection(res.data);
      }, err => {console.warn();
        setCollection(null);
      })
    }
  }, [chainId, contractAddress]);

  useEffect(() => {
    (async function() {
      if (chainId && contractAddress && web3) {
        const _contract = new web3.eth.Contract(
          contractAbi as any,
          contractAddress
        );
        setContract(_contract);
        const totalSupply_ = await _contract.methods.totalSupply().call();
        setTotalSupply(totalSupply_);
      }
    })();
  }, [chainId, contractAddress, web3]);

  const onMint = async () => {
    if (!web3) {
      NotificationManager.warning("Not connected to metamask", "Not connected");
      return;
    }

    if (!contractAddress || !chainId || !collection) {
      NotificationManager.warning("You are going to mint invalid collection", "Invalid collection");
      return;
    }

    const contract = new web3.eth.Contract(
      contractAbi as any,
      contractAddress
    );
    dispatch(setLoading(true));
    try {
      const tx = {
        from: window.ethereum.selectedAddress,
        to: contractAddress,
        value: Web3.utils.toWei(String(collection?.Price)),
        data: contract.methods.mint().encodeABI(),
      };

      console.log(tx);
      await web3.eth.sendTransaction(tx);
      NotificationManager.success("Done", "Done");

      if (contract) {
        const totalSupply_ = await contract.methods.totalSupply().call();
        setTotalSupply(totalSupply_);
      }
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading(false));
  }

  return (<MintComponent>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        {!!collection && <Collection data={collection} />}
      </Grid>
      <Grid item xs={8} className='content'>
        <div className='total-supply'>Total minted: {totalSupply}</div>
        <Button onClick={onMint} variant="contained">Mint asset</Button>
      </Grid>
    </Grid>
  </MintComponent>)
}

export default LaunchPad;

const MintComponent = styled.div`
  .content {
    .total-supply {
      padding: 8px 0 0 0;
      margin: 0 0 20px 0;
    }
  }
`;
