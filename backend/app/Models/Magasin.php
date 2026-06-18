<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Magasin extends Model
{
    protected $table = 'magasins';
    protected $primaryKey = 'id_magasin';

    protected $fillable = [
        'nom_magasin',
        'adresse_mg',
    ];

    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class, 'id_magasin', 'id_magasin');
    }

    public function mouvementStocks(): HasMany
    {
        return $this->hasMany(MouvementStock::class, 'id_magasin', 'id_magasin');
    }
}
