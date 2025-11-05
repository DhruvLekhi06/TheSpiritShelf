import React, { useState } from 'react';
import { Alcohol } from '../types';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './common/Button';
import { COCKTAIL_DATA } from '../constants';

interface CocktailAssistantProps {
  alcohol: Alcohol;
}

const CocktailAssistant: React.FC<CocktailAssistantProps> = ({ alcohol }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCocktailIdeas = () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Simulate a quick search for better UX
    setTimeout(() => {
      const relevantCocktails = COCKTAIL_DATA.filter(
        cocktail => cocktail.alcoholType === alcohol.type
      );

      if (relevantCocktails.length === 0) {
        setError(`Sorry, we don't have any specific cocktail ideas for ${alcohol.type} just yet. Check back later!`);
        setIsLoading(false);
        return;
      }

      // Shuffle the array and pick up to 3 recipes
      const shuffled = [...relevantCocktails].sort(() => 0.5 - Math.random());
      const selectedCocktails = shuffled.slice(0, 3);

      // Format the selected cocktails into a Markdown string
      const markdownResponse = selectedCocktails.map(cocktail => `
### ${cocktail.name}
**${cocktail.description}**

**Ingredients:**
${cocktail.ingredients.map(ing => `- ${ing}`).join('\n')}

**Instructions:**
${cocktail.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}
      `).join('\n\n---\n\n');

      setResponse(markdownResponse);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-brand-surface border border-brand-outline rounded-lg p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-serif text-brand-light">Cocktail Corner</h2>
        <p className="text-brand-muted mt-2 max-w-2xl mx-auto">
          Unsure how to enjoy your {alcohol.name}? Let our mixologist craft some unique cocktail ideas for you.
        </p>
        <div className="mt-6">
          <Button onClick={getCocktailIdeas} loading={isLoading} disabled={isLoading}>
            ✨ Get Cocktail Ideas
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center mt-6 text-brand-muted"
          >
            Shaking up some creative concoctions...
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 bg-red-900/50 text-red-300 p-4 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:text-brand-accent prose-headings:border-b prose-headings:border-brand-outline prose-headings:pb-2 prose-ul:list-disc prose-ul:ml-6 prose-strong:text-brand-light"
            dangerouslySetInnerHTML={{ __html: marked(response) as string }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CocktailAssistant;
