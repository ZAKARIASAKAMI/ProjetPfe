import { LuClipboardList, LuFileText, LuLayoutPanelLeft, LuLock, LuMonitorDot, LuPackage, LuSquareUserRound } from 'react-icons/lu';

export const menuItemsData = [
  {
    key: 'Overview',
    label: 'Aperçu',
    isTitle: true
  },
  {
    key: 'Dashboard',
    label: 'Tableau de bord',
    icon: LuMonitorDot,
    href: '/home'
  },
  {
    key: 'Management',
    label: 'Gestion',
    isTitle: true
  },
  {
    key: 'Product Management',
    label: 'Gestion des Produits',
    icon: LuPackage,
    children: [
      {
        key: 'Product List',
        label: 'Liste des Produits',
        href: '/product-list'
      },
      {
        key: 'Add Product',
        label: 'Ajouter un Produit',
        href: '/product-create'
      }
    ]
  },
  {
    key: 'Stock Management',
    label: 'Gestion du Stock',
    icon: LuClipboardList,
    children: [
      {
        key: 'Available Stock',
        label: 'Stock Disponible',
        href: '/stock/available'
      },
      {
        key: 'Record Entry',
        label: 'Enregistrer une Entrée',
        href: '/stock/entry'
      },
      {
        key: 'Record Exit',
        label: 'Enregistrer une Sortie',
        href: '/stock/exit'
      }
    ]
  },
  {
    key: 'Warehouse Management',
    label: 'Gestion des Entrepôts',
    icon: LuLayoutPanelLeft,
    children: [
      {
        key: 'Warehouse List',
        label: 'Liste des Entrepôts',
        href: '/warehouses'
      },
      {
        key: 'Add Warehouse',
        label: 'Ajouter un Entrepôt',
        href: '/warehouses/add'
      },
      {
        key: 'Transfer Products',
        label: 'Transférer des Produits',
        href: '/warehouses/transfer'
      }
    ]
  },
  {
    key: 'Movement History',
    label: 'Historique des Mouvements',
    icon: LuFileText,
    href: '/movements'
  },
  {
    key: 'Administration',
    label: 'Administration',
    isTitle: true
  },
  {
    key: 'Users & Roles',
    label: 'Utilisateurs et Rôles',
    icon: LuSquareUserRound,
    href: '/users-list'
  },
  {
    key: 'Authentication',
    label: 'Authentification',
    icon: LuLock,
    children: [
      {
        key: 'Login',
        label: 'Connexion',
        href: '/basic-login'
      },
      {
        key: 'Logout',
        label: 'Déconnexion',
        href: '/basic-logout'
      }
    ]
  }
];