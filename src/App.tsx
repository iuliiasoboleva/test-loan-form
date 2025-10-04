import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { FormProvider } from './context/FormContext';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <FormProvider>
      <HashRouter>
        <GlobalStyle />
        <AppRoutes />
      </HashRouter>
    </FormProvider>
  );
}

export default App;
