import React, { createContext, useContext, useState } from 'react';
import { FormData } from '../types';

type FormContextType = {
  data: Partial<FormData>;
  setFormValues: (values: Partial<FormData>) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Partial<FormData>>({});

  const setFormValues = (values: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  return (
    <FormContext.Provider value={{ data, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
};
