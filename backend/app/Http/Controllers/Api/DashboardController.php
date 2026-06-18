<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\MouvementStock;
use App\Models\Magasin;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        $totalProducts = Produit::count();
        $totalMagasins = Magasin::count();
        $totalStock = Produit::sum('quantite');
        $totalUsers = Utilisateur::count();
        
        // Count products with low stock (let's say less than 10)
        $lowStockCount = Produit::where('quantite', '<', 10)->count();
        
        // Count entries only
        $entriesCount = MouvementStock::where('type', 'Entrée')->count();
        
        $recentMovements = MouvementStock::with(['produit', 'magasin'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($mov) {
                return [
                    'id' => $mov->id_mouvement,
                    'productName' => $mov->produit->nom_pr ?? 'N/A',
                    'magasin' => $mov->magasin ? $mov->magasin->nom_magasin : 'N/A',
                    'type' => $mov->type,
                    'quantity' => $mov->quantite,
                    'date' => $mov->date_mv,
                ];
            });

        return response()->json([
            'totalProducts' => $totalProducts,
            'totalMagasins' => $totalMagasins,
            'totalStock' => $totalStock,
            'totalUsers' => $totalUsers,
            'lowStockCount' => $lowStockCount,
            'entriesCount' => $entriesCount,
            'recentMovements' => $recentMovements,
        ]);
    }
}
