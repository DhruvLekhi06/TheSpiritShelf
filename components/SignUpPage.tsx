import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Input from './common/Input';
import { useAuthContext } from '../contexts/AuthContext';
import AuthLayout from './AuthLayout';
import { motion, Variants } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';

const formVariants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Fix: Explicitly type GoogleIcon as React.FC to resolve component type inference error.
const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Corrected the try-catch-finally block syntax.
  const handleGoogleSignUp = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
        await signInWithGoogle();
        navigate('/');
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <AuthLayout
        title="Create an Account"
        subtitleText="Already a member?"
        subtitleLinkText="Sign in"
        subtitleLinkTo="/signin"
      >
        <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="show"
        >
          {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          <motion.div variants={itemVariants}>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />
          </motion.div>

          <motion.div className="pt-4" variants={itemVariants}>
            <Button type="submit" className="w-full justify-center py-3" loading={isLoading} disabled={isGoogleLoading}>
              Create Account
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
        >
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-brand-outline"></div>
                <span className="flex-shrink mx-4 text-brand-muted text-sm">OR</span>
                <div className="flex-grow border-t border-brand-outline"></div>
            </div>

            <Button
                variant="secondary"
                type="button"
                className="w-full justify-center py-3 !bg-white !text-brand-dark hover:!bg-gray-200 flex items-center gap-3"
                loading={isGoogleLoading}
                onClick={handleGoogleSignUp}
                disabled={isLoading || isGoogleLoading}
            >
                <GoogleIcon />
                <span>Sign up with Google</span>
            </Button>
        </motion.div>
      </AuthLayout>
    </motion.div>
  );
};

export default SignUpPage;