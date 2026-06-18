import React, { useState, useEffect } from 'react';
import { LuPackage, LuPackagePlus, LuWarehouse, LuTriangleAlert } from 'react-icons/lu';
import httpClient from '@/helpers/httpClient';

const ProductOrderDetails = () => {
  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    totalStock: 0,
    entriesCount: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await httpClient.get('dashboard/stats');
        setStatsData({
          totalProducts: response.data.totalProducts,
          totalStock: response.data.totalStock,
          entriesCount: response.data.entriesCount,
          lowStockCount: response.data.lowStockCount
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [{
    id: 1,
    icon: LuPackage,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    value: statsData.totalProducts.toLocaleString(),
    label: 'Total des produits'
  }, {
    id: 2,
    icon: LuWarehouse,
    iconColor: 'text-info',
    bgColor: 'bg-info/10',
    value: statsData.totalStock.toLocaleString(),
    label: 'Articles en stock'
  }, {
    id: 3,
    icon: LuPackagePlus,
    iconColor: 'text-success',
    bgColor: 'bg-success/10',
    value: statsData.entriesCount.toLocaleString(),
    label: 'Dernières Entrées'
  }, {
    id: 4,
    icon: LuTriangleAlert,
    iconColor: 'text-danger',
    bgColor: 'bg-danger/10',
    value: statsData.lowStockCount.toLocaleString(),
    label: 'Alertes Stock Bas'
  }];

  return <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
    {stats.map(({
      id,
      icon: Icon,
      iconColor,
      bgColor,
      value,
      label
    }) => <div className="card" key={id}>
        <div className="card-body">
          <div className={`flex items-center justify-center mx-auto rounded-full size-14 ${bgColor}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <h5 className="mt-4 text-center mb-2 text-default-800 font-semibold text-lg">
            {loading ? '...' : value}
          </h5>
          <p className="text-center text-sm text-default-500">{label}</p>
        </div>
      </div>)}
  </div>;
};
export default ProductOrderDetails;
