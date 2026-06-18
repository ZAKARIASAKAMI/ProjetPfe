import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserCard from './components/UserCard';
import UserDetails from './components/UserDetails';
import httpClient from '@/helpers/httpClient';
import { LuLoader } from 'react-icons/lu';

const UserOverview = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`users/${id}`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur de chargement de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) return <div className="p-10 flex justify-center items-center"><LuLoader className="animate-spin size-10 text-primary" /></div>;
  if (error || !user) return <div className="p-10 text-center text-danger font-semibold">{error || 'Utilisateur non trouvé'}</div>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserCard user={user} />
        <UserDetails user={user} />
      </div>
    </div>
  );
};

export default UserOverview;
