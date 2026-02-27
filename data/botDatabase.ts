// This file acts as the bot's internal "brain" or knowledge base.
// It's structured to allow for both broad topic matching and specific sub-topic queries.

// --- TYPE DEFINITIONS (for clarity, not strictly enforced by TS in this context) ---

// For simple, direct responses like greetings.
interface BotSimpleEntry {
  keywords: string[];
  response: string[];
}

// For complex topics with a general overview and specific sub-questions.
interface BotSubtopic {
  keywords: string[];
  response: string;
}
interface BotComplexEntry {
  keywords: string[];
  mainResponse: string;
  subtopics: BotSubtopic[];
}

interface BotKnowledgeCategory {
  category: string;
  items: {
    [key: string]: BotComplexEntry;
  };
}

// --- UTILITY FUNCTION ---

const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// --- KNOWLEDGE BASE DATA ---

export const WELCOME_SLANGS = [
    "Time to get into the spirit of things! What can I help you find?",
    "Let's get this party started! Ask me for a recommendation.",
    "They say 'take it with a grain of salt'... I say take it with a slice of lime. Welcome! How can I help?",
    "Here for a good time, not a long time. What are we drinking tonight?",
    "Welcome! Let's make some 'pour' decisions together. What are you looking for?"
];

// The main export, structured with simple entries and categorized complex entries.
export const BOT_DATABASE: { [key: string]: BotKnowledgeCategory | BotSimpleEntry } = {
  // --- Simple Entries ---
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'whatsup'],
    response: ["Hello! How can I help you explore the world of spirits today?", "Hi there! I'm your guide to everything on The Spirit Shelf. What can I help you find?", "Welcome! Ask me for recommendations or about any spirit you see."],
  },
  farewell: {
    keywords: ['bye', 'goodbye', 'see ya', 'later'],
    response: ["Cheers!", "Enjoy responsibly! Goodbye.", "Farewell! Come back anytime."],
  },
  thanks: {
    keywords: ['thanks', 'thank you', 'appreciate it', 'awesome', 'cool'],
    response: ["You're welcome!", "My pleasure!", "Happy to help!"],
  },
  about: {
    keywords: ['who are you', 'what are you', 'what is this', 'about you', 'how do you work'],
    response: ["I'm the AI assistant for The Spirit Shelf. I can help you find drinks, get recommendations, and learn about the spirits industry. I use a comprehensive internal knowledge base to provide fast and accurate answers without external APIs."],
  },

  // --- Complex, Categorized Entries ---
  recommendations: {
    category: 'Recommendations',
    items: {
      party: {
        keywords: ['party', 'gathering', 'for a crowd', 'for friends', 'social event'],
        mainResponse: "For a party, versatility is key. **Vodka** is fantastic for a wide range of cocktails. A good quality **Blanco Tequila** for Margaritas is also a huge crowd-pleaser. If you want something simpler, a smooth **Blended Whiskey** is always a great choice.",
        subtopics: [],
      },
      quiet_night: {
        keywords: ['quiet night', 'relaxing', 'unwind', 'sipping', 'chilling', 'evening at home'],
        mainResponse: "For a relaxing evening, you can't beat a complex **Single Malt Scotch** or a high-quality **Aged Rum**. If you prefer something richer, an **XO Cognac** is the perfect nightcap. These are best enjoyed neat or with a single large ice cube.",
        subtopics: [],
      },
      gift: {
        keywords: ['gift', 'present', 'for a friend', 'what to buy for'],
        mainResponse: "A great gift depends on their taste! A beautifully bottled **Japanese Whisky** is always elegant. For a gin lover, a unique **Craft Gin** is a thoughtful choice. If you're unsure, a **Premium Blended Scotch** like Johnnie Walker Blue Label is a classic luxury gift.",
        subtopics: [],
      },
      beginner: {
        keywords: ['beginner', 'new to whiskey', 'starting out', 'smooth whiskey', 'easy to drink'],
        mainResponse: "If you're new to whiskey, I'd recommend starting with something smooth and approachable. An **Irish Whiskey** like Jameson is famously smooth. A **Speyside Scotch** like Glenfiddich 12 or The Glenlivet Founder's Reserve is also a great starting point, with honeyed and fruity notes. For American whiskey, **Maker's Mark** is a sweeter, wheated bourbon that's very easy to drink.",
        subtopics: [],
      },
    },
  },

  spiritKnowledge: {
      category: "Spirit Knowledge",
      items: {
        whiskey: {
            keywords: ['whiskey', 'whisky', 'bourbon', 'scotch', 'rye'],
            mainResponse: "Whiskey is a spirit distilled from fermented grain mash (barley, corn, rye, or wheat) and aged in wooden casks. Its flavor is incredibly diverse, depending on its origin, ingredients, and aging process.",
            subtopics: [
                {
                    keywords: ['made from', 'ingredients', 'what is it made of', 'grain'],
                    response: "Whiskey's ingredients depend on its type. Scotch is primarily made from malted barley, Bourbon from at least 51% corn, and Rye from at least 51% rye grain."
                },
                {
                    keywords: ['difference', 'vs', 'single malt vs blended', 'single malt', 'blended'],
                    response: "A **Single Malt** is a whisky made at one distillery from 100% malted barley. A **Blended Whisky** mixes whiskies from multiple distilleries to create a consistent flavor. Both can be excellent!"
                },
                {
                    keywords: ['aged', 'aging process', 'how long', 'cask', 'barrel'],
                    response: "Whiskey is aged in wooden casks, usually oak. The type of cask (e.g., new American oak for Bourbon, used sherry casks for some Scotches) has a huge impact on the final flavor. The legal minimum aging time varies by country."
                },
                {
                    keywords: ['origin', 'where from', 'regions', 'speyside', 'islay'],
                    response: "Major whiskey regions include Scotland (known for Scotch, with sub-regions like Speyside and Islay), the USA (Bourbon and Rye), Ireland (Irish Whiskey), and Japan (Japanese Whisky)."
                }
            ]
        },
        gin: {
             keywords: ['gin', 'botanicals'],
             mainResponse: "Gin is a neutral spirit flavored primarily with juniper berries. Its unique character comes from a blend of other botanicals like citrus peel, coriander, and angelica root, which are infused during distillation.",
             subtopics: [
                {
                    keywords: ['made from', 'ingredients', 'what is it made of'],
                    response: "Gin starts as a neutral spirit (like vodka) made from grain. Its flavor is then created by infusing it with juniper berries and a custom mix of other botanicals."
                },
                {
                    keywords: ['types', 'london dry', 'old tom', 'styles'],
                    response: "There are several styles of gin. **London Dry** is the most common, known for its crisp, juniper-forward profile. **Old Tom** is a slightly sweeter, historical style. **Contemporary** gins often experiment with a wide range of unique botanicals."
                }
             ]
        },
        vodka: {
            keywords: ['vodka'],
            mainResponse: "Vodka is a neutral spirit, usually distilled from fermented grains or potatoes. It's often distilled multiple times for high purity, resulting in a clean, smooth spirit that's a perfect base for many cocktails.",
            subtopics: [
                {
                    keywords: ['made from', 'ingredients', 'what is it made of'],
                    response: "Traditionally, vodka was made from potatoes, but now it's most commonly distilled from grains like corn, rye, or wheat. The source material can subtly influence the final taste and texture."
                }
            ]
        },
        rum: {
            keywords: ['rum'],
            mainResponse: "Rum is a spirit made from sugarcane byproducts, most commonly molasses or pure sugarcane juice. It's aged in barrels, and its color can range from clear (light rum) to dark brown (aged rum), with flavors spanning from sweet and grassy to rich and spicy.",
            subtopics: [
                 {
                    keywords: ['types', 'styles', 'light vs dark', 'spiced', 'agricole'],
                    response: "Rum has many styles! **Light Rum** is clear and crisp, great for cocktails. **Aged Rum** (often dark) is richer and ideal for sipping. **Spiced Rum** is infused with spices like cinnamon and vanilla. **Rhum Agricole** is made from fresh sugarcane juice, giving it a grassy, earthy flavor."
                }
            ]
        },
        tequila: {
            keywords: ['tequila', 'mezcal'],
            mainResponse: "Tequila is a spirit made exclusively from the blue Weber agave plant in specific regions of Mexico. It can be unaged ('blanco'), rested in oak ('reposado'), or aged in oak ('añejo').",
            subtopics: [
                {
                    keywords: ['difference', 'vs', 'mezcal'],
                    response: "It's a common question! All tequilas are technically mezcals, but not all mezcals are tequilas. **Tequila** can ONLY be made from Blue Weber agave. **Mezcal** can be made from over 30 types of agave. Mezcal often has a smoky flavor because the agave hearts are traditionally roasted in underground pits before fermentation."
                },
                {
                    keywords: ['types', 'styles', 'blanco', 'reposado', 'añejo'],
                    response: "**Blanco** (or Silver) is unaged and has a pure agave flavor. **Reposado** is 'rested' in oak for 2-12 months, giving it a smoother taste and light color. **Añejo** is aged for 1-3 years, making it complex and rich, perfect for sipping."
                }
            ]
        },
      }
  },

  pairingSuggestions: {
      category: "Pairing Suggestions",
      items: {
          whiskey_pairing: {
            keywords: ['whiskey', 'scotch', 'bourbon'],
            mainResponse: "Whiskey is very versatile with food! A bold, smoky Scotch pairs wonderfully with grilled steak or strong cheeses, while a sweeter Bourbon is great with BBQ or desserts.",
            subtopics: [
                {
                    keywords: ['steak', 'red meat', 'beef'],
                    response: "For a rich cut of steak, you want a whiskey that can stand up to it. A peated Islay Scotch like Laphroaig or Ardbeg is a classic pairing. A bold, spicy Rye whiskey also works beautifully."
                },
                {
                    keywords: ['cheese'],
                    response: "For cheese pairings, a sweet Bourbon complements a sharp cheddar. A smoky Islay Scotch is incredible with a creamy blue cheese. A fruity Speyside Scotch works well with a soft brie."
                },
                {
                    keywords: ['dessert', 'chocolate', 'sweet'],
                    response: "A sherry-cask finished Scotch is a perfect match for dark chocolate. A sweeter Bourbon like Maker's Mark is fantastic with pecan pie or caramel-based desserts."
                }
            ]
          },
          gin_pairing: {
            keywords: ['gin'],
            mainResponse: "Gin's botanical nature makes it a fantastic match for seafood, especially smoked salmon or prawns. Its herbal notes also complement spicy food like Indian or Thai curry.",
            subtopics: [
                {
                    keywords: ['seafood', 'fish', 'salmon', 'oysters'],
                    response: "A classic London Dry Gin, with its crisp citrus and juniper notes, is the perfect pairing for seafood. It cuts through the richness of smoked salmon and complements the brininess of oysters beautifully."
                }
            ]
          },
      }
  },

  cocktailAndMixology: {
      category: "Cocktail & Mixology",
      items: {
        bitters: {
            keywords: ['bitters', 'angostura', 'peychauds'],
            mainResponse: "Bitters are like the salt and pepper of the cocktail world! They are a concentrated infusion of botanicals in alcohol. Just a few dashes can add immense complexity and balance to a drink.",
            subtopics: []
        },
        shaking_stirring: {
            keywords: ['shaken or stirred', 'shake vs stir', 'when to shake', 'when to stir'],
            mainResponse: "A simple rule: **Shake** cocktails that contain citrus, egg white, or cream (like a Daiquiri or Whiskey Sour). **Stir** cocktails that are made entirely of spirits (like a Martini, Manhattan, or Negroni).",
            subtopics: []
        },
        glassware: {
            keywords: ['glass', 'glassware', 'proper glass'],
            mainResponse: "Glassware can enhance the drinking experience. For tasting whiskey, a **Glencairn** is best to concentrate aromas. For cocktails, a **rocks glass**, **Highball**, or **coupe** are common choices depending on the drink.",
            subtopics: []
        },
        vermouth: {
            keywords: ['vermouth', 'dry vermouth', 'sweet vermouth'],
            mainResponse: "Vermouth is a fortified and aromatized wine, essential in many classic cocktails. **Sweet Vermouth** (usually red) is key in Manhattans and Negronis, while **Dry Vermouth** (usually white) is a must for a classic Martini.",
            subtopics: []
        }
      }
  },

  industryFacts: {
      category: "Industry Facts",
      items: {
        abv: {
            keywords: ['abv', 'alcohol by volume', 'proof'],
            mainResponse: "ABV stands for 'Alcohol By Volume'. It's the standard measure of how much alcohol is in a beverage. 'Proof' is another measure, and in the US, it's simply double the ABV (e.g., 40% ABV is 80 Proof).",
            subtopics: []
        },
        age_statement: {
            keywords: ['age statement', 'year old mean', '12 year'],
            mainResponse: "An age statement on a bottle (e.g., '12 Years Old') refers to the age of the **youngest** spirit in the bottle. If a whisky is a blend of 12-year-old and 18-year-old spirits, it must be labeled as 12 years old.",
            subtopics: []
        },
        angels_share: {
            keywords: ["angel's share", 'angels share'],
            mainResponse: "The 'Angel's Share' is a romantic term for the amount of spirit that is lost to evaporation from the oak cask during the aging process. The rate of evaporation depends on the climate—it's much higher in warmer climates.",
            subtopics: []
        },
        cask_strength: {
            keywords: ['cask strength', 'barrel proof'],
            mainResponse: "'Cask Strength' (or 'Barrel Proof') means the spirit has been bottled at the same alcohol percentage it had in the barrel, without being diluted with water. This results in a much higher ABV and a more intense flavor.",
            subtopics: []
        },
        distillation: {
            keywords: ['distillation', 'how is it made', 'distilled', 'still'],
            mainResponse: "Distillation is the process of separating alcohol from water in a fermented liquid (like a beer or wine). The liquid is heated in a still, and because alcohol boils at a lower temperature than water, it turns into vapor first. This vapor is then collected and cooled back into a liquid, which is now a much stronger spirit.",
            subtopics: []
        },
      }
  },

  // --- Fallback Entry ---
  fallback: {
      category: "Fallback",
      items: {
          main_fallback: {
            keywords: [],
            mainResponse: "I'm not quite sure how to answer that. I'm an expert on spirits! You can ask me things like:\n- **'What's the difference between Scotch and Bourbon?'**\n- **'What food goes well with gin?'**\n- **'What's a good gift for a whiskey lover?'**\n- **'Tell me about the angel's share.'**",
            subtopics: []
        }
      }
  }
};
