<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MouvementStock;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MouvementStockController extends Controller
{
    /**
     * Get all movements
     */
    public function index(Request $request): JsonResponse
    {
        $query = MouvementStock::with(['produit', 'utilisateur', 'magasin']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('type', 'like', "%{$search}%");
        }

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        $perPage = $request->get('per_page', 10);
        $movements = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($movements);
    }

    /**
     * Get a single movement
     */
    public function show(MouvementStock $mouvementStock): JsonResponse
    {
        return response()->json(
            $mouvementStock->load('produit', 'utilisateur', 'magasin')
        );
    }

    /**
     * Store a new movement
     */
    public function store(Request $request, \App\Services\MouvementStockService $service): JsonResponse
    {
        // Validate request data (same rules as before)
        $validated = $request->validate([
            'type' => 'required|string|in:Entrée,Sortie',
            'quantite' => 'required|integer|min:1',
            'date_mv' => 'required|date',
            'id_produit' => 'required|exists:produits,id_produit',
            'id_magasin' => 'required|exists:magasins,id_magasin',
            'id_utilisateur' => 'nullable|exists:utilisateurs,id_utilisateur',
        ]);

        // Delegate the core logic to the service layer
        return $service->handleStore($validated);
    }

    /**
     * Delete a movement
     */
    public function destroy(MouvementStock $mouvementStock): JsonResponse
    {
        $mouvementStock->delete();

        return response()->json(['message' => 'Mouvement supprimé avec succès']);
    }

    /**
     * Transfer products between warehouses
     */
    public function transfer(Request $request, \App\Services\MouvementStockService $service): JsonResponse
    {
        $validated = $request->validate([
            'id_produit' => 'required|exists:produits,id_produit',
            'id_magasin_depart' => 'required|exists:magasins,id_magasin',
            'id_magasin_arrivee' => 'required|exists:magasins,id_magasin|different:id_magasin_depart',
            'quantite' => 'required|integer|min:1',
            'date_mv' => 'required|date',
            'id_utilisateur' => 'nullable|exists:utilisateurs:id_utilisateur',
        ]);

        return $service->handleTransfer($validated);
    }
}
