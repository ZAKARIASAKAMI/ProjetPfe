<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|string|unique:utilisateurs,email',
                'password' => 'required|string|min:6',
            ]);

            $user = Utilisateur::create([
                'nom_ut' => $validated['name'],
                'email' => $validated['email'],
                'mot_pass' => $validated['password'], // Laravel hashes this automatically due to the 'hashed' cast in the model
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->id_utilisateur,
                    'name' => $user->nom_ut,
                    'email' => $user->email,
                ],
                'message' => 'Compte créé avec succès',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du compte',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login a user
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->mot_pass)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        // Generate a very simple token (not using Sanctum to avoid complexity)
        $token = base64_encode($user->email . '|' . now());

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id_utilisateur,
                'name' => $user->nom_ut,
                'email' => $user->email,
            ],
            'message' => 'Connexion réussie',
        ]);
    }

    /**
     * Logout a user
     */
    public function logout(): JsonResponse
    {
        // Simple logout (just inform client to clear token)
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
