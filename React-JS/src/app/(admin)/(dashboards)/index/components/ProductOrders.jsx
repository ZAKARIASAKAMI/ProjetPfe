import { Link } from 'react-router';
import { LuChevronLeft, LuChevronRight, LuDownload, LuEllipsis, LuEye, LuSearch, LuSquarePen, LuTrash2 } from 'react-icons/lu';

const movements = [
  { id: 1, movementId: 'MOV-1001', productName: 'Lenovo ThinkPad X1', warehouse: 'Main WH - Berlin', date: '08 Jun, 2023', type: 'Entrée', quantity: 50, performedBy: 'Marie Prohaska', status: 'Completed' },
  { id: 2, movementId: 'MOV-1002', productName: 'Dell XPS 13', warehouse: 'Store - Paris', date: '11 July, 2023', type: 'Sortie', quantity: 12, performedBy: 'Jaqueline Hammes', status: 'Pending' },
  { id: 3, movementId: 'MOV-1003', productName: 'Apple MacBook Pro', warehouse: 'WH - Buenos Aires', date: '21 Aug, 2023', type: 'Transfert', quantity: 30, performedBy: 'Marlene Hirthe', status: 'Processing' },
  { id: 4, movementId: 'MOV-1004', productName: 'Logitech MX Master 3', warehouse: 'WH - Brussels', date: '28 Nov, 2023', type: 'Entrée', quantity: 100, performedBy: 'Reagan Larson', status: 'Completed' },
  { id: 5, movementId: 'MOV-1005', productName: 'Keychron K2', warehouse: 'Store - Sydney', date: '11 Oct, 2023', type: 'Sortie', quantity: 5, performedBy: 'Glennie Langosh', status: 'Completed' },
  { id: 6, movementId: 'MOV-1006', productName: 'Samsung Odyssey G7', warehouse: 'Main WH - Berlin', date: '15 Dec, 2023', type: 'Entrée', quantity: 20, performedBy: 'Marie Prohaska', status: 'Completed' },
  { id: 7, movementId: 'MOV-1007', productName: 'Sony WH-1000XM4', warehouse: 'Store - Paris', date: '02 Jan, 2024', type: 'Sortie', quantity: 8, performedBy: 'Jaqueline Hammes', status: 'Processing' },
  { id: 8, movementId: 'MOV-1008', productName: 'iPad Pro M2', warehouse: 'WH - Brussels', date: '10 Jan, 2024', type: 'Transfert', quantity: 15, performedBy: 'Reagan Larson', status: 'Completed' },
  { id: 9, movementId: 'MOV-1009', productName: 'iPhone 15 Pro', warehouse: 'Main WH - Berlin', date: '12 Jan, 2024', type: 'Entrée', quantity: 50, performedBy: 'Marie Prohaska', status: 'Completed' },
  { id: 10, movementId: 'MOV-1010', productName: 'AirPods Max', warehouse: 'Store - Paris', date: '15 Jan, 2024', type: 'Sortie', quantity: 5, performedBy: 'Jaqueline Hammes', status: 'Completed' },
  { id: 11, movementId: 'MOV-1011', productName: 'Magic Mouse', warehouse: 'WH - Brussels', date: '18 Jan, 2024', type: 'Entrée', quantity: 40, performedBy: 'Reagan Larson', status: 'Completed' },
  { id: 12, movementId: 'MOV-1012', productName: 'USB-C Hub', warehouse: 'WH - Buenos Aires', date: '20 Jan, 2024', type: 'Transfert', quantity: 25, performedBy: 'Marlene Hirthe', status: 'Completed' }
];

const statusClasses = {
  Completed: 'bg-success/15 text-success border border-success/30',
  Pending: 'bg-warning/15 text-warning border border-warning/30',
  Processing: 'bg-info/15 text-info border border-info/30'
};

import { useState } from 'react';
const ProductOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(movements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = movements.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return <div className="grid grid-cols-1 gap-5 mb-5">
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">Mouvements de Stock Récents</h6>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <input type="text" className="form-input form-input-sm ps-9" placeholder="Rechercher des mouvements..." />
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <LuSearch className="size-3.5 text-default-500" />
            </div>
          </div>

          <button className="btn btn-sm bg-primary text-white">
            <LuDownload className="size-3.5 me-1" />
            Exporter
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
                    <th className="px-3.5 py-3 text-start">ID de Mouvement</th>
                    <th className="px-3.5 py-3 text-start">Nom du Produit</th>
                    <th className="px-3.5 py-3 text-start">Entrepôt</th>
                    <th className="px-3.5 py-3 text-start">Date</th>
                    <th className="px-3.5 py-3 text-start">Type</th>
                    <th className="px-3.5 py-3 text-start">Quantité</th>
                    <th className="px-3.5 py-3 text-start">Effectué par</th>
                    <th className="px-3.5 py-3 text-start">Statut</th>
                    <th className="px-3.5 py-3 text-start">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-default-200">
                  {currentItems.map(mov => <tr key={mov.id} className="text-default-800 font-normal">
                    <td className="px-3.5 py-2.5 text-sm">{mov.id}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.movementId}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.productName}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.warehouse}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.date}</td>
                    <td className="px-3.5 py-2.5 text-sm font-semibold">{mov.type}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.quantity}</td>
                    <td className="px-3.5 py-2.5 text-sm">{mov.performedBy}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium ${statusClasses[mov.status]}`}>
                        {mov.status}
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
                              Overview
                            </Link>
                            <Link className="flex items-center gap-1.5 py-1.5 font-medium px-3 text-sm text-default-500 hover:bg-default-150 rounded" to="">
                              <LuSquarePen className="size-3" />
                              Edit
                            </Link>
                            <Link className="flex items-center gap-1.5 py-1.5 font-medium px-3 text-sm text-default-500 hover:bg-default-150 rounded" to="">
                              <LuTrash2 className="size-3" />
                              Delete
                            </Link>
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
          Affichage de <b>{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, movements.length)}</b> sur <b>{movements.length}</b> résultats
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
export default ProductOrders;
