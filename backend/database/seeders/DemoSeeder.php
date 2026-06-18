<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $magasin = \App\Models\Magasin::create([
            'nom_magasin' => 'Entrepôt Principal',
            'adresse_mg' => '123 Rue de la Logistique, Casablanca',
        ]);

        $produit1 = \App\Models\Produit::create([
            'nom_pr' => 'Ordinateur Portable',
            'desc' => 'PC Gamer Haute Performance',
            'prix' => 12000,
            'quantite' => 50,
            'id_magasin' => $magasin->id_magasin,
        ]);

        $produit2 = \App\Models\Produit::create([
            'nom_pr' => 'Écran 27 pouces',
            'desc' => 'Moniteur 4K IPS',
            'prix' => 3500,
            'quantite' => 30,
            'id_magasin' => $magasin->id_magasin,
        ]);

        $utilisateur = \App\Models\Utilisateur::first();

        \App\Models\MouvementStock::create([
            'type' => 'Entrée',
            'quantite' => 20,
            'date_mv' => now(),
            'id_produit' => $produit1->id_produit,
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_magasin' => $magasin->id_magasin,
        ]);

        \App\Models\MouvementStock::create([
            'type' => 'Sortie',
            'quantite' => 5,
            'date_mv' => now(),
            'id_produit' => $produit2->id_produit,
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_magasin' => $magasin->id_magasin,
        ]);
    }
}
