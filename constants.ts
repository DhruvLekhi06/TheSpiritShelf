import { Alcohol, AlcoholType, AlcoholCategory, Review, Collection, Guide, User, NewsArticle, CocktailRecipe } from './types';

// A function to generate a more realistic image URL from Unsplash
const generateImageUrl = (name: string, type: AlcoholType, size: string = '400x500') => {
    // Sanitize the name for the URL and create multi-line text
    const words = name.split(' ');
    // Create two lines of text for a cleaner look in the placeholder
    let line1 = words.slice(0, 3).join(' ');
    let line2 = words.slice(3, 6).join(' ');
    let text = line1;
    if (line2) {
        text += `\\n${line2}`; // placehold.co uses \n for newlines
    }
    const encodedText = encodeURIComponent(text);
    return `https://placehold.co/${size}/1e1e1e/e0e0e0/png?text=${encodedText}&font=inter`;
};


export const TASTING_NOTES_OPTIONS = ['Smoky', 'Fruity', 'Smooth', 'Spicy', 'Sweet', 'Herbal', 'Citrus', 'Rich', 'Oaky', 'Peaty', 'Vanilla', 'Floral', 'Bold'];

export const AUTH_PAGE_BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1514362545834-3b74b04b313a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80';

const prices = [
    8990, 15990, 6490, 7290, 4990, 4790, 27690, 28590, 10390, 31390, 7390, 8390, 7790, 7990, 9490, 6790, 5490, 6090, 6690, 3790, 5390, 14190, 47090, 7590, 5990, 409790, 364290, 24190, 2390, 5890, 5290, 7790, 4990, 6990, 5090, 5090, 2390, 4090, 2390, 2690, 5190, 6390, 13890, 6090, 7190, 22790, 31990, 4490, 39390, 11890, 2990, 3290, 2190, 3390, 6390, 4790, 4790, 5390, 6390, 4090, 3800, 7990, 1990, 2690, 24790, 6990, 40790, 18190, 4290, 4790, 6990, 5190, 3790, 5090, 3890, 6990, 2190, 51790, 2390, 9290, 2190, 3590, 2090, 9590, 10890, 5190, 4690, 4690, 6590, 4390, 11290, 14890, 19590, 2990, 3690, 8990, 5990, 11190, 2990, 3690, 3690, 3690, 3290, 3290, 3490, 9090, 13290, 52990, 51490, 7490, 6690, 6190, 58290, 8290, 5290, 5890, 11090, 9890, 3890, 3190, 2990, 3690, 5490, 3190, 3190, 7290, 14390, 18090, 23290, 1990, 2490, 2190, 3990, 6490, 10190, 5790, 9590, 22290, 20590, 20590, 34690, 7290, 22990, 27590, 17490, 7990, 7990, 9090, 13390, 4190, 6390, 10390, 19190, 20790, 27290, 8990, 10990, 4690, 35490, 4490, 26990, 28890, 8290, 14890, 25490, 12190, 3690, 10990, 22090, 10990, 6590, 5690, 6490, 3990, 11290, 14990, 2390, 10890, 2090, 14090, 24090, 3590, 6790, 9490, 12990, 2990, 39190, 7490, 14990, 31890, 6190, 20370, 6690, 32590, 16890, 17190, 27390, 14590, 10090, 12690, 5190, 6890, 1990, 9690, 4890, 3590, 2490, 20590, 12690, 14590, 21490, 25990, 2390, 14690, 6090, 4190, 7790, 13490, 7490, 5890, 27390, 2890, 2090, 6990, 4090, 2590, 1490, 1990, 10990, 6290, 2890, 6290, 2390, 2390, 2290, 2590, 6190, 5290, 5490, 1490, 2090, 2490, 2390, 3690, 8090, 4090, 1590, 1490, 8290, 2890, 2790, 3990, 1590, 4390, 4090, 1790, 2590, 3190, 33490, 2590, 1590, 3390, 1990, 3190, 3290, 3290, 1790, 3590, 1590, 1490, 4990, 2490, 2190, 1490, 6790, 6490, 32690, 2690, 3990, 2690, 2490, 5390, 2090, 2090, 2390, 10290, 7690, 7790, 3690, 7990, 2490, 2690, 1790, 6890, 3190, 20190, 3290, 2890, 13490, 10290, 6190, 5190, 5590, 8290, 21290, 2490, 17690, 2390, 4390, 22790, 2690, 2290, 2390, 4490, 18290, 2190, 2290, 2490, 2490, 1990, 1990, 2190, 3390, 3990, 6190, 5090, 2990, 3190, 2490, 2890, 4090, 4490, 4790, 3590, 3190, 4890, 5590, 4990, 4290, 31190, 18890, 5590, 7890, 22290, 2690, 11290, 9990, 20190, 17690, 6090, 4090, 10290, 3090, 3090, 2690, 2490, 6490, 6390, 3490, 3390, 2790, 2690, 4490, 1990, 11190, 7090, 20690, 5390, 4090, 7090, 5490, 5790, 4290, 6290, 2990, 6190, 8390, 5790, 7490, 4590, 9490, 5390, 6090, 6990, 5690, 7090, 6190, 6190, 4690, 7190, 11290, 3390, 3890, 3390, 3390, 3390, 3490, 2490, 4990, 63490, 32190, 5990, 7590, 7290, 2790, 9690, 10790, 5190, 1590, 6290, 3390, 2390, 5490, 7190, 5990, 7790, 9990, 36590, 10490, 25790, 2290, 5090, 5090, 2290, 6290, 4590, 7490, 10590, 9190, 3490, 3490, 4890, 2090, 6290, 2290, 7990, 10690, 52590, 5990, 6290, 2690, 2490, 5090, 2490, 2190, 2190, 2490, 2490, 5490, 2490, 2490, 2490, 2490, 4190, 33490, 9490, 5890, 4590, 6890, 9790, 5290, 4790, 6590, 11790, 2790, 2990, 2790, 6590, 5190, 3190, 2790, 5190, 2790, 3690, 1790, 6590, 4790, 52990, 7590, 9890, 4690, 3790, 11390, 53990, 8990, 12290, 6290, 7790, 4490, 12990, 6390, 8790, 4890, 4990, 3390, 2290, 3090, 4490, 6490, 7990, 2590, 4490, 3490, 2490, 4190, 4590, 2990, 7790, 8590, 14290, 7190, 2890, 2190, 3690, 1990, 10490, 5490, 2790, 2290, 4790, 3990, 2590, 10990, 4590, 8190, 8190, 13390, 3190, 3190, 3790, 4990, 6090, 6090, 7990, 4490, 4690, 2490, 9890, 4290, 4290, 5390, 4190, 6690, 4190, 4190, 7090, 5590, 30690, 5490, 2290, 2290, 8990, 10290, 5390, 26590, 33490, 5190, 8290, 1790, 8290, 6590, 6990, 14390, 21890, 6090, 8890, 15990, 24890, 4590, 7490, 9790, 12390, 18090, 49090, 25790, 7090, 20090, 8790, 8690, 14290, 6090, 6090, 6390, 6090, 6490, 2790, 6190, 9890, 18190, 17790, 4190, 4950, 6250, 4600, 7000, 2250, 2500, 1550, 5600, 4950, 4950, 5850, 5300, 5700, 8400, 4600, 7500, 5600, 2150, 6600, 3100, 2600, 5100, 2400, 3250, 3800, 10600, 4200, 7050, 6400, 16750, 10350, 3850, 10750, 3100, 6050, 6600, 7050, 3400, 4350, 8800, 8400, 12000, 5900, 8300, 15250, 9000, 8400, 14200, 8900, 10550, 9550, 6460, 2900, 9900, 32000, 51850, 13900, 10850, 7050, 8350, 7100, 10550, 8450, 7950, 10500, 16550, 6450, 8400, 7850, 7900, 25900, 7150, 18200, 19000, 5850, 8800, 4450, 46950, 13400, 17900, 15900, 23900, 18900, 38900, 26900, 38900, 15900, 14900, 15900, 49900, 9300, 10450, 15850, 11700, 40850, 118250, 116000, 6460, 27900, 17900, 10550, 31600, 10450, 17500, 12900, 15900, 25900, 36900, 7050, 6800, 21100, 50150, 1950, 12610.80, 44150, 160000, 15900, 30900, 23900, 23900, 22150, 26600, 19000, 36150, 3100, 5850, 1700, 24900, 1800, 4400, 16800, 3550, 6050, 5100, 9500, 20900, 7900, 21900
];

const inferType = (name: string): AlcoholType => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('whiskey') || lowerName.includes('whisky') || lowerName.includes('scotch') || lowerName.includes('bourbon') || lowerName.includes('malt')) return AlcoholType.Whiskey;
    if (lowerName.includes('gin')) return AlcoholType.Gin;
    if (lowerName.includes('vodka')) return AlcoholType.Vodka;
    if (lowerName.includes('rum')) return AlcoholType.Rum;
    if (lowerName.includes('tequila')) return AlcoholType.Tequila;
    if (lowerName.includes('brandy') || lowerName.includes('cognac') || lowerName.includes('vsop') || lowerName.includes('xo')) return AlcoholType.Brandy;
    if (lowerName.includes('wine') || lowerName.includes('sauvignon') || lowerName.includes('chardonay') || lowerName.includes('cabernet') || lowerName.includes('shiraz') || lowerName.includes('pinot') || lowerName.includes('merlot') || lowerName.includes('champagne') || lowerName.includes('prosecco') || lowerName.includes('cask') || lowerName.includes('cuvée')) return AlcoholType.Wine;
    if (lowerName.includes('liqueur')) return AlcoholType.Liqueur;
    return AlcoholType.Whiskey; // Default
};

const inferBrand = (name: string): string => {
    const knownBrands = [
        'Johnnie Walker', 'Chivas Regal', 'Jack Daniel\'s', 'The Macallan', 'Glenfiddich', 
        'Glenlivet', 'Jameson', 'Suntory', 'Jim Beam', 'Dewar\'s', 'Moët & Chandon', 
        'Veuve Clicquot', 'Dom Pérignon', 'Penfolds', 'Bacardi', 'Absolut', 'Grey Goose', 
        'Hendrick\'s', 'Patrón', 'Bombay Sapphire', 'The Balvenie', 'Ardbeg', 'Lagavulin',
        'Laphroaig', 'Talisker', 'Glenmorangie', 'Royal Salute', 'Ballantine\'s', 'Bushmills',
        'Wild Turkey', 'Maker\'s Mark', 'Woodford Reserve', 'Bulleit', 'Knob Creek', 'Dalmore',
        'Aberlour', 'Yamazaki', 'Hakushu', 'Hibiki', 'Kavalan', 'Amrut', 'Paul John', 'Belvedere',
        'Ketel One', 'Tito\'s', 'Cîroc', 'Don Julio', 'Jose Cuervo', '1800', 'Herradura', 'Casamigos',
        'Captain Morgan', 'Havana Club', 'Mount Gay', 'Ron Zacapa', 'Kraken', 'Sailor Jerry',
        'Tanqueray', 'Beefeater', 'Gordon\'s', 'Sipsmith', 'Roku', 'The Botanist', 'Monkey 47',
        'Hennessy', 'Rémy Martin', 'Martell', 'Courvoisier', 'Grand Marnier', 'Baileys', 'Cointreau',
        'Jägermeister', 'Disaronno', 'Kahlúa', 'Aperol', 'Campari', 'Jacob\'s Creek', 'Yellow Tail',
        'Cloudy Bay'
    ];
    
    const lowerName = name.toLowerCase();

    for (const brand of knownBrands) {
        if (lowerName.startsWith(brand.toLowerCase())) {
            return brand;
        }
    }
    // Handle cases like 'JW Black Label'
    if (lowerName.startsWith('jw')) return 'Johnnie Walker';
    
    const words = name.split(' ');
    // Simple guess based on the first word if it seems like a proper noun
    if (words.length > 1 && words[0].length > 2 && words[0][0] === words[0][0].toUpperCase()) {
         // check if first word is all caps but not a common abbreviation like 'YO'
        if (words[0] === words[0].toUpperCase() && words[0] !== 'YO' && words[0].length > 2) {
            return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        }
        return words[0];
    }
    
    return words[0];
};

const productNames = [
    "Chivas Regal XV Twin Pack 2 X 1L", "Chivas Regal 18 Years Old 2X1L", "Suntory Toki 2x1L", "Hendrick's Gin Twin Pack 2X1L", "Tamnavulin Speyside Malt Tempranillo Cask & Tamnavulin Olorosso cask 2X1L", "Jameson Irish Whiskey 2x1L", "Johnnie Walker Blue Label & Gold Label Reserve 2X1 L", "Johnnie Walker Blue Label & The Singleton Golden Autumn 2X1 L", "Dalwhinnie 15YO", "JW Blue Label 1ltr & Johnnie Walker 18 YO", "JW Black Label 12 YO & Double Black", "JW Black Label & Gold Label Reserve 2x1L", "JW Black Label & The Singleton Glen Radiant Spring 2X1L", "JW Double Black 2x1L", "Glenfiddich Vat1 Perpetual Collection Twin Pack 2X1L", "Jack Daniel's Single Barrel Tennessee Rye Whiskey", "Glenglassaugh 12 Year Old Single Malt Scotch Whisky", "Glenglassaugh Sandend Single Malt Scotch Whisky", "Glenglassaugh Portsoy Single Malt Scotch Whisky", "Jack Daniel's Tennessee Whiskey McLaren F1 Racing Edition 2", "Woodford Reserve Kentucky Straight Malt Whiskey", "Fettercairn 17YO TR Ex", "Fettercairn 25YO TR Ex", "Bushmills Bush Malt 15 YO Bourbon 46%", "Amrut Indian Single Malt Exclusive 48%", "Macallan DYW Mexico", "Glen Deveron 40", "Glengoyne 21 YO", "Marchesi de FrescobaldiRemole Sangiov Cab Sauv IGT", "Chivas Regal 12 YO Twin Pack 2X1L", "Dewar's 12 YO 2X1L", "Dewar's 15 YO 2X1L", "Jack Daniels Twin Pack 2X1L", "Monkey Shoulder Twin Pack 2X1L", "Suntory Whisky Toki Black 1L", "Loca Loka Blanco 40%", "Just Roberto Chianti Riserva", "Koelenberg Shiraz Wine", "Cavalier De Mediterranee Chardonnay Wine", "Cavalier De Mediterranee Rouge Wine", "Moët & Chandon Impérial Brut Gift Box", "Moët & Chandon Rosé Impérial Gift Box", "Moet & Chandon Brut Imperial", "Veuve Clicquot Yellow Label Gift Box", "Veuve Clicquot Rosé NV", "Dom Pérignon Vintage 2015 Gift Box", "Krug Grande Cuvée 172ème Édition Gift Box", "Cloudy Bay Sauvignon Blanc 2024", "Dom Perignon Rose 2009", "Moet & Chandon Rose Vintage", "Santa Margherita Prosecco", "Wente Southern Hills Estate Cabernet Sauvginon", "Born West Cabernet Sauvignon", "Tenuta Cabolani Pinot Grigio Friuli DOC Aquileia", "St Remy XO Twin Pack 40%", "Ch La Graveliere Red Wine Mazerolle Pey", "Ch Bessan La Cabane Wine", "Domaine Wiehle Wine Rosenbourg", "Ch La Courolle Les Bardes Wine", "Koelenberg Chenin Blanc Wine", "Villa Sandi Nero Asolo Extra Brut", "Penfolds Bin 407 Cabernet Sauvignon", "PENFOLDS AUTUMN RIESLING", "PENFOLDS MAX ROSE", "PENFOLDS 65F BY NIGO", "Grey Goose Vodka Twin Pack 2X1L", "Don Julio Ultima Reserva", "Belvedere B 10 40%", "Tequila Herradura Reposado", "Tequila Herradura Anejo", "Belvedere Pure Twin Pack 40%", "Cherrapunji Eastern Craft Gin", "Aviation American Gin", "Hendricks Sunspell Gin", "Samsara Contemporary Indian Vale Of Paradise Gin", "Hendrick's Gin", "Samsara Contemporary Indian white Gin", "The Macallan Rare Cask Black", "Terlato The Federalist Chardonnay", "Inniskillin Gold Vidal Ice Wine", "Flagstone Free Run Sauvignon Blanc", "Domaine Laroche Chablis Saint Martin", "Taylors Croft Pink Port", "Pommery Brut Royal", "Pommery Rose Royal", "Passion De Provence", "Duc de Lucy Rose", "Duc de Lucy White", "El Ron Prohibido Rum 15", "Mezcal Fandango", "Cazcanes Blanco", "Cazcanes Reposado", "Cazcanes Anejo", "Handpicked Regional Yarra Valley Rose", "Handpicked Pinot Grigio", "The Singleton of Glendullan 15 YO", "Johnnie Walker Black Label Ruby", "Glenmorangie 16 YO The Vindima 43%", "CDD Route of Cabernet Maule 10 months", "19 Crimes California", "19 Crimes Cali Red", "Marques Casa Concha Carmenere Tinto", "Fords London Dry Gin", "El Jimador Blanco Tequila", "El Jimador Reposado Tequila", "Crazy Cock Rare Double OAK SM Indian Whisky 46%", "Crazy Cock Dhua SM Indian Whisky 46%", "Dalmore 20 YO", "Dalmore Portfolio Series 1 TR Ex", "Tomintoul Tor Oloroso Sherry Cask Speyside TR Ex", "Tomintoul Tarn Peated Speyside TR Ex", "Tomintoul Tundra Bourbon Cask Speyside TR Ex", "Caperdonich Peated 25 YO", "Ardbeg 10 YO", "Kamet Indian Single Malt 46%", "Jaisalmer Gold Gin", "Suave Blanco Tequila 36.4%", "PENFOLDS ST HENRI SHIRAZ", "PENFOLDS BIN 138 SGM", "PENFOLDS BIN 8 CABERNET SHIRAZ", "PENFOLDS BIN 2 SHIRAZ MATARO", "PENFOLDS CELLAR RESERVE CHARDONNAY", "PENFOLDS CELLAR RESERVE PINOT NOIR", "PENFOLDS CELLAR RESERVE SHIRAZ", "PENFOLDS CELLAR RESERVE CABERNET SAUVIGNON", "Penfolds Bin 389 NIGO", "Fino Classic Blanco Tequila", "Fino Classic Anejo Tequila", "Fino Classic Rosado Tequila", "Woodburns Contemporary Indian Whisky", "Pumori Small Batch Pink Gin", "Pumori Small Batch Gin", "Arthaus Collective Finest Blended with Gift Pack", "The Glenlivet Founders Reserve 2X1L", "JW Gold Label Reserve 2X1L", "JW Black Label 12 YO 2X1L Twin Pack", "Auchentoshan Blood Oak 1L", "Tamdhu 18 YO 70CL", "Yamazaki Peated Malt Spanish Oak Kogei Collection 2024 70CL", "Hakushu Kogei Collection 2024 70CL", "Dewar's Double Double 21-Year-Old Stone Toasted Discovery Pack 2 X 75CL", "The Balvenie 12 YO Golden Cask", "Glenfiddich 22 YO Gran Cortes", "The Balvenie Portwood 21 YO", "The Macallan Harmony Collection Guardian Oak", "Indri GOT HOD House of Green Ex-Edition", "Indri GOT HOD House of Black Ex-Edition", "Indri Dru Ex Bourbon Cask Strength", "Aberlour 16 YO Double Cask", "Jameson Black Barrel", "Red Breast 12 YO", "Red Breast 15 YO", "Red Breast 18 YO", "Red Breast 21 YO Irish Whiskey", "Glenmorangie The Aureum 21 YO", "Glenmorangie 12 YO Twin Pack 2X1L", "Glen Grant Exploration Single Malt", "Knob Creek Bourbon Whiskey 9 Year Old 70cl", "Bowmore 22 Year Old Travel Exclusive 70cl", "Basil Hayden Kentucky Straight Bourbon Whiskey 1L", "Jura Single Malt Scotch Whisky 21 YO Time", "Glenfiddich 23 Year Old Grand Cru", "Ballantine's 17YO", "Ballantine's 21 Year Old", "Aberfeldy Madeira Cask 21 YO", "Mortlach 16 Year Old Single Malt Scotch Whisky 75CL", "GlenParker Speyside Single Malt Scotch Whisky", "Hakushu Distillers Reserve 43%", "Hibiki Masters Select Special Edition 43%", "Hibiki Master Select 43%", "Chita Suntory Whisky 43%", "Suntory World Whisky 43%", "Lambay Malt Irish Whiskey", "Templeton Rye Whiskey 1L", "Kavalan Bourbon Oak Single Malt", "Kavalan Solist Port Cask", "Bell's Original Scotch Whisky 1L", "Lambay Irish Whiskey Single Malt", "Ricard Anise 45%", "The Balvenie 15YO Madeira Cask", "The Balvenie 18YO PX Sherry Cask", "Teacher's Origin", "Bruichladdich Laddie 8", "Old Pulteney 16 YO", "Balblair 17 YO", "Tenjaku Whisky", "Ballantines 30 YO", "The Macallan Colour Collection 12 Years Old", "The Macallan Colour Collection 15 Years Old", "The Macallan Colour Collection 18 Years Old", "Indri Triple Cask Indian Single Malt 1L", "Paul John Mithuna Single Malt", "Longitude 77 75CL", "The Dalmore King Alexander III", "The Glenlivet 18 Year Old", "Yamazaki 12 YO", "Ardbeg 19 Years", "Dalmore The Quintet", "Dalmore The Trio", "Johnnie Walker 18 YO", "Amrut Indian Single Malt 46%", "Amrut Fusion India Single Malt 50%", "Black & White Blended Whisky 1L", "Aberlour A'Bunadh", "Bulleit Bourbon Whiskey 1L", "Bushmills Black Bush", "Bushmills Original", "The Dalmore 15 Year Old", "The Dalmore 12 Year Old", "Glen Deveron 20 Years Old", "Glenfiddich 21 Year Old", "Glenmorangie Signet", "J&B Rare Blended Scotch Whisky 1L", "Jack Daniel's Sinatra Select, 1L, 90 Proof", "Jack Daniel's Single Barrel 100 Proof", "Jameson Caskmates Stout Edition Irish Whiskey", "Laphroaig 10 Year Old", "Laphroaig The 1815 Legacy Edition", "Teeling Single Grain Irish Whiskey", "Teeling Small Batch Irish Whiskey", "The Glenlivet Archive 21 Years Old 700ml", "Tullamore Dew Irish whiskey", "Vat 69 Blended Scotch Whisky 1L", "Woodford Reserve Double Oaked Kentucky Straight Bourbon Whiskey 1L", "Tenjaku Pure Malt", "Albert Bichot Chateau d'Orsan Côtes du Rhône 75CL", "Golden Sparrow Sangiovese", "Jacob's Creek Reserve Barossa Valley Shiraz", "Laurent-Perrier Cuvee Rose Brut", "Laurent-Perrier La Cuvee Brut", "Legende Bordeaux Rouge", "Mumm Le Rosa", "Nederburg The Winemasters Cabernet Sauvignon", "Nederburg The Winemasters Pinotage", "Nederburg The Winemasters Sauvignon Blanc", "Zonin Special Cuvee Prosecco Brut", "Chateau De Lamarque Haut Medoc", "Cloudy Bay Chardonnay 2014", "Framingham Pinot noir", "Lindeman's Shiraz Cabernet", "Martini Asti", "Fundador Solera Reserve Brandy", "Los Vascos Cabernet Sauvignon", "Achaval Ferrer Malbec Mendoza", "Nicolas Feuillatte Reserve", "Reserve Speciale Mdoc Lafite", "Two Oceans Shiraz", "Golden Sparrow Chardonnay", "Achaval Ferrer Quimera", "Legende Bordeaux Blanc Lafite", "Wolf Blass Yellow Label Shiraz", "Chateau Magnol Haut Medoc Cru", "Two Oceans Pinotage", "Les Charmes de Magnol Medoc", "Renieri Rosso di MontalcinoDOC", "Freixenet Cordon Negro Brut", "Mateus Sparkling Rosé", "Carpene Malvolti Prosecco", "Palmesdor Brut Vintage", "Loudenne Les Jardins Bordeaux Rouge Aoc", "Jacob's Creek Sparkling Rose", "Whispering Angel Rose", "La Roccagrande Vino Bianco Wine", "Genesis Syrah Reserva", "Skinny Witch Rose Prosecco DOC 75CL", "Skinny Witch Brut Prosecco DOCG 75CL", "Jacob's Creek Reserve Chardonnay 75CL", "St Remy XO 1L", "Jacob's Creek Chardonnay Pinot Noir", "Bush Ballad Shiraz", "Zenato Ripassa Valpolicella Ripasso DOC Superiore", "Bottega Merlot IGT", "Chapoutier Marius Rouge", "Lindeman's Cawarra Shiraz Cabernet", "Chateau Castel Viaud Wine La Grave", "Moët & Chandon Ice Impérial", "Armand De Brignac Brut Gold", "Bacardi Black (Carta Negra)", "Bacardi Cuatro", "Bacardi Gold (Carta ORO)", "Bacardi Limon Gex", "Bacardi Ocho", "Jose Cuervo Classico Silver", "Jose Cuervo Especial Gold Tequila", "Malibu Original", "Mount Gay Extra Old", "Ron Zacapa Centenario 23 Sistema Solera Rum 1L", "Santa Teresa 1796 Rum", "Absolut 100", "Bacardi Gran Reserva Diez Extra Rare Gold 10 YO", "Bacardi Carta Blanca 1L", "Stolichanaya Gold", "Amrut Two Indies Rum", "O6 Vodka Rose", "Ketel One Vodka", "Don Julio 1942", "Ashanti Ginger Spiced Rum", "Sailor Jerry Spiced Rum", "Ron Zacapa Centenario XO Rum", "Belvedere Pure 1.75L", "Bacardi Reserva Ocho Rye Cask Finish Rum 1L", "Tequila Reserva 1800 Anejo", "Beluga Transatlantic Racing Vodka 70CL + sunglasses Gift Set", "Idaaya Himalayan Sipping Rum 75CL", "Patron El Alto", "Absolut Vodka Wild Berri", "Avion Tequila Reserva 44", "Havana Club 3 YO Rum", "Havana Club 7 YO Rum", "Volcan De Mi Tierra X.A", "Amarula Cream Liqueur", "Aperol", "Beefeater", "Bluecoat American Dry Gin", "The Dalmore Cigar Malt", "Gordon's London Dry Gin 1L", "Gordon's Premium Pink Distilled Gin 1L", "Jagermeister 1L", "Kahlúa Original Coffee Liqueur", "Martini Bianco", "Martini Extra Dry", "Martini Rosso", "Pimm's No. 1 Cup Liqueur 1L", "Sheridan's Coffee Layered Liqueur 1L", "Benedictine D.O.M. Liqueur", "Hendrick's Amazonia Gin", "Bottega Limoncino Liquore", "Jagermeister Cold Brew Coffee 100CL", "Somrus Chai Cream Liquer", "Antica Sambuca Classic", "Drambuie Scotch Liqueur 1L", "Method And Madness Irish Gin", "Bombay Sapphire Premier Cru Tuscan Juniper 1L", "X Rated Liqueur 1L", "Perfect Aperol Spritz Kit - 1L Aperol 11% & 75CL Cinzano Prosecco 11%", "Monkey 47 Schwarzwald Dry Gin 50CL", "Gin Mare Capri 1L", "Gin Mare Mediterranean Gin 1L", "Roku Sakura Bloom Edition", "Hennessy X.O", "Martell Cordon Bleu Cognac", "Martell vs", "Martell VSOP", "Martell XO", "St. Remy VSOP 1L", "Camus VSOP Borderies Single Estate", "Camus VSOP Intensely Aromatic", "James Hennessy", "Avion Tequila Cristalino", "Cloudy Bay Pinot Noir 2015", "Grande Absente 69", "Ardbeg AN OA", "Baileys Salted Caramel Liqueur 1L", "Baileys Original Irish Cream Liqueur 1L", "Baileys Strawberries & Cream Liqueur 70CL", "Ballantine's Finest", "Beluga Celebration", "Belvedere Pure Vodka", "Bombay Sapphire", "Bulldog Gin", "Campari", "Canadian Club 5 Year Old", "Caorunn Scottish Gin", "Captain Morgan Jamaica Rum 1L", "Chivas Regal 18 Year Old", "Chivas XV", "Chivas Regal Ultis", "Ciroc Snap Frost Vodka 1L", "Cointreau L'Unique", "Corralejo Anejo Tequila 75CL", "Corralejo Blanco Tequila", "Corralejo Reposado Tequila 75CL", "Crafter's London Dry Gin", "Dewar's 15 YO 1L", "Dewar's White Label", "Dimple Aged 15 Years Blended Scotch Whisky 1L", "Don Julio Anejo Tequila 75CL", "Don Julio Blanco Tequila 75CL", "Don Julio Reposado Tequila 75CL", "Jack Daniel's Gentleman Jack Tennessee Whiskey, 1L, 80 Proof", "Glen Deveron 16 Year Old", "Glen Turner 12 Year Old Single Malt Whisky", "Glengoyne Highland 10 YO", "Glengoyne 12 Year Old", "Glen Grant 10 Year Old", "Glen Grant 12 Year Old", "Grey Goose Le Citron", "Grey Goose Vodka", "Hennessy V.S", "Hennessy V.S.O.P Privilege 1L", "Jack Daniel's Tennessee Whiskey Old No. 7, 1L, 80 Proof", "Jack Daniel's Bottled-In-Bond, 1L, 100 Proof", "Jack Daniel's Tennessee Fire, 1L, 70 Proof", "Jack Daniel's Tennessee Honey, 1L, 70 Proof", "Jameson Irish Whiskey", "Jim Beam Black Label", "Jim Beam White Label", "Johnnie Walker Black Label Aged 12 YO Blended Scotch Whisky", "John Walker & Sons King George V Blended Scotch Whisky 75CL", "Johnnie Walker Blue Label Blended Scotch Whisky 1L", "Johnnie Walker Double Black Blended Scotch Whisky 1L", "Johnnie Walker Gold Label Reserve Blended Scotch Whisky 1L", "Johnnie Walker Island Green Blended Scotch Whisky 1L Travel Exclusive", "Johnnie Walker Red Label Blended Scotch Whisky 1L", "Kavalan Classic Single Malt", "Laphroaig PX Cask", "Maker's Mark", "Mateus Rose", "Mount Gay Black Barrel", "Mount Gay Eclipse", "Nederburg The Winemasters Shiraz", "Old Pulteney 10 Years Old", "Patron Silver", "Paul John Bold", "Champagne Piper-Heidsieck, Brut, wooden box", "Remy Martin VSOP 1L", "Remy Martin XO Excellence 40%", "Royal Brackla 12 Year Old", "Royal Salute 21 Year Old 1L", "Scottish Leader", "Shieldaig Speyside Single Malt", "Sipsmith London Dry Gin", "Skyy Vodka", "Smokehead - Islay Single Malt Scotch Whisky", "Speyburn 10 Year Old", "Talisker 10 Year Old", "Talisker Dark Storm 1L", "Talisker Skye 1L", "Tanqueray Rangpur Gin 1L", "Tanqueray Flor de Sevilla Gin 1L", "Tanqueray No. Ten Gin 1L", "Teacher's Highland Cream", "The Botanist Islay Dry Gin", "The Famous Grouse", "The Glenlivet 12 Year Old", "The Glenlivet 15 Year Old", "The Glenlivet 25 Year Old", "The Glenlivet Founder's Reserve", "The Glenlivet Distiller's Reserve", "Tito's Handmade Vodka", "Grant's Family Reserve", "Woodford Reserve Kentucky Straight Bourbon Whiskey, 1L, 90.4 Proof", "Zonin Montepulciano d'Abruzzo", "Genesis Chardonnay Wine", "Genesis Merlot Red Wine", "Absolut Apeach", "Absolut Citron", "Absolut Elyx", "Absolut Grapefruit", "Absolut Lime", "Absolut Mandrin", "Absolut Raspberry", "Jameson Triple Triple", "Royal Salute 25 Year Old", "Patron Anejo (LE)", "The Singleton of Glendullan 12 Year Old Single Malt Scotch Whisky 1L", "Copper Dog Speyside Blended Malt Scotch Whisky 1L", "Glendronach Forgue Aged 10 Years Old 1L", "Tomintoul Speyside Glenlivet Single Malt Scotch Whisky 16 Years Old", "Tomintoul Speyside Glenlivet Peated Single Malt Scotch Whisky", "Smokey Joe Islay Malt Scotch Whisky", "Roberto Cavalli Night Edition Vodka", "Glen Grant 15 Year Old", "Nedurburg Manor House Cabernet Sauvignon", "B&G Cotes de Provence TR exclusive", "Nederburg Manor House Shiraz", "Roberto Cavalli Vodka Orange", "Wolf Blass GL Shiraz Cabernet", "Donnafugata Sedara Sicilia", "Wolf BlassYL CabernetSauvignon", "Wolf Blass Grey Label Shiraz", "B&G Bordeaux Rouge TR exclusive", "B&G Saint Emilion TR exclusive", "Smirnoff No. 21 Vodka 1L", "Roberto Cavalli Vodka Rosemary 1L", "Suntory Haku Vodka", "Glen Keith 28 YO 70CL", "Glenmorangie The Accord 12 Year Old", "Glenmorangie The Elementa 14 Year Old", "EG Rhubarb and Ginger Gin", "Grants Triplewood 12 YO", "Rampur Asava", "Glenfiddich Grande Couronne 26 YO", "Glenfiddich 15 Vat3 Perpetual Collection", "Glenfiddich 18 Vat4 Perpetual Collection", "Glenfiddich Vat1 Perpetual Collection", "Glenfiddich Vat2 Perpetual Collection", "Chivas Regal 12 Year Old", "Jura 19 YO The Paps", "Jura Islanders Expression No. 1", "Jura The Road", "Tamnavulin Olorosso Cask 1L", "Tamnavulin Speyside Malt Tempranillo Cask", "Jack Daniel's Tennessee Apple Whiskey", "Absolut Vodka", "Baileys Espresso Creme 1L", "Jaisalmer Indian Craft Gin", "Balblair 12 YO", "The Glenlivet TCM White Oak Reserve", "King Robert II Blended Scotch Whisky 8YO 1L", "Bottega Bacur Gin 1L", "Ballantine's Bourbon Barrel 7YO", "Absolut Vanilia", "Roku Gin", "Naked Malt 1L", "Whyte & Mackay Special 1L", "Kavalan Concertmaster", "Highland Park Loyalty Of The Wolf 14 Year Old", "Glen Moray 18 Year Old", "6 O'clock Gin", "Bottega Gold Prosecco", "Genesis Cabernet Sauvignon Wine", "Bombay Sapphire Sunset", "London Hill Dry Gin", "Balblair 15 Year Old", "El Ron Prohibido Rum", "Famous Grouse Sherry Cask 40%", "Russian Standard Vodka Original", "EG Seaside Gin", "Taylors 10YO Tawny Port", "London Hill Pink Gin", "Talisker Surge", "Paul John Brilliance", "Paul John Oloroso", "Paul John Pedro Ximenez", "The Glenlivet TCM Rare Cask", "Handpicked McLaren Vale Shiraz", "Handpicked Yarra Chardonnay", "Handpicked Marg River Cabernet", "Pravda Vodka", "Benriach Quarter Cask 1L", "Benriach Quarter Cask Peated 1L", "Glen Grant Cask Haven", "Wild Turkey 101", "Suntory Toki 1L", "Jim Beam Honey", "Glen Moray 15 YO", "Malfy Gin Originale 1L", "Malfy Gin Rosa 1L", "Dewar's 12 YO", "CHÂTEAU LAUDUC Chantelevent Red Wine", "Bertha's Revenge Gin", "CHÂTEAU LAUDUC Chantelevent White Wine", "Grand Marnier Cordon Rouge Liqueur 1L", "Auchentoshan Dark Oak", "Gautier VS 1L", "Longmorn 23 YO", "Wild Turkey Longbranch Bourbon Whiskey 1L", "SKYY INFUSION CITRUS 1L", "SKYY INFUSION RASPBERRY 1L", "Patron Reposado Tequila 1L", "Don Julio 70th Anniversary 75CL", "Auchentoshan American Oak 1L", "Caperdonich 21YO 70CL", "Royal Salute 25 YO Delhi Edition 70CL", "Monkey Shoulder Blend 1L", "Tequila 52 Cristalino 75CL", "Old Monk The Legend Rum 1L", "Casamigos Anejo Tequila 1L", "Casamigos Blanco Tequila 1L", "Casamigos Reposado Tequila 1L", "Tamdhu 15 YO 70CL", "Misaka Aged 12 YO Mizunara Cask", "The Singleton Radiant Spring Garden", "The Singleton Golden Autumn Orchard", "The Singleton Exotic Spice Grove", "The Singleton Deep Forest Riches", "Camikara Cask Aged Rum 8 YO", "Aberlour 13 YO Double Cask", "Aberlour Suthainn Sherry Cask", "Chivas Regal 18 YO Pauillac Cask", "Royal Salute 2002 Vintage", "Royal Salute 32 YO", "Royal Salute Polo 6 Miami Edition", "The Glenlivet 12 YO Le 200Th Anniversary", "The Glenlivet Caskmakers", "The Glenlivet Groundbreakers", "Volcan De Mi Tierra Cristalino", "Ardbeg Uigeadail", "Belvedere Organic Infusions Lemon & Basil", "Belvedere Organic Infusions Blackberry & Lemongrass", "Volcan De Mi Tierra Blanco", "Belvedere Organic Infusions Pear & Ginger", "Mont Blanc Vodka", "Jim Beam Apple Bourbon Whiskey 1L", "Bowmore 14 Year Old Travel Exclusive 70cl", "Bowmore 16 Year Old Travel Exclusive 70cl", "Bowmore 19 Year Old Travel Exclusive 70cl", "Johnie Walker XR 21 YO", "Kraken Spiced Rum", "Black Label Aged 12 Year Old Blended Scotch Whisky", "Double Black Blended Scotch Whisky 1l", "Gold Label Reserve Blended Scotch Whisky 1l", "12 Year Old Blended Scotch Whisky", "Double Agent 16 Year Old Travel Exclusive 1l", "Red Label Blended Scotch Whisky", "Finest", "Highland Cream 1l", "Tennessee Whiskey Old No 7 Twin Pack 2x1l", "15 Year Old 1l", "Black Ruby 1l", "Triple Cask Matured Distiller'S Reserve Single Malt Scotch Whisky Scotland Trx 1l", "Extra 13 Year Old Rum Cask Blended Scotch Whisky Scotland 1l", "Vat 1 1l", "16 Year Old 1l", "Black Label Triple Cask Edition Blended Scotch Whisky 1l", "12 Year Old Single Malt Scotch Whisky Scotland 1l", "Founder'S Reserve 1l", "White 1l", "Island Green Blended Scotch Whisky 1l", "Tennessee Whiskey Old No. 7", "Original Irish Whiskey Ireland 1l", "12 Years Old Madeira Cask Trx 70cl", "White Label 1l", "7 Year Old American Barrel Blended Scotch Whisky Scotland 1l", "12 Year Old Special 1l", "18 Year Old Blended Scotch Whisky Scotland", "Toki 1l", "The Accord 12 Year Old 1l", "Triple Cask Single Malt Indian Whisky 1l", "21 Year Old The Signature Blend", "The Vindima 16yo Travel Exclusive 1l", "Triple Triple Irish Whiskey 1l", "Asava Single Malt 75cl", "Tennessee Apple 1l", "12yo Original 1l", "Vat 2 1l", "Xv 15 Year Old Blended Scotch Whisky Scotland Trx", "Bottled In Bond 1l", "Gentleman Jack 1l", "Classic Single Malt 1l", "Peated Select Cask 1l", "Ex-bourbon Oak Single Malt Whisky 1l", "Original Blended Malt Whisky 50cl", "Blood Oak 1l", "Harmony Green Meadow 70cl", "Port Charlotte 10 Year Old Heavily Peated 1l", "American Single Malt Travel Limited Edition 1l", "18 Year Old", "13 Year Old", "2008 Ambar Travel Exclusive Limited Edition 70cl", "Campbell Town 1832 1l", "12 Year Old Twin Pack 2x1l", "Premium Whiskey 75cl", "Coffey Grain 70cl", "25 Years Old The Treasured Blend Blended Scotch Whisky 70cl", "Rare Cask Black 70cl", "American Single Malt 70cl", "Islay Single Malt 10 Years Old 70cl", "Highlands Journey 70cl", "Oloroso Select Cask 70cl", "Sakura Blended Malt Whisky 50cl", "15 Year Old Px Cask 70cl", "10 Year Old First Fill 1l", "Classic Select Cask 1l", "18 Year Old 70cl", "Travel Exclusive Whisky 19 Years Old 70cl", "Club House Solo Pack 1l", "Pedro Ximénez Select Cask 70cl", "Days Blended Whisky 70cl", "Auchroisk 2012 The Oaky 70cl", "21 Years Old Aureum Travel Exclusive 70cl", "Intense Blended Malt Whisky 50cl", "18 Year Old Sherry Cask Travel Exclusive 70cl", "18 Year Old Inchmurrin 1l", "Double Oaked Kentucky Straight Bourbon Whiskey 1l", "Travel Exclusive Whisky 16 Years Old 70cl", "Ocean Fused Blended Whisky 50cl", "Blue Label King George V Whisky 70cl", "21 Year Old 70cl", "Aikan 2017 70cl", "La Mine D'Or Galaad 2018 70cl", "Benrinnes 11 Year Old 2010 5.0 70cl", "Ben Nevi 6 Year Old 2014 5.0 70cl", "Compass Box 11 Pentalogy Wisdom 70cl", "Compass Box 11 Pentalogy Fortitude 70cl", "Benrinnes 2011 Over 12 70cl", "Linkwood 2012 Artist 6.0 70cl", "Aikan 2017 Petit Lot Antipodes Chêne Neuf Français Et Us 70cl", "Edradour 2011 70cl", "Glenburgie 1995 6581 16th Anniversary 70cl", "Twilight Diamond 10 70cl", "Coffey Malt 70cl", "Single Malt Miyagikyo 70cl", "Pure Malt Taketsuru 70cl", "Causeway 23 Years Old Madeira Cask 70cl", "18 Year Old Anniversary Limited Edition 70cl", "Hakushu 18 Years Old Peated Malt Limited Edition 70cl", "12 Year Old Twin Pack 2x1l", "Glen Elgin 14 Year Old 2008 Artist 6.0 70cl", "American Single Malt Stout Cask 70cl", "2008 Ambar Travel Exclusive Limited Edition 70cl", "Double Double 30 Year Old Travel Exclusive 50cl", "16 Year Old Sea Travel Exclusive 70cl", "10 Year Old Single Malt Scotch Whisky Special Release 2023 70cl", "Ben Nevis 8 Year Old 2013 70cl", "Ballechin 2010 70cl", "Glentauchers 13 Year Old 2009 Artist 6.0 70cl", "Compass Box 11 Pentalogy Generosity 70cl", "Hebridean Journey 70cl", "Whiskey The Original 1l", "21 Year Old Madeira Casks 70cl", "King George V Blended Scotch Whisky 75cl", "Blended Scotch Whisky", "16 Year Old Travel Exclusive 70cl", "Travel Exclusive Whisky 22 Years Old 70cl", "Yamazaki 18 Years Old Mizunara Limited Edition 70cl", "Ben Nevis 2013 Lmdw Sg 15th Anniversary 70cl", "Ben Nevis 2010 11 70cl", "Alpenglow 2015 70cl", "Eddu 2011 70cl", "Double Double 26 Year Old Travel Exclusive 50cl", "19 Year Old Travel Exclusive 70cl", "18 Year Old Inchmurrin 1l", "30 Year Old Very Rare Blended Whisky 70cl", "Tennessee Honey 1l", "Double Oaked Kentucky Straight Bourbon Whiskey 1l", "Blended Scotch Whisky 1l", "Gran Reserva 70cl", "Kiwami 70cl", "15 Year Old 70cl", "Takumi Travel Exclusive 50cl", "Kuyuri 70cl", "12 Years Old Madeira Cask Trx 70cl", "16 Years Old Madeira Cask Trx 70cl", "American Single Malt Cask Strength 70cl", "Mannochmore 2012 The Fruity 70cl", "Armorik 2014 70cl"
];

// Combine initial data with new products
const initialAlcohols = [
    // This is where previous data would go if there was any.
];

const existingNames = new Set(initialAlcohols.map(a => a.name));
const newAlcohols = productNames
    .filter(name => !existingNames.has(name))
    .map((name, index) => {
        const type = inferType(name);
        let tastingNotes: string[] = [];
        switch(type) {
            case AlcoholType.Whiskey:
                tastingNotes = ['Oaky', 'Smoky', 'Vanilla'];
                break;
            case AlcoholType.Gin:
                tastingNotes = ['Herbal', 'Citrus', 'Juniper'];
                break;
            case AlcoholType.Vodka:
                tastingNotes = ['Smooth', 'Clean', 'Crisp'];
                break;
            case AlcoholType.Rum:
                tastingNotes = ['Sweet', 'Spicy', 'Vanilla'];
                break;
            case AlcoholType.Tequila:
                tastingNotes = ['Agave', 'Earthy', 'Citrus'];
                break;
            case AlcoholType.Wine:
                tastingNotes = ['Fruity', 'Oaky', 'Tannic'];
                break;
            default:
                tastingNotes = ['Rich', 'Complex'];
        }

        return {
            id: initialAlcohols.length + index + 1,
            name,
            brand: inferBrand(name),
            type: inferType(name),
            price: prices[index] || 0,
            category: AlcoholCategory.Standard,
            imageUrl: generateImageUrl(name, type),
            description: `An exquisite ${name}, perfect for connoisseurs and newcomers alike. Enjoy its distinct character.`,
            rating: 4.5,
            origin: 'World',
            abv: 40,
            tastingNotes,
        }
});


export const ALCOHOL_DATA: Alcohol[] = [...initialAlcohols, ...newAlcohols];


export const COLLECTIONS_DATA: Collection[] = [
    {
        id: '1',
        slug: 'smoky-whisky-journey',
        title: 'A Smoky Whisky Journey',
        description: 'Explore the rich and peaty world of smoky whiskies, from the shores of Islay to the highlands of Scotland.',
        alcoholIds: [1, 5, 8, 20, 25, 17, 34, 45, 52, 68],
        imageUrl: 'https://images.unsplash.com/photo-1616885343588-4545239a48f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    },
    {
        id: '2',
        slug: 'gin-botanical-garden',
        title: 'Gin\'s Botanical Garden',
        description: 'A curated selection of the most aromatic and flavorful gins, showcasing a diverse range of botanicals from around the globe.',
        alcoholIds: [3, 11, 23, 30, 48, 62],
        imageUrl: 'https://images.unsplash.com/photo-1624649439218-a669785025b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    },
    {
        id: '3',
        slug: 'premium-vodka-experience',
        title: 'The Premium Vodka Experience',
        description: 'Discover the smoothest and purest vodkas, perfect for sipping neat or as the base for an elegant cocktail.',
        alcoholIds: [2, 14, 28, 41, 55],
        imageUrl: 'https://images.unsplash.com/photo-1552538963-327c1352d12e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    },
     {
        id: '4',
        slug: 'japanese-harmony',
        title: 'Japanese Harmony',
        description: 'A collection celebrating the meticulous craftsmanship and delicate balance of Japanese Whisky and Gin.',
        alcoholIds: [12, 19, 53, 61],
        imageUrl: 'https://images.unsplash.com/photo-1620359220093-da4a1c1d8329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    }
];

export const GUIDES_DATA: Guide[] = [
    {
        id: '1',
        slug: 'whiskey-for-beginners',
        title: 'A Beginner\'s Guide to Whiskey',
        description: 'Learn the basics of whiskey, from its different types like Scotch, Bourbon, and Rye to understanding tasting notes and how to drink it.',
        imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        content: `
### Understanding Whiskey Categories

Whiskey (or whisky, in Scotland, Canada, and Japan) is a broad category of distilled alcoholic beverages made from fermented grain mash. Different grains and aging processes give rise to various styles.

- **Scotch Whisky:** Must be made in Scotland from malted barley (for single malts) or other grains. It's aged in oak casks for at least three years. Often has a smoky flavor from peat used in the malting process.
- **Bourbon Whiskey:** An American whiskey, it must be made from at least 51% corn and aged in new, charred oak barrels. Typically sweeter than other whiskeys.
- **Rye Whiskey:** Another American style, must be made from at least 51% rye. Generally spicier and more full-bodied than bourbon.
- **Irish Whiskey:** Must be distilled and aged in Ireland. Known for its smooth finish, as it's often triple-distilled.
- **Japanese Whisky:** Inspired by Scotch, but with a unique focus on balance and harmony of flavors. Can be single malt, blended, and more.

### How to Taste Whiskey

1.  **Observe:** Pour a small amount into a glass (a tulip-shaped Glencairn glass is ideal). Note the color, which can hint at its age and cask type.
2.  **Smell:** Gently swirl the glass and bring it to your nose. What do you smell? Vanilla? Caramel? Smoke? Fruit?
3.  **Taste:** Take a small sip and let it coat your mouth. Identify the flavors. Is it sweet, spicy, smoky, or fruity?
4.  **Finish:** Swallow and notice the lingering taste, known as the "finish." Is it long and warming, or short and crisp?

Adding a few drops of water can often "open up" the whiskey, releasing more complex aromas and flavors. Enjoy the journey!
`
    },
    {
        id: '2',
        slug: 'art-of-the-cocktail',
        title: 'The Art of the Home Cocktail',
        description: 'Master the essential tools, techniques, and classic recipes you need to start making delicious, bar-quality cocktails at home.',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2457&q=80',
        content: `
### Essential Bar Tools

You don't need a professional setup to make great drinks. Start with these basics:

- **Shaker:** A Boston shaker (two tins) is preferred by pros, but a Cobbler shaker (with a built-in strainer) is great for beginners.
- **Jigger:** For accurate measurements. Look for one with markings for 1 oz and 0.5 oz.
- **Strainer:** A Hawthorne strainer is essential for shaken drinks. A fine mesh strainer is also useful for a smoother texture.
- **Bar Spoon:** The long, twisted handle is for stirring cocktails like the Old Fashioned or Negroni.
- **Muddler:** For pressing ingredients like mint and lime to release their flavors.

### Three Classic Recipes to Master

1.  **Old Fashioned (Whiskey):**
    - 2 oz Bourbon or Rye Whiskey
    - 1 sugar cube (or 1 tsp simple syrup)
    - 2-3 dashes Angostura bitters
    - Orange peel for garnish
    *Muddle sugar and bitters in a glass. Add a large ice cube, pour in whiskey, and stir. Garnish with an orange peel.*

2.  **Gin & Tonic (Gin):**
    - 2 oz Gin
    - 4-5 oz high-quality tonic water
    - Lime wedge for garnish
    *Fill a highball glass with ice. Pour in gin, top with tonic water, and stir gently. Squeeze in the lime wedge and drop it in.*

3.  **Margarita (Tequila):**
    - 2 oz Blanco Tequila
    - 1 oz fresh lime juice
    - 0.75 oz Cointreau or triple sec
    - Salt for rim (optional)
    *If salting, rub a lime wedge on the rim of a glass and dip it in salt. Shake all ingredients with ice and strain into the glass over fresh ice.*
`
    }
];

export const USERS_DATA: User[] = [
  { email: 'user@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'adminpassword' },
];

export const REVIEWS_DATA: Review[] = [
  { id: 1, alcoholId: 1, userEmail: 'user@example.com', rating: 5, comment: 'Absolutely phenomenal. The smoky finish is incredible.', tags: ['Smoky', 'Rich'], date: '2023-10-26T10:00:00Z' },
  { id: 2, alcoholId: 3, userEmail: 'admin@example.com', rating: 4, comment: 'A very refreshing and botanical gin. Great for G&Ts.', tags: ['Herbal', 'Citrus'], date: '2023-10-25T14:30:00Z' },
  { id: 3, alcoholId: 1, userEmail: 'admin@example.com', rating: 4, comment: 'A classic for a reason. Consistently good.', tags: ['Smoky', 'Smooth'], date: '2023-10-24T18:00:00Z' },
];

export const NEWS_DATA: NewsArticle[] = [
    {
        id: 1,
        title: "The Rise of 'American Single Malt Whiskey' and What It Means for Your Bar Cart",
        url: "https://www.foodandwine.com/american-single-malt-whiskey-explained-7560224",
        source: "Food & Wine",
        date: "2023-07-14T10:00:00Z",
        snippet: "A new category of whiskey has been officially recognized, and it's poised to be the next big thing in the spirits world. Here's what you need to know about American single malt."
    },
    {
        id: 2,
        title: "Why Is Everyone Suddenly Drinking Gin?",
        url: "https://www.nytimes.com/2023/05/26/dining/drinks/gin-cocktails.html",
        source: "The New York Times",
        date: "2023-05-26T14:30:00Z",
        snippet: "The botanical spirit has shed its fusty reputation, thanks to a craft-cocktail boom and a new wave of producers who are redefining the category."
    },
    {
        id: 3,
        title: "How Tequila and Mezcal Are Conquering the World",
        url: "https://robbreport.com/food-drink/spirits/how-tequila-and-mezcal-are-conquering-the-world-2841916/",
        source: "Robb Report",
        date: "2023-10-23T09:00:00Z",
        snippet: "Once relegated to shots and margaritas, agave spirits are now being sipped and savored by connoisseurs everywhere. What’s behind the boom?"
    },
    {
        id: 4,
        title: "Mindful drinking: Is the no and low-alcohol trend here to stay?",
        url: "https://www.bbcgoodfood.com/howto/guide/mindful-drinking-no-and-low-alcohol-trend",
        source: "BBC Good Food",
        date: "2023-09-05T11:45:00Z",
        snippet: "We explore the rise of the 'sober curious' movement and the innovative, sophisticated non-alcoholic spirits taking the market by storm."
    },
     {
        id: 5,
        title: "How Japanese Whisky Took Over the World",
        url: "https://www.gq.com/story/japanese-whisky-guide",
        source: "GQ Magazine",
        date: "2023-08-11T18:20:00Z",
        snippet: "Prized for its meticulous craftsmanship and harmonious flavor profiles, Japanese whisky has become some of the most sought-after—and expensive—spirit on the planet."
    },
    {
        id: 6,
        title: "The Rise of Craft Distilling and Its Impact on the Spirits Industry",
        url: "https://www.forbes.com/sites/adambaker/2023/01/18/the-rise-of-craft-distilling-and-its-impact-on-the-spirits-industry/",
        source: "Forbes",
        date: "2023-01-18T16:00:00Z",
        snippet: "Small, independent distilleries are challenging the giants of the industry with innovative techniques, local ingredients, and a focus on quality over quantity."
    },
     {
        id: 7,
        title: "Why Collectors Are Obsessed With Rare Bourbon",
        url: "https://vinepair.com/articles/collectors-obsessed-rare-bourbon/",
        source: "VinePair",
        date: "2023-06-22T10:30:00Z",
        snippet: "Limited releases, cult followings, and the thrill of the hunt have turned rare bourbon into a full-blown phenomenon, with bottles fetching thousands at auction."
    }
];

export const COCKTAIL_DATA: CocktailRecipe[] = [
    // Whiskey Cocktails
    {
        name: 'Classic Old Fashioned',
        description: 'A timeless cocktail that highlights the rich notes of a good whiskey.',
        alcoholType: AlcoholType.Whiskey,
        ingredients: ['60ml Whiskey', '1 Sugar Cube', '2 Dashes Angostura Bitters', 'Splash of Water', 'Orange Peel for Garnish'],
        instructions: ['Place sugar cube in a glass and saturate with bitters, add a splash of water, and muddle until dissolved.', 'Fill the glass with a large ice cube and add the whiskey.', 'Gently stir until well-chilled.', 'Express the oil of an orange peel over the glass and drop it in.']
    },
    {
        name: 'Whiskey Sour',
        description: 'The perfect balance of sweet and sour, with a frothy, satisfying texture.',
        alcoholType: AlcoholType.Whiskey,
        ingredients: ['60ml Whiskey', '30ml Fresh Lemon Juice', '15ml Simple Syrup', '1 Egg White (optional)', 'Cherry & Orange Slice for Garnish'],
        instructions: ['Combine whiskey, lemon juice, simple syrup, and egg white in a shaker without ice.', 'Shake vigorously for about 15 seconds (this is called a "dry shake").', 'Add ice to the shaker and shake again until well-chilled.', 'Strain into a chilled coupe or rocks glass.', 'Garnish with a cherry and an orange slice.']
    },
    {
        name: 'Manhattan',
        description: 'A sophisticated and spirit-forward classic, perfect for any occasion.',
        alcoholType: AlcoholType.Whiskey,
        ingredients: ['60ml Rye or Canadian Whiskey', '30ml Sweet Vermouth', '2 Dashes Angostura Bitters', 'Brandied Cherry for Garnish'],
        instructions: ['Add all ingredients to a mixing glass with ice.', 'Stir until very cold.', 'Strain into a chilled cocktail glass.', 'Garnish with a brandied cherry.']
    },
    // Gin Cocktails
    {
        name: 'The Perfect Gin & Tonic',
        description: 'A refreshing highball that is simple yet elegant when made with quality ingredients.',
        alcoholType: AlcoholType.Gin,
        ingredients: ['60ml Gin', '120ml Premium Tonic Water', 'Lime or Grapefruit Wedge for Garnish'],
        instructions: ['Fill a highball glass with large ice cubes.', 'Pour the gin over the ice.', 'Top with tonic water.', 'Gently stir and garnish with a fresh lime or grapefruit wedge.']
    },
    {
        name: 'Negroni',
        description: 'A perfect balance of bitter, sweet, and botanical flavors.',
        alcoholType: AlcoholType.Gin,
        ingredients: ['30ml Gin', '30ml Campari', '30ml Sweet Vermouth', 'Orange Peel for Garnish'],
        instructions: ['Add all ingredients to a mixing glass filled with ice.', 'Stir until well-chilled.', 'Strain into a rocks glass filled with a large ice cube.', 'Garnish with an orange peel.']
    },
    // Vodka Cocktails
    {
        name: 'Moscow Mule',
        description: 'A spicy, zesty, and refreshing cocktail traditionally served in a copper mug.',
        alcoholType: AlcoholType.Vodka,
        ingredients: ['60ml Vodka', '15ml Fresh Lime Juice', '120ml Ginger Beer', 'Lime Wedge for Garnish'],
        instructions: ['Squeeze lime juice into a copper mug (or a highball glass).', 'Fill the mug with ice, then pour in the vodka.', 'Top with ginger beer and gently stir.', 'Garnish with a lime wedge.']
    },
    // Rum Cocktails
    {
        name: 'Classic Daiquiri',
        description: 'A simple, elegant, and perfectly balanced cocktail that showcases the rum.',
        alcoholType: AlcoholType.Rum,
        ingredients: ['60ml Light Rum', '30ml Fresh Lime Juice', '15ml Simple Syrup'],
        instructions: ['Add all ingredients to a shaker filled with ice.', 'Shake well until chilled.', 'Strain into a chilled coupe glass.']
    },
    // Tequila Cocktails
    {
        name: 'Classic Margarita',
        description: 'The quintessential tequila cocktail, perfectly balancing tart lime with the sweetness of agave.',
        alcoholType: AlcoholType.Tequila,
        ingredients: ['60ml Blanco Tequila', '30ml Fresh Lime Juice', '20ml Cointreau or Triple Sec', '5ml Agave Nectar (optional)', 'Salt for Rim & Lime Wedge for Garnish'],
        instructions: ['Rub a lime wedge around the rim of a glass and dip it in salt.', 'Add tequila, lime juice, and Cointreau to a shaker with ice.', 'Shake until well-chilled.', 'Strain into the prepared glass over fresh ice.']
    },
    // Brandy Cocktails
    {
        name: 'Sidecar',
        description: 'A classic sour cocktail that is both rich and crisp.',
        alcoholType: AlcoholType.Brandy,
        ingredients: ['50ml Cognac or Brandy', '20ml Cointreau', '20ml Fresh Lemon Juice', 'Sugar for Rim (optional)'],
        instructions: ['Prepare a chilled coupe glass by sugaring the rim, if desired.', 'Add all ingredients to a shaker with ice.', 'Shake until very cold.', 'Strain into the prepared glass.']
    }
];