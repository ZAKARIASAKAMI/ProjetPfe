<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Magasin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MagasinController extends Controller
{
    /**
     * Get all magasins
     */
    public function index(Request $request): JsonResponse
    {
        $query = Magasin::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nom_magasin', 'like', "%{$search}%");
        }

        $magasins = $query->orderBy('created_at', 'desc')->get();

        return response()->json($magasins);
    }

    /**
     * Get a single magasin
     */
    public function show(Magasin $magasin): JsonResponse
    {
        return response()->json($magasin->load('produits'));
    }

    /**
     * Create a new magasin
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom_magasin' => 'required|string|max:255',
            'adresse_mg' => 'required|string|max:255',
        ]);

        $magasin = Magasin::create($validated);

        return response()->json($magasin, 201);
    }

    /**
     * Update a magasin
     */
    public function update(Request $request, Magasin $magasin): JsonResponse
    {
        $validated = $request->validate([
            'nom_magasin' => 'sometimes|string|max:255',
            'adresse_mg' => 'sometimes|string|max:255',
        ]);

        $magasin->update($validated);

        return response()->json($magasin);
    }

    /**
     * Delete a magasin
     */
    public function destroy(Magasin $magasin): JsonResponse
    {
        $magasin->delete();

        return response()->json(['message' => 'Magasin supprimé avec succès']);
    }
}
