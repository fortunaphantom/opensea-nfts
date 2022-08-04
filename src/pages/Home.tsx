import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Collection from 'components/Collection';
import { getAllCollections } from 'actions/collections';

interface IHome {}

const Home = (props: IHome) => {
  const collections = useSelector<any, ILaunchPadCollection[]>(state => state.collections.list);
  const dispatch = useDispatch() as any;

  useEffect(() => {
    dispatch(getAllCollections());
  }, [dispatch]);

  return (
    <ViewComponent>
      <Grid container spacing={2}>
        {collections.map(c => (
          <Grid key={c.Id} item xs={12} sm={6} md={3}>
            <Collection data={c} />
          </Grid>
        ))}
      </Grid>
    </ViewComponent>
  )
}

export default Home;

const ViewComponent = styled.div`
  display: flex;
  &>div {
    flex: 1;
  }
`;
