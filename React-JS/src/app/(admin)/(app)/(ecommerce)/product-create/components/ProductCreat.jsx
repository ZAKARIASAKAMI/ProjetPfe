import React, { useEffect, useState } from 'react';
import { LuCloudUpload, LuLoader, LuCircleCheck, LuTriangleAlert, LuPlus } from 'react-icons/lu';
import httpClient from '@/helpers/httpClient';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [magasins, setMagasins] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // État du formulaire
  const [formData, setFormData] = useState({
    nom_pr: '',
    image: '',
    desc: '',
    prix: '',
    quantite: '',
    id_magasin: ''
  });

  // Charger les magasins au montage
  useEffect(() => {
    const fetchMagasins = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get('magasins');
        const magData = response.data.data || response.data;
        setMagasins(Array.isArray(magData) ? magData : []);
        
        if (Array.isArray(magData) && magData.length > 0) {
          setFormData(prev => ({ ...prev, id_magasin: magData[0].id_magasin }));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des magasins:', err);
        setMessage({ type: 'error', text: 'Impossible de charger les magasins.' });
      } finally {
        setLoading(false);
      }
    };
    fetchMagasins();
  }, []);

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

      await httpClient.post('produits', submitData);

      setMessage({ type: 'success', text: 'Produit créé avec succès !' });

      // Redirection après 1.5s
      setTimeout(() => {
        navigate('/stock/available');
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de la création:', err);
      const errorMsg = err.response?.data?.message || 'Une erreur est survenue lors de la création.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nom_pr: '',
      image: '',
      desc: '',
      prix: '',
      quantite: '',
      id_magasin: magasins.length > 0 ? magasins[0].id_magasin : ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="lg:col-span-12 col-span-1">
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <h6 className="mb-4 card-title text-lg font-bold">Créer un Nouveau Produit</h6>

          {message.text && (
            <div className={`mb-4 p-4 rounded flex items-center gap-2 ${
              message.type === 'error' 
                ? 'bg-danger/10 text-danger border border-danger/20' 
                : 'bg-success/10 text-success border border-success/20'
            }`}>
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
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-default-500 py-2">
                  <LuLoader className="animate-spin" /> Chargement...
                </div>
              ) : (
                <select
                  id="magasinSelect"
                  name="id_magasin"
                  className="form-input border-default-200"
                  value={formData.id_magasin}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un magasin</option>
                  {magasins.map(m => (
                    <option key={m.id_magasin} value={m.id_magasin}>{m.nom_magasin}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div>
              <label htmlFor="qualityInput" className="inline-block mb-2 text-sm text-default-800 font-medium">
                Quantité Initiale
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
                step="0.01"
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
              onClick={handleReset}
              className="bg-transparent text-danger btn border border-danger/30 hover:bg-danger/10"
              disabled={submitting}
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              className="text-white btn bg-primary flex items-center gap-2 min-w-[150px] justify-center"
              disabled={submitting || loading}
            >
              {submitting ? (
                <><LuLoader className="animate-spin" /> Création...</>
              ) : (
                <><LuPlus className="size-4" /> Créer le Produit</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;

