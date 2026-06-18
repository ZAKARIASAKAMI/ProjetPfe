import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '@/helpers/httpClient';
import { LuChevronLeft, LuChevronRight, LuCircleCheck, LuCircleX, LuDownload, LuEllipsis, LuEye, LuLoader, LuPlus, LuSearch, LuSlidersHorizontal, LuSquarePen, LuTrash2, LuTriangleAlert } from 'react-icons/lu';

const UserListTabel = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get('users');
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError('Impossible de charger la liste des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await httpClient.delete(`users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <div className="card p-10 flex justify-center items-center"><LuLoader className="animate-spin size-10 text-primary" /></div>;

  return <div className="card">
      <div className="card-header">
        <h6 className="card-title">Liste des Utilisateurs</h6>
        <button className="btn btn-sm bg-primary text-white">
          <LuPlus className="size-4 me-1" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="card-header">
        <div className="md:flex items-center md:space-y-0 space-y-4 gap-3">
          <div className="relative">
            <input type="email" className="form-input form-input-sm ps-9" placeholder="Rechercher par nom, email..." />
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <LuSearch className="size-3.5 flex items-center text-default-500 fill-default-100" />
            </div>
          </div>

          <select className="form-input form-input-sm">
            <option defaultValue="">Sélectionner le statut</option>
            <option>Caché</option>
            <option>Rejeté</option>
            <option>Vérifié</option>
            <option>En attente</option>
          </select>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <button type="button" className="btn btn-sm bg-transparent border border-dashed border-primary  text-primary hover:bg-primary/10">
            <LuDownload className="size-4" />
            Importer
          </button>

          <button type="button" className="btn btn-sm size-7.5 bg-default-100 text-default-500 hover:bg-default-1500  hover:text-white">
            <LuSlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-150">
                  <tr className="text-sm font-normal text-default-700 whitespace-nowrap">
                    <th className="ps-4 text-start">
                      <input id="checkbox-all" type="checkbox" className="form-checkbox" />
                    </th>
                    <th className="px-3.5 py-3 text-start">ID Utilisateur</th>
                    <th className="px-3.5 py-3 text-start">Nom</th>
                    <th className="px-3.5 py-3 text-start">Emplacement</th>
                    <th className="px-3.5 py-3 text-start">Email</th>
                    <th className="px-3.5 py-3 text-start">Téléphone</th>
                    <th className="px-3.5 py-3 text-start">Date d'adhésion</th>
                    <th className="px-3.5 py-3 text-start">Statut</th>
                    <th className="px-3.5 py-3 text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(user => <tr key={user.id} className="text-default-800 font-normal text-sm whitespace-nowrap">
                      <td className="py-3 ps-4">
                        <input type="checkbox" className="form-checkbox" />
                      </td>
                      <td className="px-3.5 py-3 text-primary">{user.id}</td>
                      <td className="flex py-3 px-3.5 items-center gap-3">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 flex items-center justify-center rounded-full bg-default-200 font-semibold">
                            {user.initials}
                          </div>}
                        <div>
                          <h6 className="mb-1.5 font-semibold">
                            <Link to="#" className="text-default-800">
                              {user.name}
                            </Link>
                          </h6>
                          <p className="text-default-500">{user.role}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">{user.location}</td>
                      <td className="py-3 px-3.5">{user.email}</td>
                      <td className="py-3 px-3.5">{user.phone}</td>
                      <td className="py-3 px-3.5">{user.joiningDate}</td>
                      <td className="px-3.5 py-3">
                        {user.status === 'Vérifié' && <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
                            <LuCircleCheck className="size-3" />
                            Vérifié
                          </span>}
                        {user.status === 'En attente' && <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-default-200 text-default-600 rounded">
                            <LuLoader className="size-3" />
                            En attente
                          </span>}
                        {user.status === 'Rejeté' && <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-danger/10 text-danger rounded">
                            <LuCircleX className="size-3" />
                            Rejeté
                          </span>}
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="hs-dropdown relative inline-flex">
                          <button type="button" className="hs-dropdown-toggle btn size-7.5 bg-default-200 hover:bg-default-600 text-default-500">
                            <LuEllipsis className="size-4" />
                          </button>
                          <div className="hs-dropdown-menu" role="menu">
                            <Link to={`/user-overview/${user.id}`} className="flex items-center gap-1.5 py-1.5 px-3 text-default-500 hover:bg-default-150 rounded">
                              <LuEye className="size-3" /> Aperçu
                            </Link>
                            <Link to={`/user-edit/${user.id}`} className="flex items-center gap-1.5 py-1.5 px-3 text-default-500 hover:bg-default-150 rounded">
                              <LuSquarePen className="size-3" /> Modifier
                            </Link>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="w-full flex items-center gap-1.5 py-1.5 px-3 text-default-500 hover:bg-default-150 rounded text-left"
                            >
                              <LuTrash2 className="size-3" /> Supprimer
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
            Affichage de <b>{indexOfFirstUser + 1} - {Math.min(indexOfLastUser, users.length)}</b> sur <b>{users.length}</b> résultats
          </p>
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50"
            >
              <LuChevronLeft className="size-4 me-1" /> Précédent
            </button>

            {[...Array(totalPages)].map((_, i) => (
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
              disabled={currentPage === totalPages}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50"
            >
              Suivant
              <LuChevronRight className="size-4 ms-1" />
            </button>
          </nav>
        </div>
      </div>
    </div>;
};
export default UserListTabel;
