import { Link } from 'react-router';
import { LuChevronLeft, LuChevronRight, LuEllipsis, LuEye, LuPlus, LuSquarePen, LuTrash2, LuLoader } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import httpClient from '@/helpers/httpClient';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const productsPerPage = 8;

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await httpClient.get(`produits?page=${page}&per_page=${productsPerPage}`);
      setProducts(response.data.data);
      setPagination(response.data);
      setCurrentPage(page);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await httpClient.delete(`produits/${id}`);
        // Rafraîchir la liste
        fetchProducts(currentPage);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du produit.');
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchProducts(page);
    }
  };

  return <div className="grid grid-cols-1 gap-5 mb-5">
    <div className="card">
      <div className="card-header flex justify-end">
        <Link to="/product-create" className="btn btn-sm bg-primary text-white">
          <LuPlus className="size-4 me-1" />
          Ajouter un Produit
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-150">
                  <tr className="text-sm font-normal text-default-700">
                    <th className="px-3.5 py-3 text-start">Code Produit</th>
                    <th className="px-3.5 py-3 text-start">Nom du Produit</th>
                    <th className="px-3.5 py-3 text-start">Magasin</th>
                    <th className="px-3.5 py-3 text-start">Prix</th>
                    <th className="px-3.5 py-3 text-start">Stock</th>
                    <th className="px-3.5 py-3 text-start">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-3.5 py-10 text-center">
                        <div className="flex justify-center items-center gap-2 text-primary">
                          <LuLoader className="animate-spin size-6" />
                          <span>Chargement des produits...</span>
                        </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-3.5 py-10 text-center text-default-500">
                        Aucun produit trouvé.
                      </td>
                    </tr>
                  ) : products.map(product => <tr key={product.id_produit} className="text-default-800 font-normal">
                    <td className="px-3.5 py-2.5 whitespace-nowrap text-sm text-primary">
                      #{product.id_produit}
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <h6 className="text-default-800 font-medium">{product.nom_pr}</h6>
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                      <div className="inline-flex py-0.5 px-2.5 rounded text-xs font-normal bg-default-100 border border-default-200 text-default-500">
                        {product.magasin?.nom_magasin || 'N/A'}
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                      {product.prix} DH
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap text-sm font-semibold text-default-950">{product.quantite}</td>

                    <td className="px-3.5 py-2.5">
                      <div className="hs-dropdown relative inline-flex">
                        <button type="button" className="hs-dropdown-toggle btn size-7.5 bg-default-200 hover:bg-default-600 text-default-500 hover:text-white" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown" hs-dropdown-placement="bottom-end">
                          <LuEllipsis className="size-4" />
                        </button>
                        <div className="hs-dropdown-menu hidden" role="menu">
                          <Link className="flex items-center gap-1.5 py-1.5 font-medium px-3 text-default-500 hover:bg-default-150 rounded" to={`/product-overview/${product.id_produit}`}>
                            <LuEye className="size-3" />
                            Aperçu
                          </Link>
                          <Link className="flex items-center gap-1.5 py-1.5 font-medium px-3 text-default-500 hover:bg-default-150 rounded" to={`/product-edit/${product.id_produit}`}>
                            <LuSquarePen className="size-3" />
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id_produit)}
                            className="flex w-full items-center gap-1.5 py-1.5 font-medium px-3 text-danger hover:bg-danger/10 rounded"
                          >
                            <LuTrash2 className="size-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <p className="text-default-500 text-sm">
            Affichage de <b>{pagination.from || 0} - {pagination.to || 0}</b> sur <b>{pagination.total || 0}</b> Résultats
          </p>
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50"
            >
              <LuChevronLeft className="size-4 me-1" /> Précédent
            </button>

            {pagination.last_page > 1 && [...Array(pagination.last_page)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => handlePageChange(i + 1)}
                className={`btn size-7.5 ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page || loading}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50"
            >
              Suivant
              <LuChevronRight className="size-4 ms-1" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>;
};
export default ProductList;
