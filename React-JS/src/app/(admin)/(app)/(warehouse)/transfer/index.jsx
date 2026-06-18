import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LuLoader, 
  LuCircleCheck, 
  LuTriangleAlert, 
  LuPackage, 
  LuWarehouse, 
  LuCalendar, 
  LuArrowLeftRight 
} from 'react-icons/lu';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';

const TransferProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Date par défaut : aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id_magasin_depart: '',
    id_produit: '',
    id_magasin_arrivee: '',
    quantite: '',
    date_mv: today
  });

  // Charger les produits et les magasins
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, magasinsRes] = await Promise.all([
          httpClient.get('produits?per_page=100'),
          httpClient.get('magasins')
        ]);

        const prodData = productsRes.data.data || productsRes.data;
        const magData = magasinsRes.data.data || magasinsRes.data;

        setProducts(Array.isArray(prodData) ? prodData : []);
        setMagasins(Array.isArray(magData) ? magData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setMessage({ 
          type: 'error', 
          text: 'Erreur lors du chargement des listes de produits ou de magasins. Vérifiez que le serveur est actif.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les produits appartenant au magasin de départ sélectionné
  const filteredProducts = products.filter(
    p => p.id_magasin === parseInt(formData.id_magasin_depart)
  );

  // Détecter le produit sélectionné pour afficher ses détails
  const selectedProduct = products.find(
    p => p.id_produit === parseInt(formData.id_produit)
  );

  const handleMagasinDepartChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      id_magasin_depart: val,
      // Réinitialiser le produit et le magasin d'arrivée si on change de magasin de départ
      id_produit: '',
      id_magasin_arrivee: prev.id_magasin_arrivee === val ? '' : prev.id_magasin_arrivee
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_magasin_depart) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un magasin de départ.' });
      return;
    }
    if (!formData.id_produit) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un produit.' });
      return;
    }
    if (!formData.id_magasin_arrivee) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un magasin de destination.' });
      return;
    }
    if (formData.id_magasin_depart === formData.id_magasin_arrivee) {
      setMessage({ type: 'error', text: 'Le magasin d\'arrivée doit être différent du magasin de départ.' });
      return;
    }
    if (!formData.quantite || parseInt(formData.quantite) <= 0) {
      setMessage({ type: 'error', text: 'La quantité doit être supérieure à 0.' });
      return;
    }
    if (selectedProduct && parseInt(formData.quantite) > selectedProduct.quantite) {
      setMessage({ 
        type: 'error', 
        text: `Stock insuffisant. Quantité maximale transférable : ${selectedProduct.quantite}` 
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const response = await httpClient.post('movements/transfer', {
        id_produit: parseInt(formData.id_produit),
        id_magasin_depart: parseInt(formData.id_magasin_depart),
        id_magasin_arrivee: parseInt(formData.id_magasin_arrivee),
        quantite: parseInt(formData.quantite),
        date_mv: formData.date_mv
      });

      setMessage({ 
        type: 'success', 
        text: 'Transfert de produit enregistré avec succès !' 
      });

      // Rediriger vers l'historique des mouvements après 1.5s
      setTimeout(() => {
        navigate('/movements');
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du transfert:', err);
      const errMsg = err.response?.data?.message || 'Une erreur est survenue lors du transfert.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Transférer des Produits | Gestion de Stock" />
      <main>
        <PageBreadcrumb title="Gestion des Entrepôts" subtitle="Transférer des Produits" />

        {loading ? (
          <div className="card p-10 flex flex-col justify-center items-center gap-3">
            <LuLoader className="size-8 animate-spin text-primary" />
            <span className="text-default-600 font-medium">Chargement des produits et magasins...</span>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Formulaire */}
            <div className="lg:col-span-8 col-span-12">
              <form onSubmit={handleSubmit} className="card">
                <div className="card-header border-b border-default-100 flex items-center gap-2.5">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <LuArrowLeftRight className="size-5" />
                  </div>
                  <div>
                    <h5 className="card-title text-base font-semibold">Formulaire de Transfert Inter-Dépôt</h5>
                    <p className="text-xs text-default-500">Transférer des produits d'un entrepôt à un autre</p>
                  </div>
                </div>

                <div className="card-body space-y-5">
                  {message.text && (
                    <div className={`p-4 rounded flex items-start gap-2.5 border text-sm ${
                      message.type === 'error' 
                        ? 'bg-danger/10 text-danger border-danger/20' 
                        : 'bg-success/10 text-success border-success/20'
                    }`}>
                      {message.type === 'error' ? (
                        <LuTriangleAlert className="size-5 shrink-0 mt-0.5" />
                      ) : (
                        <LuCircleCheck className="size-5 shrink-0 mt-0.5" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Magasin de départ */}
                    <div>
                      <label htmlFor="id_magasin_depart" className="block mb-2 text-sm text-default-800 font-medium">
                        Magasin de Départ
                      </label>
                      <div className="relative">
                        <select
                          id="id_magasin_depart"
                          name="id_magasin_depart"
                          value={formData.id_magasin_depart}
                          onChange={handleMagasinDepartChange}
                          className="form-input ps-10 border-default-200"
                          required
                        >
                          <option value="">Sélectionnez un entrepôt source</option>
                          {magasins.map(m => (
                            <option key={m.id_magasin} value={m.id_magasin}>
                              {m.nom_magasin} - {m.adresse_mg}
                            </option>
                          ))}
                        </select>
                        <LuWarehouse className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                    </div>

                    {/* Sélection du produit */}
                    <div>
                      <label htmlFor="id_produit" className="block mb-2 text-sm text-default-800 font-medium">
                        Produit à Transférer
                      </label>
                      <div className="relative">
                        <select
                          id="id_produit"
                          name="id_produit"
                          value={formData.id_produit}
                          onChange={handleChange}
                          className="form-input ps-10 border-default-200"
                          disabled={!formData.id_magasin_depart}
                          required
                        >
                          <option value="">
                            {!formData.id_magasin_depart 
                              ? 'Sélectionnez d\'abord le magasin de départ' 
                              : filteredProducts.length === 0 
                                ? 'Aucun produit disponible dans cet entrepôt' 
                                : 'Sélectionnez un produit'
                            }
                          </option>
                          {filteredProducts.map(p => (
                            <option key={p.id_produit} value={p.id_produit}>
                              {p.nom_pr} (Dispo: {p.quantite})
                            </option>
                          ))}
                        </select>
                        <LuPackage className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Magasin d'arrivée */}
                    <div>
                      <label htmlFor="id_magasin_arrivee" className="block mb-2 text-sm text-default-800 font-medium">
                        Magasin de Destination
                      </label>
                      <div className="relative">
                        <select
                          id="id_magasin_arrivee"
                          name="id_magasin_arrivee"
                          value={formData.id_magasin_arrivee}
                          onChange={handleChange}
                          className="form-input ps-10 border-default-200"
                          required
                        >
                          <option value="">Sélectionnez un entrepôt cible</option>
                          {magasins
                            .filter(m => m.id_magasin !== parseInt(formData.id_magasin_depart))
                            .map(m => (
                              <option key={m.id_magasin} value={m.id_magasin}>
                                {m.nom_magasin} - {m.adresse_mg}
                              </option>
                            ))}
                        </select>
                        <LuWarehouse className="absolute start-3.5 top-1/2 -translate-y-1/2 text-default-400 size-4.5" />
                      </div>
                    </div>

                    {/* Date du mouvement */}
                    <div>
                      <label htmlFor="date_mv" className="block mb-2 text-sm text-default-800 font-medium">
                        Date de Transfert
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

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Quantité */}
                    <div>
                      <label htmlFor="quantite" className="block mb-2 text-sm text-default-800 font-medium">
                        Quantité à Transférer
                      </label>
                      <input
                        type="number"
                        id="quantite"
                        name="quantite"
                        min="1"
                        max={selectedProduct ? selectedProduct.quantite : undefined}
                        placeholder="Ex: 10"
                        value={formData.quantite}
                        onChange={handleChange}
                        className="form-input"
                        disabled={!formData.id_produit}
                        required
                      />
                      {selectedProduct && (
                        <p className="text-xs text-default-500 mt-1">
                          Max transférable : <span className="font-semibold text-primary">{selectedProduct.quantite}</span> unités.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer border-t border-default-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      id_magasin_depart: '',
                      id_produit: '',
                      id_magasin_arrivee: '',
                      quantite: '',
                      date_mv: today
                    })}
                    className="btn border border-default-200 text-default-600 hover:bg-default-50"
                    disabled={submitting}
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="btn bg-primary text-white flex items-center gap-1.5 min-w-[150px] justify-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <LuLoader className="animate-spin size-4" /> Transfert...
                      </>
                    ) : (
                      <>
                        <LuArrowLeftRight className="size-4" /> Effectuer le Transfert
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Vue d'ensemble du produit sélectionné */}
            <div className="lg:col-span-4 col-span-12">
              <div className="card">
                <div className="card-header border-b border-default-100">
                  <h6 className="card-title text-sm">Aperçu du Produit Sélectionné</h6>
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
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="text-lg font-bold text-default-800">{selectedProduct.nom_pr}</h4>
                        <p className="text-sm text-default-500 mt-1">
                          {selectedProduct.desc || 'Aucune description disponible.'}
                        </p>
                      </div>

                      <div className="divide-y divide-default-100 pt-2">
                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Prix unitaire</span>
                          <span className="font-semibold text-default-800">{selectedProduct.prix} DH</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Stock de départ</span>
                          <span className={`font-semibold ${
                            selectedProduct.quantite <= 5 ? 'text-danger' : 'text-success'
                          }`}>
                            {selectedProduct.quantite} unités
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                          <span className="text-default-500">Magasin de départ</span>
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
                        Choisissez un entrepôt de départ puis un produit pour voir ses informations en temps réel.
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

export default TransferProducts;
