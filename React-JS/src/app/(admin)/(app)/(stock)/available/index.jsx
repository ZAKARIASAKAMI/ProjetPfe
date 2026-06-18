import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import AvailableStockList from './components/AvailableStockList';

const AvailableStock = () => {
  return (
    <>
      <PageMeta title="Stock Disponible | Gestion de Stock" />
      <main>
        <PageBreadcrumb title="Gestion de Stock" subtitle="Stock Disponible" />
        <AvailableStockList />
      </main>
    </>
  );
};

export default AvailableStock;
