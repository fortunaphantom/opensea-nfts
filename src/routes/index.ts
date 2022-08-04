import CreatePage from 'pages/CreatePage';
import LaunchPad from 'pages/LaunchPad';
import Home from 'pages/Home';

const routes: any[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/create',
    component: CreatePage,
  },
  {
    path: '/launch-pad/:chainId/:contractAddress',
    component: LaunchPad,
  },
];

export default routes;
