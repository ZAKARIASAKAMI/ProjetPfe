import React, { useEffect, useState } from 'react';
import { LuSearch, LuPlus, LuLoader, LuTrash2, LuSquarePen, LuRefreshCcw } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get('magasins');
      setWarehouses(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des entrepôts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) {
      try {
        await httpClient.delete(`magasins/${id}`);
        fetchWarehouses();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression. Assurez-vous que l’entrepôt est vide.');
      }
    }
  };

  return (
    <>
      <PageMeta title="Liste des Entrepôts | FlowStock" />
      <main>
        <PageBreadcrumb title="Gestion des Entrepôts" subtitle="Liste des Entrepôts" />

        <div className="card">
          <div className="card-header flex justify-between items-center gap-3">
            <h6 className="card-title">Tous les Entrepôts</h6>
            <div className="flex gap-2">
              <Link to="/warehouses/add" className="btn btn-sm bg-primary text-white flex items-center gap-1">
                <LuPlus className="size-4" /> Ajouter
              </Link>
              <button onClick={fetchWarehouses} className="btn btn-sm border-default-200 text-default-600">
                <LuRefreshCcw className="size-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-150">
                <tr className="text-sm font-normal text-default-500 whitespace-nowrap">
                  <th className="px-3.5 py-3 text-start">ID</th>
                  <th className="px-3.5 py-3 text-start">Nom de l'Entrepôt</th>
                  <th className="px-3.5 py-3 text-start">Adresse</th>
                  <th className="px-3.5 py-3 text-start">Date de Création</th>
                  <th className="px-3.5 py-3 text-start">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-3.5 py-10 text-center">
                      <div className="flex justify-center items-center gap-2 text-primary">
                        <LuLoader className="animate-spin" /> Chargement...
                      </div>
                    </td>
                  </tr>
                ) : warehouses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3.5 py-10 text-center text-default-500">
                      Aucun entrepôt trouvé.
                    </td>
                  </tr>
                ) : warehouses.map(w => (
                  <tr key={w.id_magasin} className="text-default-800">
                    <td className="px-3.5 py-2.5 text-sm">{w.id_magasin}</td>
                    <td className="px-3.5 py-2.5 text-sm font-medium">{w.nom_magasin}</td>
                    <td className="px-3.5 py-2.5 text-sm">{w.adresse_mg}</td>
                    <td className="px-3.5 py-2.5 text-sm">{new Date(w.created_at).toLocaleDateString()}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex gap-2">
                        <button className="text-default-500 hover:text-primary">
                          <LuSquarePen className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(w.id_magasin)}
                          className="text-danger hover:text-danger/80"
                        >
                          <LuTrash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default WarehouseList;
