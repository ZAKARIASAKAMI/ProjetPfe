<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'FlowStock') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Instrument Sans', 'sans-serif'],
                    },
                    colors: {
                        primary: '#f53003',
                    }
                }
            }
        }
    </script>

    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body class="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
    
    <!-- Navigation -->
    <header class="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                F
            </div>
            <span class="text-xl font-semibold tracking-tight">{{ config('app.name', 'FlowStock') }}</span>
        </div>

        @if (Route::has('login'))
            <nav class="flex items-center gap-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-medium hover:text-primary transition-colors">Log in</a>
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                            Get Started
                        </a>
                    @endif
                @endauth
            </nav>
        @endif
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex items-center justify-center px-6">
        <div class="max-w-4xl w-full text-center space-y-8 py-20">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase border border-primary/20">
                🚀 Welcome to the Future of Stock Management
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                Manage your stock <br class="hidden md:block"> with absolute precision.
            </h1>
            
            <p class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Streamline your operations, track movements in real-time, and scale your business with FlowStock's modern management platform.
            </p>

            <div class="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                <a href="http://localhost:5173" class="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Go to Dashboard
                </a>
                <a href="https://laravel.com/docs" target="_blank" class="w-full md:w-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    Documentation
                </a>
            </div>

            <!-- Dashboard Preview / Info -->
            <div class="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-200 dark:border-zinc-800">
                <div class="space-y-2">
                    <h3 class="font-bold text-lg">Real-time Tracking</h3>
                    <p class="text-zinc-500 dark:text-zinc-500 text-sm">Monitor every item movement and stock level change instantly from any device.</p>
                </div>
                <div class="space-y-2">
                    <h3 class="font-bold text-lg">API First</h3>
                    <p class="text-zinc-500 dark:text-zinc-500 text-sm">Powerful REST API built with Laravel, ready to integrate with your favorite systems.</p>
                </div>
                <div class="space-y-2">
                    <h3 class="font-bold text-lg">Modern UI</h3>
                    <p class="text-zinc-500 dark:text-zinc-500 text-sm">Blazing fast React frontend with a clean, intuitive interface designed for humans.</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="w-full max-w-7xl mx-auto px-6 py-12 text-center text-zinc-500 dark:text-zinc-600 text-sm">
        <p>&copy; {{ date('Y') }} {{ config('app.name', 'FlowStock') }}. Built with Laravel & React.</p>
    </footer>

</body>
</html>
