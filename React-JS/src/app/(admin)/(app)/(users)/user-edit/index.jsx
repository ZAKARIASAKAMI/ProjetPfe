import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserEditForm from './components/UserEditForm';
import httpClient from '@/helpers/httpClient';
import { LuLoader } from 'react-icons/lu';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleSubmit = async (formData) => {
    try {
      await httpClient.put(`users/${id}`, {
        nom_ut: formData.name,
        email: formData.email,
      });
      navigate('/users-list');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div className="p-10 flex justify-center items-center"><LuLoader className="animate-spin size-10 text-primary" /></div>;
  if (error || !user) return <div className="p-10 text-center text-danger font-semibold">{error || 'Utilisateur non trouvé'}</div>;

  return (
    <div className="p-6">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Modifier l'utilisateur</h4>
        </div>
        <div className="card-body">
          <UserEditForm user={user} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
