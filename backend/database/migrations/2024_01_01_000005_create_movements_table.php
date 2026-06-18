<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mouvementstocks', function (Blueprint $table) {
            $table->id('id_mouvement');
            $table->string('type');
            $table->integer('quantite');
            $table->date('date_mv');
            $table->foreignId('id_produit')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur')->onDelete('cascade');
            $table->foreignId('id_magasin')->constrained('magasins', 'id_magasin')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mouvementstocks');
    }
};
