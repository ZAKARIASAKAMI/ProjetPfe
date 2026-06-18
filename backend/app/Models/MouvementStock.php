<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    protected $table = 'mouvementstocks';
    protected $primaryKey = 'id_mouvement';

    protected $fillable = [
        'type',
        'quantite',
        'date_mv',
        'id_produit',
        'id_utilisateur',
        'id_magasin',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function magasin(): BelongsTo
    {
        return $this->belongsTo(Magasin::class, 'id_magasin', 'id_magasin');
    }
}
