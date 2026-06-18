import React, { useEffect, useState } from 'react';
import { LuLoader, LuCircleCheck, LuTriangleAlert, LuSave } from 'react-icons/lu';
import httpClient from '@/helpers/httpClient';
import { useNavigate, useParams } from 'react-router';

const ProductEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [magasins, setMagasins] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // État du formulaire
  const [formData, setFormData] = useState({
    nom_pr: '',
    image: '',
    prix: '',
    quantite: '',
    id_magasin: '',
    desc: ''
  });

  // Charger les données (magasins + produit)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Charger les magasins
        const magasinsRes = await httpClient.get('magasins');
        setMagasins(magasinsRes.data);

        // Charger le produit
        const productRes = await httpClient.get(`produits/${id}`);
        const product = productRes.data;

        setFormData({
          nom_pr: product.nom_pr || '',
          image: product.image || '',
          prix: product.prix || '',
          quantite: product.quantite || '',
          id_magasin: product.id_magasin || '',
          desc: product.desc || ''
        });
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setMessage({ type: 'error', text: 'Impossible de charger les informations du produit.' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    // On gère à la fois l'ID (pour les inputs classiques) et le name (pour les select)
    const fieldName = name || id;

    // Mapping des IDs du formulaire vers les noms des champs de la BD
    const fieldMap = {
      'productNameInput': 'nom_pr',
      'productImage': 'image',
      'productPrice': 'prix',
      'qualityInput': 'quantite',
      'productDesc': 'desc',
      'magasinSelect': 'id_magasin'
    };

    const targetField = fieldMap[fieldName] || fieldName;
    setFormData(prev => ({ ...prev, [targetField]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_magasin) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un magasin.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      // Préparation des données avec conversion des types
      const submitData = {
        ...formData,
        prix: parseFloat(formData.prix),
        quantite: parseInt(formData.quantite)
      };

      await httpClient.put(`produits/${id}`, submitData);

      setMessage({ type: 'success', text: 'Produit mis à jour avec succès !' });

      // Redirection après 1.5s
      setTimeout(() => {
        navigate('/product-list');
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      const errorMsg = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body flex justify-center items-center py-20 text-primary">
          <LuLoader className="animate-spin size-8" />
          <span className="ms-2 text-lg">Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-12 col-span-1">
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <h6 className="mb-4 card-title text-lg font-bold text-default-800">Modifier le Produit : {formData.nom_pr}</h6>

          {message.text && (
            <div className={`mb-4 p-4 rounded flex items-center gap-2 ${message.type === 'error' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-success/10 text-success border border-success/20'}`}>
              {message.type === 'error' ? <LuTriangleAlert /> : <LuCircleCheck />}
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
            <div>
              <label htmlFor="productNameInput" className="inline-block mb-2 text-sm text-default-800 font-medium">
                Titre du Produit
              </label>
              <input
                id="productNameInput"
                type="text"
                className="form-input"
                placeholder="Titre du Produit"
                value={formData.nom_pr}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="productImage" className="inline-block mb-2 text-sm text-default-800 font-medium">
                URL de l'Image
              </label>
              <input
                id="productImage"
                type="text"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="magasinSelect" className="inline-block mb-2 text-sm text-default-800 font-medium">
                Magasin / Entrepôt
              </label>
              <select
                id="magasinSelect"
                name="id_magasin"
                className="form-input"
                value={formData.id_magasin}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un magasin</option>
                {magasins.map(m => (
                  <option key={m.id_magasin} value={m.id_magasin}>{m.nom_magasin}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div>
              <label htmlFor="qualityInput" className="inline-block mb-2 text-sm text-default-800 font-medium">
                Quantité en Stock
              </label>
              <input
                type="number"
                id="qualityInput"
                className="form-input"
                placeholder="0"
                value={formData.quantite}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="productPrice" className="inline-block mb-2 text-sm text-default-800 font-medium">
                Prix (DH)
              </label>
              <input
                type="number"
                id="productPrice"
                className="form-input"
                placeholder="0.00"
                value={formData.prix}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-5">
            <label htmlFor="productDesc" className="font-semibold text-default-800 text-sm">Description</label>
            <textarea
              id="productDesc"
              className="form-input"
              placeholder="Entrez la Description du produit..."
              rows={4}
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mt-6 flex gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => navigate('/product-list')}
              className="bg-default-200 text-default-800 btn hover:bg-default-300"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="text-white btn bg-primary flex items-center gap-2 min-w-[170px] justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <><LuLoader className="animate-spin" /> Mise à jour...</>
              ) : (
                <><LuSave className="size-4" /> Enregistrer les Modifications</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;
