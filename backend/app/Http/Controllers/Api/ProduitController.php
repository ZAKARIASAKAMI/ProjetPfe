<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProduitController extends Controller
{
    /**
     * Get all products
     */
    public function index(Request $request): JsonResponse
    {
        $query = Produit::with('magasin');

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nom_pr', 'like', "%{$search}%");
        }

        $perPage = $request->get('per_page', 8);
        $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get a single product
     */
    public function show(Produit $produit): JsonResponse
    {
        return response()->json($produit->load('magasin'));
    }

    /**
     * Create a new product
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom_pr' => 'required|string|max:50',
            'image' => 'nullable|string',
            'desc' => 'nullable|string|max:255',
            'prix' => 'required|numeric|min:0',
            'quantite' => 'required|integer|min:0',
            'id_magasin' => 'required|exists:magasins,id_magasin',
        ]);

        $produit = Produit::create($validated);

        return response()->json($produit->load('magasin'), 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Produit $produit): JsonResponse
    {
        $validated = $request->validate([
            'nom_pr' => 'sometimes|string|max:50',
            'image' => 'nullable|string',
            'desc' => 'nullable|string|max:255',
            'prix' => 'sometimes|numeric|min:0',
            'quantite' => 'sometimes|integer|min:0',
            'id_magasin' => 'sometimes|exists:magasins,id_magasin',
        ]);

        $produit->update($validated);

        return response()->json($produit->load('magasin'));
    }

    /**
     * Delete a product
     */
    public function destroy(Produit $produit): JsonResponse
    {
        $produit->delete();

        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}
