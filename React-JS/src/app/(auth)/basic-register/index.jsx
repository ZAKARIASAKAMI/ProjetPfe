import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import PageMeta from '@/components/PageMeta';
import httpClient from '@/helpers/httpClient';
import { LuLoader, LuTriangleAlert, LuCircleCheck } from 'react-icons/lu';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const field = name || id;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await httpClient.post('register', formData);
      console.log('Registration response:', response.data);

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/basic-login');
      }, 2000);

    } catch (err) {
      console.error('Erreur lors de l’inscription:', err);
      // Detailed error handling
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setError(errorData.errors);
      } else if (errorData?.error) {
        // This captures the Exception message I added to the backend
        setError(errorData.error);
      } else {
        setError(errorData?.message || 'Une erreur est survenue. Veuillez vérifier vos informations.');
      }
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageMeta title="Inscription | FlowStock" />
    <div className="relative min-h-screen w-full flex justify-center items-center py-16 md:py-10">
      <div className="card md:w-lg w-screen z-10 mx-4">
        <div className="text-center px-10 py-12">
          <Link to="/home" className="flex justify-center">
            <img src={logoDark} alt="logo dark" className="h-8 flex dark:hidden" />
            <img src={logoLight} alt="logo light" className="h-8 hidden dark:flex" />
          </Link>

          <div className="mt-8 text-center">
            <h4 className="mb-2.5 text-xl font-semibold text-primary">
              Créer un Compte
            </h4>
            <p className="text-base text-default-500">Rejoignez FlowStock dès aujourd'hui.</p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded flex flex-col gap-2 text-sm text-left">
              <div className="flex items-center gap-2 font-bold">
                <LuTriangleAlert className="size-4 shrink-0" />
                {typeof error === 'string' ? error : 'Erreur de validation'}
              </div>
              {/* Specific field errors if any */}
              {typeof error === 'object' && Object.entries(error).map(([field, msgs], i) => (
                <div key={i} className="ps-6">
                  <span className="font-semibold uppercase text-[10px]">{field}:</span>
                  {Array.isArray(msgs) ? msgs.map((m, j) => <p key={j}>- {m}</p>) : <p>- {msgs}</p>}
                </div>
              ))}
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 text-success rounded flex items-center gap-2 text-sm text-left">
              <LuCircleCheck className="size-4 shrink-0" />
              Compte créé avec succès ! Redirection vers la page de connexion...
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left w-full mt-8">
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-default-900 text-sm mb-2">
                Nom Complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Éntrez votre nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
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
                name="password"
                className="form-input"
                placeholder="Éntrez un mot de passe (min 6 caractères)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <p className="italic text-sm font-medium text-default-500 mt-4">
              En vous inscrivant, vous acceptez les{' '}
              <Link to="#" className="underline text-primary">
                Conditions d'Utilisation
              </Link>
            </p>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={loading || success}
                className="btn bg-primary text-white w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <><LuLoader className="animate-spin size-4" /> Inscription...</>
                ) : (
                  'Créer mon Compte'
                )}
              </button>
            </div>

            <div className="mt-10 text-center border-t border-default-200 pt-6">
              <p className="text-base text-default-500">
                Vous avez déjà un compte ?{' '}
                <Link to="/basic-login" className="font-semibold underline hover:text-primary transition duration-200">
                  Se Connecter
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
