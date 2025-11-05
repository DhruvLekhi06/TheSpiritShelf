import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Input from './common/Input';
import { useAuthContext } from '../contexts/AuthContext';
import AuthLayout from './AuthLayout';
// Fix: Import Variants type from framer-motion.
import { motion, Variants } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';

const formVariants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fix: Explicitly typed itemVariants to resolve type error for 'ease' property.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};


const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        title="Welcome Back"
        subtitleText="Don't have an account?"
        subtitleLinkText="Create one now"
        subtitleLinkTo="/signup"
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
              disabled={isLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </motion.div>

          <motion.div className="pt-4" variants={itemVariants}>
            <Button type="submit" className="w-full justify-center py-3" loading={isLoading}>
              Sign In
            </Button>
          </motion.div>
        </motion.form>
      </AuthLayout>
    </motion.div>
  );
};

export default SignInPage;
