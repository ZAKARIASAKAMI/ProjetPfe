import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProductCreate from './components/ProductCreat';
export const metadata = {
  title: 'Création de Produit'
};
const Index = () => {
  return <>
      <main>
        <PageBreadcrumb title="Ajouter un Nouveau" subtitle="Gestion des Produits" />
        <div className="grid lg:grid-cols-12 grid-cols-1 gap-6">
          <ProductCreate />
        </div>
      </main>
    </>;
};
export default Index;
