<?php

namespace App\Services;

use App\Models\MouvementStock;
use App\Models\Produit;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MouvementStockService
{
    /**
     * Handle storing a new stock movement.
     * Returns a JsonResponse similar to the original controller.
     */
    public function handleStore(array $validated): JsonResponse
    {
        // Default to a user if not provided
        if (empty($validated['id_utilisateur'])) {
            $user = Utilisateur::first();
            if ($user) {
                $validated['id_utilisateur'] = $user->id_utilisateur;
            } else {
                return response()->json(['message' => 'Aucun utilisateur trouvé pour enregistrer le mouvement.'], 422);
            }
        }

        // Find the product
        $product = Produit::find($validated['id_produit']);
        if (! $product) {
            return response()->json(['message' => 'Produit non trouvé.'], 404);
        }

        // Verify product belongs to the selected warehouse
        if ((int) $product->id_magasin !== (int) $validated['id_magasin']) {
            return response()->json([
                'message' => "Le produit sélectionné n'appartient pas au magasin choisi. Il est actuellement dans: " . ($product->magasin->nom_magasin ?? 'Inconnu')
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update product quantity based on movement type
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
            $product->save();

            // Create the movement record
            $movement = MouvementStock::create($validated);

            DB::commit();
            return response()->json([
                'message' => 'Mouvement de stock enregistré avec succès',
                'movement' => $movement->load(['produit', 'utilisateur', 'magasin'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle transferring products between warehouses.
     */
    public function handleTransfer(array $validated): JsonResponse
    {
        // Default to a user if not provided
        if (empty($validated['id_utilisateur'])) {
            $user = Utilisateur::first();
            if ($user) {
                $validated['id_utilisateur'] = $user->id_utilisateur;
            } else {
                return response()->json(['message' => 'Aucun utilisateur trouvé.'], 422);
            }
        }

        // Get source product in departure warehouse
        $sourceProduct = Produit::where('id_produit', $validated['id_produit'])
            ->where('id_magasin', $validated['id_magasin_depart'])
            ->first();
        if (! $sourceProduct) {
            return response()->json(['message' => "Le produit sélectionné n'existe pas dans le magasin de départ."], 422);
        }
        if ($sourceProduct->quantite < $validated['quantite']) {
            return response()->json([
                'message' => "Stock insuffisant dans le magasin de départ. Quantité disponible: {$sourceProduct->quantite}"
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Decrement source stock
            $sourceProduct->quantite -= $validated['quantite'];
            $sourceProduct->save();

            // Find or create destination product
            $destProduct = Produit::where('nom_pr', $sourceProduct->nom_pr)
                ->where('id_magasin', $validated['id_magasin_arrivee'])
                ->first();
            if ($destProduct) {
                $destProduct->quantite += $validated['quantite'];
                $destProduct->save();
            } else {
                $destProduct = Produit::create([
                    'nom_pr' => $sourceProduct->nom_pr,
                    'desc' => $sourceProduct->desc,
                    'image' => $sourceProduct->image,
                    'prix' => $sourceProduct->prix,
                    'quantite' => $validated['quantite'],
                    'id_magasin' => $validated['id_magasin_arrivee'],
                ]);
            }

            // Log Sortie
            MouvementStock::create([
                'type' => 'Sortie',
                'quantite' => $validated['quantite'],
                'date_mv' => $validated['date_mv'],
                'id_produit' => $sourceProduct->id_produit,
                'id_magasin' => $validated['id_magasin_depart'],
                'id_utilisateur' => $validated['id_utilisateur'],
            ]);

            // Log Entrée
            MouvementStock::create([
                'type' => 'Entrée',
                'quantite' => $validated['quantite'],
                'date_mv' => $validated['date_mv'],
                'id_produit' => $destProduct->id_produit,
                'id_magasin' => $validated['id_magasin_arrivee'],
                'id_utilisateur' => $validated['id_utilisateur'],
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Transfert de produit effectué avec succès'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue lors du transfert.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
