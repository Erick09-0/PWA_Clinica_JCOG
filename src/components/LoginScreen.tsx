import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2, Mail, Lock } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signIn({ email, password });
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Error iniciando sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!email) {
        setError('Ingresa tu correo para enviar el enlace');
        return;
      }
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSuccessMessage('Revisa tu correo para continuar con el cambio de contraseña');
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'No se pudo enviar el enlace de recuperación';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-3xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.2)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <span className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg mb-4">
            <ShieldCheck className="w-8 h-8" />
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inicia sesión en la plataforma
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra el inventario y las alertas de tu clínica
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10"
                placeholder="tu-correo@clinica.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-xl">
              {successMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Iniciar sesión
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm text-blue-600 dark:text-blue-400"
            onClick={handleResetPassword}
            disabled={loading}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
