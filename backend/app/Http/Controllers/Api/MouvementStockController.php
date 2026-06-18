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
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:Entrée,Sortie',
            'quantite' => 'required|integer|min:1',
            'date_mv' => 'required|date',
            'id_produit' => 'required|exists:produits,id_produit',
            'id_magasin' => 'required|exists:magasins,id_magasin',
            'id_utilisateur' => 'nullable|exists:utilisateurs,id_utilisateur',
        ]);

        // Default to a user if not provided
        if (!isset($validated['id_utilisateur']) || !$validated['id_utilisateur']) {
            $user = \App\Models\Utilisateur::first();
            if ($user) {
                $validated['id_utilisateur'] = $user->id_utilisateur;
            } else {
                return response()->json(['message' => 'Aucun utilisateur trouvé pour enregistrer le mouvement.'], 422);
            }
        }

        // Find the product
        $product = \App\Models\Produit::find($validated['id_produit']);
        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé.'], 404);
        }

        // Check if the product belongs to the selected warehouse
        if ((int) $product->id_magasin !== (int) $validated['id_magasin']) {
            return response()->json([
                'message' => "Le produit sélectionné n'appartient pas au magasin choisi. Il est actuellement dans: " . ($product->magasin->nom_magasin ?? 'Inconnu')
            ], 422);
        }

        \DB::beginTransaction();
        try {
            // Update product quantity
            if ($validated['type'] === 'Entrée') {
                $product->quantite += $validated['quantite'];
            } else { // Sortie
                if ($product->quantite < $validated['quantite']) {
                    return response()->json([
                        'message' => "Stock insuffisant. Quantité disponible: {$product->quantite}"
                    ], 422);
                }
                $product->quantite -= $validated['quantite'];
            }

            // Save product quantity
            $product->save();

            // Create the movement
            $movement = MouvementStock::create($validated);

            \DB::commit();

            return response()->json([
                'message' => 'Mouvement de stock enregistré avec succès',
                'movement' => $movement->load(['produit', 'utilisateur', 'magasin'])
            ], 201);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function transfer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_produit' => 'required|exists:produits,id_produit',
            'id_magasin_depart' => 'required|exists:magasins,id_magasin',
            'id_magasin_arrivee' => 'required|exists:magasins,id_magasin|different:id_magasin_depart',
            'quantite' => 'required|integer|min:1',
            'date_mv' => 'required|date',
            'id_utilisateur' => 'nullable|exists:utilisateurs,id_utilisateur',
        ]);

        // Default to a user if not provided
        if (!isset($validated['id_utilisateur']) || !$validated['id_utilisateur']) {
            $user = \App\Models\Utilisateur::first();
            if ($user) {
                $validated['id_utilisateur'] = $user->id_utilisateur;
            } else {
                return response()->json(['message' => 'Aucun utilisateur trouvé.'], 422);
            }
        }

        // Get source product
        $sourceProduct = \App\Models\Produit::where('id_produit', $validated['id_produit'])
            ->where('id_magasin', $validated['id_magasin_depart'])
            ->first();

        if (!$sourceProduct) {
            return response()->json(['message' => 'Le produit sélectionné n\'existe pas dans le magasin de départ.'], 422);
        }

        if ($sourceProduct->quantite < $validated['quantite']) {
            return response()->json([
                'message' => "Stock insuffisant dans le magasin de départ. Quantité disponible: {$sourceProduct->quantite}"
            ], 422);
        }

        // Transaction to ensure atomic operation
        \DB::beginTransaction();
        try {
            // 1. Decrement source product quantity
            $sourceProduct->quantite -= $validated['quantite'];
            $sourceProduct->save();

            // 2. Find or create destination product in destination warehouse
            $destProduct = \App\Models\Produit::where('nom_pr', $sourceProduct->nom_pr)
                ->where('id_magasin', $validated['id_magasin_arrivee'])
                ->first();

            if ($destProduct) {
                $destProduct->quantite += $validated['quantite'];
                $destProduct->save();
            } else {
                $destProduct = \App\Models\Produit::create([
                    'nom_pr' => $sourceProduct->nom_pr,
                    'desc' => $sourceProduct->desc,
                    'image' => $sourceProduct->image,
                    'prix' => $sourceProduct->prix,
                    'quantite' => $validated['quantite'],
                    'id_magasin' => $validated['id_magasin_arrivee'],
                ]);
            }

            // 3. Log Sortie movement for source warehouse
            MouvementStock::create([
                'type' => 'Sortie',
                'quantite' => $validated['quantite'],
                'date_mv' => $validated['date_mv'],
                'id_produit' => $sourceProduct->id_produit,
                'id_magasin' => $validated['id_magasin_depart'],
                'id_utilisateur' => $validated['id_utilisateur'],
            ]);

            // 4. Log Entrée movement for destination warehouse
            MouvementStock::create([
                'type' => 'Entrée',
                'quantite' => $validated['quantite'],
                'date_mv' => $validated['date_mv'],
                'id_produit' => $destProduct->id_produit,
                'id_magasin' => $validated['id_magasin_arrivee'],
                'id_utilisateur' => $validated['id_utilisateur'],
            ]);

            \DB::commit();

            return response()->json([
                'message' => 'Transfert de produit effectué avec succès.'
            ], 200);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue lors du transfert.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
