import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { FormProvider } from './context/FormContext';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <GlobalStyle />
        <AppRoutes />
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;
