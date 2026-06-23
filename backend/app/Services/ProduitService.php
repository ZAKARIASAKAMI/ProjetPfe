<?php

namespace App\Services;

use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProduitService
{
    /**
     * Get paginated list of products with optional search.
     */
    public function index(array $request): JsonResponse
    {
        $query = Produit::with('magasin');

        if (!empty($request['search'])) {
            $query->where('nom_pr', 'like', "%{$request['search']}%");
        }

        $perPage = $request['per_page'] ?? 8;
        $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Show a single product with its store.
     */
    public function show(Produit $produit): JsonResponse
    {
        return response()->json($produit->load('magasin'));
    }

    /**
     * Store a new product.
     */
    public function store(array $validated): JsonResponse
    {
        $product = Produit::create($validated);
        return response()->json($product->load('magasin'), 201);
    }

    /**
     * Update an existing product.
     */
    public function update(Produit $produit, array $validated): JsonResponse
    {
        $produit->update($validated);
        return response()->json($produit->load('magasin'));
    }

    /**
     * Delete a product.
     */
    public function destroy(Produit $produit): JsonResponse
    {
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}
?>
