<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magasins', function (Blueprint $table) {
            $table->id('id_magasin');
            $table->string('nom_magasin');
            $table->string('adresse_mg');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magasins');
    }
};
