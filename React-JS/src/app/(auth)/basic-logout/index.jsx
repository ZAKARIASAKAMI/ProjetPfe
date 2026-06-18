import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/basic-login', { replace: true });
  }, [navigate]);

  return <PageMeta title="Déconnexion | FlowStock" />;
};

export default Index;
