<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): JsonResponse
    {
        $users = Utilisateur::all();
        
        // Map to a structure similar to what the frontend expects
        $mappedUsers = $users->map(function($user) {
            return [
                'id' => $user->id_utilisateur,
                'name' => $user->nom_ut,
                'email' => $user->email,
                'role' => 'Membre', // Add a default role
                'location' => 'Maroc', // Default location
                'phone' => '-',
                'joiningDate' => $user->created_at ? $user->created_at->format('d M, Y') : '-',
                'status' => 'Vérifié'
            ];
        });

        return response()->json($mappedUsers);
    }

    /**
     * Display the specified user.
     */
    public function show($id): JsonResponse
    {
        $user = Utilisateur::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'id' => $user->id_utilisateur,
            'name' => $user->nom_ut,
            'email' => $user->email,
            'role' => 'Membre',
            'location' => 'Maroc',
            'phone' => '-',
            'joiningDate' => $user->created_at ? $user->created_at->format('d M, Y') : '-',
            'status' => 'Vérifié'
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Utilisateur::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom_ut' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email,' . $id . ',id_utilisateur',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id): JsonResponse
    {
        $user = Utilisateur::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
