import { useEffect, useState } from 'react';
import { LuTriangleAlert, LuCircleCheck, LuLoader } from 'react-icons/lu';
import httpClient from '@/helpers/httpClient';

const AvailableStockList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get('produits');
      // On s'assure de récupérer les données que ce soit paginé (response.data.data) ou non (response.data)
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Impossible de communiquer avec le serveur. Vérifiez que votre backend Laravel est lancé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center whitespace-nowrap overflow-auto gap-3">
        <h6 className="card-title">Inventaire Actuel</h6>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <LuLoader className="size-6 animate-spin text-primary" />
            <span className="ms-2 text-default-600">Chargement des données...</span>
          </div>
        ) : error ? (

          <div className="p-10 text-center text-danger">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-default-200">
            <thead className="bg-default-150">
              <tr className="text-sm font-normal text-default-500 whitespace-nowrap text-start">
                <th className="px-3.5 py-3 text-start">Produit</th>
                <th className="px-3.5 py-3 text-start">Prix</th>
                <th className="px-3.5 py-3 text-start">Quantité</th>
                <th className="px-3.5 py-3 text-start">Magasin</th>
                <th className="px-3.5 py-3 text-start">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id_produit} className="text-default-800 font-normal">
                    <td className="px-3.5 py-2.5 text-sm font-medium">{product.nom_pr}</td>
                    <td className="px-3.5 py-2.5 text-sm">{product.prix} DH</td>
                    <td className="px-3.5 py-2.5 text-sm">{product.quantite}</td>
                    <td className="px-3.5 py-2.5 text-sm">{product.magasin?.nom_magasin || 'N/A'}</td>
                    <td className="px-3.5 py-2.5 text-sm">
                      <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded text-xs font-medium ${
                        product.quantite <= 5 ? 'bg-danger/15 text-danger border border-danger/30' : 'bg-success/15 text-success border border-success/30'
                      }`}>
                        {product.quantite <= 5 ? <LuTriangleAlert className="size-3" /> : <LuCircleCheck className="size-3" />}
                        {product.quantite <= 5 ? 'Stock Bas' : 'En Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-3.5 py-10 text-center text-default-500">
                    Aucun produit trouvé dans le stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="card-footer">
        <p className="text-default-500 text-sm">Total: <b>{products.length}</b> produits affichés.</p>
      </div>
    </div>
  );
};

export default AvailableStockList;

