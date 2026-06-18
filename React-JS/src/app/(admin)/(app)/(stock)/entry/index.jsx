import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuLoader,
  LuCircleCheck,
  LuTriangleAlert,
  LuCirclePlus,
  LuMinus,
  LuPackage,
  LuWarehouse,
  LuCalendar,
  LuArrowDownLeft,
} from 'react-icons/lu';

import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';
import { getApiErrorMessage } from '@/helpers/apiError';

const RecordEntry = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id_produit: '',
    id_magasin: '',
    quantite: '',
    date_mv: today,
    type: 'Entrée',
  });

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsRes, magasinsRes] = await Promise.all([
          httpClient.get('produits?per_page=100'),
          httpClient.get('magasins'),
        ]);

        const prodData = productsRes.data.data || productsRes.data;
        const magData = magasinsRes.data.data || magasinsRes.data;

        setProducts(Array.isArray(prodData) ? prodData : []);
        setMagasins(Array.isArray(magData) ? magData : []);
      } catch (err) {
        console.error(err);

        setMessage({
          type: 'error',
          text: 'Erreur lors du chargement des produits et magasins.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Produit sélectionné
  const selectedProduct = products.find(p => String(p.id_produit) === String(formData.id_produit));

  // Magasin du produit
  const productMagasins = selectedProduct
    ? magasins.filter(m => String(m.id_magasin) === String(selectedProduct.id_magasin))
    : [];

  // Changement produit
  const handleProductChange = e => {
    const productId = e.target.value;

    const prod = products.find(p => String(p.id_produit) === String(productId));

    setFormData(prev => ({
      ...prev,
      id_produit: productId,
      id_magasin: prod ? String(prod.id_magasin) : '',
    }));
  };

  // Changement input
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.id_produit) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner un produit.',
      });
      return;
    }

    if (!formData.id_magasin) {
      setMessage({
        type: 'error',
        text: "Le produit sélectionné n'est pas associé à un magasin valide.",
      });
      return;
    }

    if (!formData.quantite || parseInt(formData.quantite, 10) <= 0) {
      setMessage({
        type: 'error',
        text: 'La quantité doit être supérieure à 0.',
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const payload = {
        type: 'Entrée',
        date_mv: formData.date_mv,
        id_produit: parseInt(formData.id_produit, 10),
        id_magasin: parseInt(formData.id_magasin, 10),
        quantite: parseInt(formData.quantite, 10),
      };

      await httpClient.post('movements', payload);

      setMessage({
        type: 'success',
        text: 'Entrée de stock enregistrée avec succès.',
      });

      setTimeout(() => {
        navigate('/movements');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: getApiErrorMessage(err, "Erreur lors de l'enregistrement de l'entrée."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Enregistrer une Entrée | Gestion de Stock" />

      <main>
        <PageBreadcrumb title="Gestion de Stock" subtitle="Enregistrer une Entrée" />

        {loading ? (
          <div className="card p-10 flex flex-col justify-center items-center gap-3">
            <LuLoader className="size-8 animate-spin text-primary" />
            <span className="text-default-600 font-medium">
              Chargement des produits et magasins...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Formulaire */}
            <div className="lg:col-span-8 col-span-12">
              <form onSubmit={handleSubmit} className="card">
                <div className="card-header border-b border-default-100 flex items-center gap-2.5">
                  <div className="p-2 rounded bg-success/10 text-success">
                    <LuArrowDownLeft className="size-5" />
                  </div>

                  <div>
                    <h5 className="card-title text-base font-semibold">
                      Formulaire d'Entrée de Stock
                    </h5>

                    <p className="text-xs text-default-500">
                      Ajouter du stock pour un produit existant
                    </p>
                  </div>
                </div>

                <div className="card-body space-y-5">
                  {message.text && (
                    <div
                      className={`p-4 rounded flex items-start gap-2.5 border text-sm ${
                        message.type === 'error'
                          ? 'bg-danger/10 text-danger border-danger/20'
                          : 'bg-success/10 text-success border-success/20'
                      }`}
                    >
                      {message.type === 'error' ? (
                        <LuTriangleAlert className="size-5 shrink-0 mt-0.5" />
                      ) : (
                        <LuCircleCheck className="size-5 shrink-0 mt-0.5" />
                      )}

                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Produit */}
                    <div>
                      <label
                        htmlFor="id_produit"
                        className="block mb-2 text-sm text-default-800 font-medium"
                      >
                        Produit
                      </label>

                      <div className="relative">
                        <select
                          id="id_produit"
                          name="id_produit"
                          value={formData.id_produit}
                          onChange={handleProductChange}
                          className="form-input ps-10 border-default-200 focus:border-success/50"
                          required
                        >
                          <option value="">Sélectionnez un produit</option>

                          {products.map(p => (
                            <option key={p.id_produit} value={p.id_produit}>
                              {p.nom_pr}
                            </option>
                          ))}
                        </select>

                        <LuPackage className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                    </div>

                    {/* Magasin */}
                    <div>
                      <label
                        htmlFor="id_magasin"
                        className="block mb-2 text-sm text-default-800 font-medium"
                      >
                        Magasin de Destination
                      </label>

                      <div className="relative">
                        <select
                          id="id_magasin"
                          name="id_magasin"
                          value={formData.id_magasin}
                          onChange={handleChange}
                          className="form-input ps-10 border-default-200 bg-default-50 opacity-80"
                          required
                          disabled={true}
                        >
                          <option value="">
                            {formData.id_produit ? 'Magasin associé' : 'Sélectionnez un produit'}
                          </option>

                          {(formData.id_produit ? productMagasins : magasins).map(m => (
                            <option key={m.id_magasin} value={m.id_magasin}>
                              {m.nom_magasin}
                            </option>
                          ))}
                        </select>

                        <LuWarehouse className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                      {formData.id_produit && productMagasins.length === 0 && (
                        <p className="text-xs text-danger mt-1">Aucun magasin trouvé pour ce produit.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Quantité */}
                    <div>
                      <label
                        htmlFor="quantite"
                        className="block mb-2 text-sm text-default-800 font-medium"
                      >
                        Quantité à Ajouter
                      </label>

                      <input
                        type="number"
                        id="quantite"
                        name="quantite"
                        min="1"
                        value={formData.quantite}
                        onChange={handleChange}
                        className="form-input focus:border-success/50"
                        placeholder="Ex: 50"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="date_mv"
                        className="block mb-2 text-sm text-default-800 font-medium"
                      >
                        Date de Réception
                      </label>

                      <div className="relative">
                        <input
                          type="date"
                          id="date_mv"
                          name="date_mv"
                          value={formData.date_mv}
                          onChange={handleChange}
                          className="form-input ps-10"
                          required
                        />

                        <LuCalendar className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer border-t border-default-100 flex justify-end gap-3">
                  <button
                    type="button"
                    className="btn border border-default-200 hover:bg-default-50"
                    disabled={submitting}
                    onClick={() => {
                      setFormData({
                        id_produit: '',
                        id_magasin: '',
                        quantite: '',
                        date_mv: today,
                        type: 'Entrée',
                      });
                      setMessage({ type: '', text: '' });
                    }}
                  >
                    Réinitialiser
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn bg-success text-white flex items-center gap-2 min-w-[160px] justify-center hover:bg-success-600 transition-all"
                  >
                    {submitting ? (
                      <>
                        <LuLoader className="animate-spin size-4" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <LuCirclePlus className="size-4" />
                        Enregistrer l'Entrée
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Aperçu */}
            <div className="lg:col-span-4 col-span-12">
              <div className="card">
                <div className="card-header border-b border-default-100">
                  <h6 className="card-title text-sm">Aperçu du Produit</h6>
                </div>

                <div className="card-body">
                  {selectedProduct ? (
                    <div className="space-y-4">
                      {selectedProduct.image && (
                        <div className="h-44 w-full rounded-lg overflow-hidden bg-default-50 border border-default-100 flex items-center justify-center">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.nom_pr}
                            className="h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="text-lg font-bold text-default-800">
                          {selectedProduct.nom_pr}
                        </h4>

                        <p className="text-sm text-default-500 mt-1 line-clamp-2">
                          {selectedProduct.desc || 'Aucune description disponible'}
                        </p>
                      </div>

                      <div className="divide-y divide-default-100 pt-2">
                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Prix unitaire</span>

                          <span className="font-semibold text-default-800">
                            {selectedProduct.prix} DH
                          </span>
                        </div>

                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Stock actuel</span>

                          <span className="font-semibold text-success">
                            {selectedProduct.quantite} unités
                          </span>
                        </div>

                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Magasin actuel</span>

                          <span className="text-default-700 font-medium">
                            {selectedProduct.magasin?.nom_magasin || 'Non spécifié'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-default-400 space-y-2">
                      <LuPackage className="size-10 mx-auto opacity-40 text-default-500" />

                      <p className="text-sm font-medium">Aucun produit sélectionné</p>

                      <p className="text-xs max-w-[200px] mx-auto">
                        Choisissez un produit pour voir ses détails techniques et son stock actuel.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>

  );
};

export default RecordEntry;
