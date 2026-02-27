import React, { useState } from 'react';
import { Alcohol, Cocktail } from '../types';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './common/Button';
import { COCKTAIL_DATABASE } from '../constants';

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

    // Simulate a brief delay for a better user experience
    setTimeout(() => {
      const compatibleCocktails = COCKTAIL_DATABASE.filter(cocktail =>
        cocktail.compatibleWith.includes(alcohol.type)
      );

      if (compatibleCocktails.length === 0) {
        setError(`We don't have specific cocktail recipes for ${alcohol.type} in our database yet, but it's undoubtedly great for sipping neat or on the rocks!`);
        setIsLoading(false);
        return;
      }

      // Shuffle the array and pick up to 2 recipes
      const shuffled = [...compatibleCocktails].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);

      const markdownResponse = selected.map((cocktail: Cocktail) => `
### ${cocktail.name}
**${cocktail.description}**

**Ingredients:**
${cocktail.ingredients.map((ing: string) => `- ${ing.replace(alcohol.type, `*${alcohol.name}*`)}`).join('\n')}

**Instructions:**
${cocktail.instructions.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}
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
          Unsure how to enjoy your {alcohol.name}? Let our expert mixologists suggest some creative cocktail ideas for you.
        </p>
        <div className="mt-6">
          <Button onClick={getCocktailIdeas} loading={isLoading} disabled={isLoading}>
            🍸 Get Cocktail Ideas
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