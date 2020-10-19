import React from 'react';
import Routes from './routes/routes'
import { SideBarProvider } from './contexts/SideBarContext'
import { AuthProvider } from './contexts/auth'
import  { SelectionListProvider } from './contexts/SelectionListContext'

import './assets/styles/global.css';

function App() {
  return (

    <AuthProvider>
      <SideBarProvider>
        <SelectionListProvider>
          <Routes />
        </SelectionListProvider>
      </SideBarProvider>
    </AuthProvider>
  );
}

export default App;
