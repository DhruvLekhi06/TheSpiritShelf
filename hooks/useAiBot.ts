import { useState, useCallback, useMemo } from 'react';
import { ChatMessage, Alcohol, AlcoholType, Cocktail } from '../types';
import { useLocationAdjustedAlcoholData } from './useLocationAdjustedAlcoholData';
import { BOT_DATABASE, WELCOME_SLANGS } from '../data/botDatabase';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { COCKTAIL_DATABASE } from '../constants';

const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const initialMessage: ChatMessage = {
  id: Date.now(),
  sender: 'bot',
  text: getRandomResponse(WELCOME_SLANGS),
};

export const useAiBot = () => {
    const alcoholData = useLocationAdjustedAlcoholData();
    const { reviews } = useReviewsContext();
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [isTyping, setIsTyping] = useState(false);

    const getAlcoholsWithRatings = useCallback(() => {
        return alcoholData.map(alcohol => {
            const relevantReviews = reviews.filter(r => r.alcoholId === alcohol.id);
            const reviewCount = relevantReviews.length;
            let averageRating = alcohol.rating;
            if (reviewCount > 0) {
                const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
                averageRating = sum / reviewCount;
            }
            return { ...alcohol, averageRating, reviewCount };
        });
    }, [alcoholData, reviews]);
    
    const alcoholsWithRatings = useMemo(() => getAlcoholsWithRatings(), [getAlcoholsWithRatings]);

    const generateBotResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase().trim();

        // --- Complex Budget/Group Query ---
        const budgetRegex = /budget.*?(\d{1,3}(,\d{3})*(\.\d+)?|(\d+k?))/;
        const peopleRegex = /(\d+)\s*(people|of us|boys|girls)/;
        
        const budgetMatch = lowerInput.match(budgetRegex);
        const peopleMatch = lowerInput.match(peopleRegex);

        if (budgetMatch && peopleMatch) {
            let budget = parseFloat(budgetMatch[1].replace(/,/g, '').replace('k', '000'));
            const people = parseInt(peopleMatch[1], 10);
            
            if (!isNaN(budget) && !isNaN(people) && people > 0) {
                const budgetPerPerson = budget / people;
                const recommendations = alcoholsWithRatings.filter(a => a.price <= budgetPerPerson * 2 && a.price > budgetPerPerson / 2).sort((a,b) => b.averageRating - a.averageRating);
                
                if (recommendations.length > 0) {
                    const topRec = recommendations[0];
                    const secondRec = recommendations.find(r => r.type !== topRec.type) || recommendations[1];

                    let response = `Okay, with a budget of ₹${budget.toLocaleString('en-IN')} for ${people} people, that's about ₹${budgetPerPerson.toLocaleString('en-IN')} per person.\n\n`;
                    response += `You could get a few bottles of something excellent like **${topRec.name}** (₹${topRec.price.toLocaleString('en-IN')}).\n\n`;
                    if (secondRec && secondRec.id !== topRec.id) {
                         response += `Or for something different, a great option would be **${secondRec.name}** (₹${secondRec.price.toLocaleString('en-IN')}).\n\n`;
                    }
                    response += "These are popular choices that offer great value. Enjoy your night out!";
                    return response;
                } else {
                    return `With a budget of ₹${budgetPerPerson.toLocaleString('en-IN')} per person, it's a bit tricky to find a bottle. Perhaps consider pooling your budget for a couple of really nice bottles!`;
                }
            }
        }

        // --- Dynamic Data Queries ---
        const ratingMatch = lowerInput.match(/(highest|best) rated ([\w\s]+)/);
        if (ratingMatch) {
            const typeQuery = ratingMatch[2].trim().toLowerCase();
            const types = Object.values(AlcoholType).map(t => t.toLowerCase());
            let spiritsToSearch = alcoholsWithRatings;
            
            if (types.some(t => typeQuery.includes(t))) {
                const foundType = Object.values(AlcoholType).find(t => typeQuery.includes(t.toLowerCase()));
                spiritsToSearch = alcoholsWithRatings.filter(a => a.type === foundType);
            }

            if (spiritsToSearch.length === 0) {
                return `Sorry, I couldn't find any spirits of that type.`;
            }

            spiritsToSearch.sort((a, b) => b.averageRating - a.averageRating);
            const topSpirit = spiritsToSearch[0];
            return `The highest-rated ${typeQuery} is the **${topSpirit.name}** with a rating of ${topSpirit.averageRating.toFixed(1)}! You can find it on its product page.`;
        }
        
        const priceMatch = lowerInput.match(/(cheapest|most affordable|lowest price|most expensive|priciest) ([\w\s]+)/);
        if (priceMatch) {
            const qualifier = priceMatch[1];
            const typeQuery = priceMatch[2].trim().toLowerCase();
            const types = Object.values(AlcoholType).map(t => t.toLowerCase());
            let spiritsToSearch = alcoholsWithRatings;

            if (types.some(t => typeQuery.includes(t))) {
                const foundType = Object.values(AlcoholType).find(t => typeQuery.includes(t.toLowerCase()));
                spiritsToSearch = alcoholsWithRatings.filter(a => a.type === foundType);
            }
            
            if (spiritsToSearch.length === 0) {
                return `Sorry, I couldn't find any spirits of that type.`;
            }

            const isExpensive = qualifier.includes('expensive') || qualifier.includes('priciest');
            spiritsToSearch.sort((a, b) => isExpensive ? b.price - a.price : a.price - b.price);
            const targetSpirit = spiritsToSearch[0];
            
            return `The ${isExpensive ? 'most expensive' : 'most affordable'} ${typeQuery} is the **${targetSpirit.name}** priced at ₹${targetSpirit.price.toLocaleString('en-IN')}.`;
        }

        // --- Cocktail Recommendation Query ---
        const cocktailMatch = lowerInput.match(/cocktail with ([\w\s]+)/);
        if (cocktailMatch) {
            const spiritQuery = cocktailMatch[1].trim().toLowerCase();
            const foundType = Object.values(AlcoholType).find(t => spiritQuery.includes(t.toLowerCase()));

            if (foundType) {
                const compatibleCocktails = COCKTAIL_DATABASE.filter(c => c.compatibleWith.includes(foundType));
                if (compatibleCocktails.length > 0) {
                    const cocktail = compatibleCocktails[Math.floor(Math.random() * compatibleCocktails.length)];
                     return `A great choice for a ${foundType} cocktail is the **${cocktail.name}**.\n\n**Ingredients:**\n${cocktail.ingredients.map(ing => `- ${ing}`).join('\n')}\n\n**Instructions:**\n${cocktail.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
                } else {
                    return `I don't have a specific cocktail for ${foundType} right now, but it's great on the rocks!`;
                }
            }
        }
        
        // --- Knowledge Base Search: Two-Pass System ---
        
        // 1. Check for simple, direct matches (greetings, etc.)
        const simpleEntries = ['greeting', 'farewell', 'thanks', 'about'];
        for (const key of simpleEntries) {
            const entry = BOT_DATABASE[key] as any; 
            if (entry.keywords.some((kw: string) => lowerInput.includes(kw))) {
                return Array.isArray(entry.response) ? getRandomResponse(entry.response) : entry.response;
            }
        }

        // 2. Two-Pass Search for complex, categorized topics
        let bestTopicMatch: { score: number, entry: any | null } = { score: 0, entry: null };

        // Pass 1: Find the best general topic by scoring keyword matches
        Object.values(BOT_DATABASE).forEach(entryOrCategory => {
            if ('category' in entryOrCategory) {
                Object.values((entryOrCategory as any).items).forEach((item: any) => {
                    let score = 0;
                    item.keywords.forEach((kw: string) => {
                        if (lowerInput.includes(kw)) {
                            score += kw.length; // Longer keywords get a higher score
                        }
                    });
                    if (score > bestTopicMatch.score) {
                        bestTopicMatch = { score, entry: item };
                    }
                });
            }
        });

        // If a decent topic was found, proceed to Pass 2
        if (bestTopicMatch.score > 3 && bestTopicMatch.entry) {
            let bestSubtopicMatch: { score: number, response: string | null } = { score: 0, response: null };

            // Pass 2: Find the most specific sub-topic within the matched topic
            if (bestTopicMatch.entry.subtopics) {
                bestTopicMatch.entry.subtopics.forEach((subtopic: any) => {
                    let subScore = 0;
                    subtopic.keywords.forEach((kw: string) => {
                        if (lowerInput.includes(kw)) {
                            subScore += kw.length;
                        }
                    });
                    if (subScore > bestSubtopicMatch.score) {
                        bestSubtopicMatch = { score: subScore, response: subtopic.response };
                    }
                });
            }

            // If a specific subtopic is a good match, use its response.
            // Otherwise, use the main topic's general response.
            if (bestSubtopicMatch.score > 2 && bestSubtopicMatch.response) {
                return bestSubtopicMatch.response;
            } else {
                return bestTopicMatch.entry.mainResponse;
            }
        }


        // --- Fallback ---
        const fallbackCategory = BOT_DATABASE.fallback as any;
        const fallbackEntry = fallbackCategory.items.main_fallback;
        return fallbackEntry.mainResponse;
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const botResponseText = generateBotResponse(text);
            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponseText,
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500); // Simulate typing
    };
    
    return { messages, isTyping, sendMessage, setMessages };
};