import React from 'react';
import Loader from 'components/Loader';
import { useSelector } from 'react-redux';
import Layout from 'pages/Layout';
import {NotificationContainer} from 'components/Notification';
import 'react-notifications/lib/notifications.css';

function App() {
  const loading = useSelector((store: any) => store.viewStates.loading);

  return (
    <div className="App">
      <Layout />
      <NotificationContainer />
      {loading && <Loader />}
    </div>
  );
}

export default App;
