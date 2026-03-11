import { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [formDataPayload, setFormDataPayload] = useState(null);
  const [mlResponse, setMlResponse] = useState(null);

  return (
    <DataContext.Provider value={{
      formDataPayload,
      setFormDataPayload,
      mlResponse,
      setMlResponse
    }}>
      {children}
    </DataContext.Provider>
  );
};
