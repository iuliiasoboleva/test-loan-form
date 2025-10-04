import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FirstStep from './pages/FirstStep';
import SecondStep from './pages/SecondStep';
import ThirdStep from './pages/ThirdStep';
import { useFormContext } from './context/FormContext';
import { FormData } from './types';

const phoneRegex = /^0\d{3} \d{3} \d{3}$/;

function isStep1Complete(data: Partial<FormData>): boolean {
  return Boolean(
    data.phone && phoneRegex.test(data.phone) &&
    data.firstName && data.lastName &&
    (data.gender === 'Мужской' || data.gender === 'Женский')
  );
}

function isStep2Complete(data: Partial<FormData>): boolean {
  return Boolean(data.workplace && data.address);
}

function RequireStep1({ children }: { children: React.ReactElement }) {
  const { data } = useFormContext();
  if (!isStep1Complete(data)) {
    return <Navigate to="/step1" replace />;
  }
  return children;
}

function RequireStep1And2({ children }: { children: React.ReactElement }) {
  const { data } = useFormContext();

  if (!isStep1Complete(data)) {
    return <Navigate to="/step1" replace />;
  }
  if (!isStep2Complete(data)) {
    return <Navigate to="/step2" replace />;
  }
  return children;
}

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/step1" />} />
    <Route path="/step1" element={<FirstStep />} />
    <Route
      path="/step2"
      element={
        <RequireStep1>
          <SecondStep />
        </RequireStep1>
      }
    />
    <Route
      path="/step3"
      element={
        <RequireStep1And2>
          <ThirdStep />
        </RequireStep1And2>
      }
    />
    {/* Фоллбек на первый шаг, если маршрут не найден */}
    <Route path="*" element={<Navigate to="/step1" replace />} />
  </Routes>
);
