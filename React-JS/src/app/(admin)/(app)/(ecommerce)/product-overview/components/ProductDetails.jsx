import React from 'react';
import { Link } from 'react-router';

const ProductDetails = ({ product }) => {
  if (!product) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">{product.nom_pr}</h1>
      <p className="text-xl text-primary mt-2">{product.prix} DH</p>
      <div className="mt-4">
        <p><strong>Stock:</strong> {product.quantite}</p>
        <p><strong>Magasin:</strong> {product.magasin?.nom_magasin || 'N/A'}</p>
      </div>
      <div className="mt-6">
        <h4 className="font-bold">Description:</h4>
        <p>{product.desc || 'Pas de description'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
