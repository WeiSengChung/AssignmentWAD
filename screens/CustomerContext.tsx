import React, { createContext, useState } from 'react';

// Create the context
export const CustomerContext = createContext(null);

// Create a provider component
export const CustomerProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(null); // This will hold the customer ID
  
  return (
    <CustomerContext.Provider value={{ customerId, setCustomerId }}>
      {children}
    </CustomerContext.Provider>
  );
};