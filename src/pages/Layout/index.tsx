import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import routes from 'routes';
import styled from 'styled-components';

interface ILayout {}

const Layout = (props: ILayout) => {
  return (
    <LayoutComponent>
      <Router>
        <Header />
        <div className='layout-body'>
          <Routes>
            {routes.map((e) => (
              <Route key={e.path} path={e.path} element={React.createElement(e.component)} />
            ))}
            <Route
              path="*"
              element={<Navigate to="/" />}
            />
          </Routes>
        </div>
      </Router>
    </LayoutComponent>
  );
}

export default Layout;

const LayoutComponent = styled.div`
  .layout-body {
    padding: 10px;
  }
`;
