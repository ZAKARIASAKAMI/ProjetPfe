import { Link } from 'react-router';
import { LuChevronLeft, LuChevronRight, LuDownload, LuEllipsis, LuEye, LuSearch, LuSquarePen, LuTrash2, LuLoader } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import httpClient from '@/helpers/httpClient';

const statusClasses = {
  Completed: 'bg-success/15 text-success border border-success/30',
  Pending: 'bg-warning/15 text-warning border border-warning/30',
  Processing: 'bg-info/15 text-info border border-info/30'
};

const MovementsList = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get('movements');
      // For pagination, movements are in response.data.data
      setMovements(response.data.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des mouvements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ?')) {
      try {
        await httpClient.delete(`movements/${id}`);
        fetchMovements();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return <div className="grid grid-cols-1 gap-5 mb-5">
    <div className="card">
      <div className="card-header flex justify-between items-center whitespace-nowrap overflow-auto gap-3">
        <h6 className="card-title">Historique Complet des Mouvements</h6>

        <div className="flex gap-3 items-center">
          <div className="relative md:block hidden">
            <input type="text" className="form-input form-input-sm ps-9" placeholder="Rechercher..." />
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <LuSearch className="size-3.5 text-default-500" />
            </div>
          </div>

          <button className="btn btn-sm bg-primary text-white">
            <LuDownload className="size-3.5 me-1" />
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-150">
                  <tr className="text-sm font-normal text-default-500 whitespace-nowrap">
                    <th className="px-3.5 py-3 text-start">#</th>
                    <th className="px-3.5 py-3 text-start">ID</th>
                    <th className="px-3.5 py-3 text-start">Nom du Produit</th>
                    <th className="px-3.5 py-3 text-start">Entrepôt</th>
                    <th className="px-3.5 py-3 text-start">Date</th>
                    <th className="px-3.5 py-3 text-start">Type</th>
                    <th className="px-3.5 py-3 text-start">Qté</th>
                    <th className="px-3.5 py-3 text-start">Statut</th>
                    <th className="px-3.5 py-3 text-start">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-default-200">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-3.5 py-10 text-center">
                        <div className="flex justify-center items-center gap-2 text-primary">
                          <LuLoader className="animate-spin size-6" />
                          <span>Chargement des mouvements...</span>
                        </div>
                      </td>
                    </tr>
                  ) : movements.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-3.5 py-10 text-center text-default-500">
                        Aucun mouvement trouvé.
                      </td>
                    </tr>
                  ) : movements.map(mov => <tr key={mov.id_mouvement} className="text-default-800 font-normal">
                    <td className="px-3.5 py-2.5 text-sm">{mov.id_mouvement}</td>
                    <td className="px-3.5 py-2.5 text-sm">MOV-{mov.id_mouvement}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.produit?.nom_pr || mov.produit?.nom_produit || 'Produit inconnu'}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.magasin?.nom_magasin || 'Entrepôt inconnu'}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.date_mv ? new Date(mov.date_mv).toLocaleDateString() : 'Date inconnue'}</td>
                    <td className="px-3.5 py-2.5 text-sm font-semibold text-primary">{mov.type}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.quantite}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium ${statusClasses.Completed}`}>
                        Terminé
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="hs-dropdown relative inline-flex">
                        <button type="button" className="hs-dropdown-toggle btn size-7.5 bg-default-150 hover:bg-default-600 text-default-500 hover:text-white" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown" hs-dropdown-placement="bottom-end">
                          <LuEllipsis className="iconify size-4" />
                        </button>

                        <div className="hs-dropdown-menu hidden" role="menu">
                          <div>
                            <Link className="flex items-center gap-1.5 py-1.5 font-medium px-3 text-sm text-default-500 hover:bg-default-150 rounded" to="">
                              <LuEye className="size-3" />
                              Voir
                            </Link>
                            <button 
                              onClick={() => handleDelete(mov.id_mouvement)}
                              className="flex w-full items-center gap-1.5 py-1.5 font-medium px-3 text-sm text-danger hover:bg-danger/10 rounded"
                            >
                              <LuTrash2 className="size-3" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <p className="text-default-500 text-sm">
          Affichage de <b>{movements.length}</b> sur <b>{movements.length}</b> résultats
        </p>
      </div>
    </div>
  </div>;
};

export default MovementsList;

