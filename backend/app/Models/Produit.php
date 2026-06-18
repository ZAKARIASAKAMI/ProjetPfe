<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $table = 'produits';
    protected $primaryKey = 'id_produit';

    protected $fillable = [
        'nom_pr',
        'image',
        'desc',
        'prix',
        'quantite',
        'id_magasin',
    ];

    public function magasin(): BelongsTo
    {
        return $this->belongsTo(Magasin::class, 'id_magasin', 'id_magasin');
    }

    public function mouvementStocks(): HasMany
    {
        return $this->hasMany(MouvementStock::class, 'id_produit', 'id_produit');
    }
}
