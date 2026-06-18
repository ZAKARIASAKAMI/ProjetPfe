import React from 'react';
import { Link } from 'react-router';

const Product = ({ product }) => {
  if (!product) return null;

  return (
    <div className="col-span-1">
      <div className="sticky top-24">
        {product.image && (
          <div className="card mb-5">
            <div className="card-body">
              <div className="bg-default-100 rounded-lg p-4 flex justify-center items-center overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.nom_pr}
                  className="max-w-full h-auto transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          </div>
        )}

        <div className="card mb-5">
          <div className="card-body">
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Link to="/product-list" className="btn btn-sm border w-full text-center py-2 rounded">Retour</Link>
              <Link to={`/product-edit/${product.id_produit}`} className="btn btn-sm bg-primary text-white w-full text-center py-2 rounded">Modifier</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
