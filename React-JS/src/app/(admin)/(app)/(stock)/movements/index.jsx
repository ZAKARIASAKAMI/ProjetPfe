import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import MovementsList from './components/MovementsList';

const Movements = () => {
  return (
    <>
      <PageMeta title="Historique des Mouvements | Gestion de Stock" />
      <main>
        <PageBreadcrumb title="Gestion de Stock" subtitle="Historique des Mouvements" />
        <MovementsList />
      </main>
    </>
  );
};

export default Movements;
