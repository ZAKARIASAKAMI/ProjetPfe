import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuLoader, LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';

const AddWarehouse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    nom_magasin: '',
    adresse_mg: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      await httpClient.post('magasins', formData);
      
      setMessage({ type: 'success', text: 'Entrepôt ajouté avec succès !' });
      
      // Clean up after success or redirect
      setTimeout(() => {
        navigate('/(admin)/(app)/(warehouse)/list');
      }, 1500);
      
    } catch (err) {
      console.error('Erreur lors de l’ajout de l’entrepôt:', err);
      const errorMsg = err.response?.data?.message || 'Une erreur est survenue lors de l’ajout.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Ajouter un Entrepôt | FlowStock" />
      <main>
        <PageBreadcrumb title="Gestion des Entrepôts" subtitle="Ajouter un Entrepôt" />

        <div className="grid grid-cols-1">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-6">Informations de l'Entrepôt</h5>

              {message.text && (
                <div className={`mb-4 p-4 rounded flex items-center gap-2 ${message.type === 'error' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-success/10 text-success border border-success/20'}`}>
                  {message.type === 'error' ? <LuTriangleAlert /> : <LuCircleCheck />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nom_magasin" className="mb-2 block text-sm font-medium text-default-900">
                      Nom de l'Entrepôt
                    </label>
                    <input
                      type="text"
                      id="nom_magasin"
                      className="form-input"
                      placeholder="Ex: Entrepôt Principal"
                      value={formData.nom_magasin}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="adresse_mg" className="mb-2 block text-sm font-medium text-default-900">
                      Adresse de l'Entrepôt
                    </label>
                    <input
                      type="text"
                      id="adresse_mg"
                      className="form-input"
                      placeholder="Ex: 123 Rue de l'Industrie"
                      value={formData.adresse_mg}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setFormData({ nom_magasin: '', adresse_mg: '' })}
                    className="btn border-default-200 text-default-600 hover:bg-default-100"
                    disabled={submitting}
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="btn bg-primary text-white flex items-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><LuLoader className="animate-spin" /> Ajout en cours...</>
                    ) : (
                      <><LuPlus className="size-4" /> Ajouter l'Entrepôt</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddWarehouse;
