import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '~/services/api';
import { useAuth } from './AuthContext';

const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const fetchOrganizationSettings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/admin/organization');
      setOrganization(response.data);
      if (response.data.currency) {
        setCurrencySymbol(response.data.currency);
      }
    } catch (error) {
      console.error('Error fetching organization settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrganizationSettings();
  }, [fetchOrganizationSettings]);

  const updateCurrency = async (newCurrency) => {
    try {
      const response = await axiosInstance.put('/admin/organization', { currency: newCurrency });
      setOrganization(response.data);
      setCurrencySymbol(response.data.currency);
      return { success: true };
    } catch (error) {
      console.error('Error updating currency:', error);
      return { success: false, error };
    }
  };

  return (
    <OrganizationContext.Provider value={{ organization, currencySymbol, updateCurrency, refreshOrganization: fetchOrganizationSettings, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
