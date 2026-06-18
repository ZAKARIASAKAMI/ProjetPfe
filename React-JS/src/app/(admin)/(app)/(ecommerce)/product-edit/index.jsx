import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProductEditForm from './components/ProductEditForm';
import PageMeta from '@/components/PageMeta';

const Index = () => {
  return <>
      <PageMeta title="Modifier le Produit" />
      <main>
        <PageBreadcrumb title="Modifier le Produit" subtitle="Gestion des Produits" />
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
          <ProductEditForm />
        </div>
      </main>
    </>;
};

export default Index;
