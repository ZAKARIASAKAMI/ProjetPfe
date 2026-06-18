import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';
import { LuLoader, LuTriangleAlert } from 'react-icons/lu';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await httpClient.post('login', formData);

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/home');

    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      const errorMsg = err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageMeta title="Connexion | FlowStock" />
    <div className="relative min-h-screen w-full flex justify-center items-center py-16 md:py-10">
      <div className="card md:w-lg w-screen z-10 mx-4">
        <div className="text-center px-10 py-12">
          <Link to="/home" className="flex justify-center">
            <img src={logoDark} alt="logo dark" className="h-8 flex dark:hidden" />
            <img src={logoLight} alt="logo light" className="h-8 hidden dark:flex" />
          </Link>

          <div className="mt-8 text-center">
            <h4 className="mb-2.5 text-xl font-semibold text-primary">Bienvenue !</h4>
            <p className="text-base text-default-500">Connectez-vous pour accéder à FlowStock.</p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded flex items-center gap-2 text-sm text-left">
              <LuTriangleAlert className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left w-full mt-8">
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Ex: membre@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" title="Mot de passe" className="block font-medium text-default-900 text-sm mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Éntrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input id="checkbox-1" type="checkbox" className="form-checkbox" />
              <label className="text-default-900 text-sm font-medium" htmlFor="checkbox-1">
                Se souvenir de moi
              </label>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary text-white w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <><LuLoader className="animate-spin size-4" /> Connexion en cours...</>
                ) : (
                  'Se Connecter'
                )}
              </button>
            </div>

            <div className="mt-10 text-center border-t border-default-200 pt-6">
              <p className="text-sm text-default-500">
                Accès restreint aux membres autorisés uniquement.
              </p>
              <p className="text-base text-default-500 mt-4">
                Pas encore de compte ?{' '}
                <Link to="/basic-register" className="font-semibold underline hover:text-primary transition duration-200">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <svg aria-hidden="true" className="absolute inset-0 size-full fill-black/2 stroke-black/5 dark:fill-white/2.5 dark:stroke-white/2.5">
          <defs>
            <pattern id="authPattern" width="56" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
              <path d="M.5 56V.5H72" fill="none"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#authPattern)"></rect>
        </svg>
      </div>
    </div>
  </>;
};
export default Index;
