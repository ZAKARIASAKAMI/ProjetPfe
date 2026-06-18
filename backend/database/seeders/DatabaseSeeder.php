<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Utilisateur::factory(10)->create();

        Utilisateur::factory()->create([
            'nom_ut' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(DemoSeeder::class);
    }
}
