import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import ProductOrderDetails from './components/ProductOrderDetails';

const Index = () => {
  return (
    <>
      <PageMeta title="Tableau de Bord | Gestion de Stock" />
      <main>
        <PageBreadcrumb title="Gestion de Stock" subtitle="Tableau de Bord" />


        <div className="mb-5">
          <ProductOrderDetails />
        </div>
      </main>
    </>
  );
};

export default Index;
