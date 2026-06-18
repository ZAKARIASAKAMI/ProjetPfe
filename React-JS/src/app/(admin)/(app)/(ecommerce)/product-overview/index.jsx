import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Product from './components/Product';
import ProductDetails from './components/ProductDetails';
import httpClient from '@/helpers/httpClient';
import { LuLoader } from 'react-icons/lu';

const Index = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`produits/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (error || !product) return <div className="p-10 text-center text-danger">Produit non trouvé</div>;

  return (
    <div className="p-6">
      <Product product={product} />
      <hr className="my-6" />
      <ProductDetails product={product} />
    </div>
  );
};

export default Index;
