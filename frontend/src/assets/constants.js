// Types: Focus on the overall experience or purpose of the game.
const typeEnum = [
    {
        "name": "Strategy",
        "description": "Games requiring long-term planning and strategic decision-making.",
        "examples": ["Catan", "Terraforming Mars", "Twilight Imperium"],
        "icon": "♟️"
    },
    {
        "name": "Party",
        "description": "Light-hearted games meant for groups and social settings.",
        "examples": ["Codenames", "Dixit", "Telestrations"],
        "icon": "🎉"
    },
    {
        "name": "Cooperative",
        "description": "Players work together to achieve a shared goal.",
        "examples": ["Pandemic", "Forbidden Desert", "Arkham Horror"],
        "icon": "🤝"
    },
    {
        "name": "Family",
        "description": "Easy-to-learn games suitable for all ages.",
        "examples": ["Ticket to Ride", "Carcassonne", "Monopoly"],
        "icon": "👨‍👩‍👧‍👦"
    },
    {
        "name": "Children",
        "description": "Games designed specifically for young children.",
        "examples": ["Candy Land", "Chutes and Ladders", "Memory"],
        "icon": "🧸"
    },
    {
        "name": "Abstract",
        "description": "Games with minimal theme, focusing on pure strategy or mechanics.",
        "examples": ["Chess", "Go", "Azul"],
        "icon": "🔲"
    },
    {
        "name": "Dexterity",
        "description": "Games requiring physical skill and precision.",
        "examples": ["Jenga", "Flick 'em Up", "Klask"],
        "icon": "🤹‍♂️"
    },
    {
        "name": "Role-Playing Game",
        "description": "Players assume roles and develop narratives within a set framework.",
        "examples": ["Dungeons & Dragons", "Pathfinder", "Fate"],
        "icon": "🎭"
    },
    {
        "name": "Puzzle",
        "description": "Games focused on solving problems or challenges.",
        "examples": ["Exit: The Game", "Sagrada", "Pandemic: The Cure"],
        "icon": "🧩"
    },
    {
        "name": "Thematic",
        "description": "Games with strong narrative or story elements.",
        "examples": ["Gloomhaven", "Betrayal at House on the Hill", "Dead of Winter"],
        "icon": "📖"
    }
]

// Themes: Focus on the setting or narrative of the game.
const themesEnum = [
    {
        "name": "Fantasy",
        "description": "Games set in magical worlds with wizards, dragons, and epic quests.",
        "examples": ["Gloomhaven", "Dungeons & Dragons", "Small World"],
        "icon": "🧙‍♂️"
    },
    {
        "name": "Science Fiction",
        "description": "Games exploring futuristic technology, space travel, and alien worlds.",
        "examples": ["Terraforming Mars", "Star Realms", "Eclipse"],
        "icon": "🚀"
    },
    {
        "name": "Horror",
        "description": "Spooky or supernatural settings with an emphasis on fear and survival.",
        "examples": ["Betrayal at House on the Hill", "Arkham Horror", "Zombicide"],
        "icon": "👻"
    },
    {
        "name": "Pirates",
        "description": "Games involving high-seas adventure and treasure hunting.",
        "examples": ["Dead Men Tell No Tales", "Jamaica", "Merchants & Marauders"],
        "icon": "🏴‍☠️"
    },
    {
        "name": "American West",
        "description": "Games set in the Old West with cowboys, shootouts, and gold rushes.",
        "examples": ["Great Western Trail", "Colt Express", "Bang!"],
        "icon": "🤠"
    },
    {
        "name": "Mythology",
        "description": "Inspired by gods, myths, and ancient legends.",
        "examples": ["Cyclades", "Santorini", "Ankh: Gods of Egypt"],
        "icon": "⚡"
    },
    {
        "name": "Nature",
        "description": "Themes based on wildlife, ecosystems, and the natural world.",
        "examples": ["Wingspan", "PARKS", "Cascadia"],
        "icon": "🌳"
    },
    {
        "name": "Zombie",
        "description": "Games featuring undead hordes and survival strategies.",
        "examples": ["Zombicide", "Dead of Winter", "Tiny Epic Zombies"],
        "icon": "🧟"
    },
    {
        "name": "Spies / Secret Agents",
        "description": "Focuses on espionage, stealth, and secret missions.",
        "examples": ["Codenames", "Specter Ops", "Decrypto"],
        "icon": "🕵️‍♂️"
    },
    {
        "name": "Steampunk",
        "description": "Set in a retro-futuristic world with steam-powered technology.",
        "examples": ["Brass", "Steamworks", "Planet Steam"],
        "icon": "⚙️"
    },
    {
        "name": "Mystery",
        "description": "Involves solving crimes or uncovering mysteries.",
        "examples": ["Sherlock Holmes: Consulting Detective", "Clue", "Chronicles of Crime"],
        "icon": "🔍"
    },
    {
        "name": "Adventure",
        "description": "Focuses on exploration, quests, and epic journeys.",
        "examples": ["Tales of the Arabian Nights", "Above and Below", "Sleeping Gods"],
        "icon": "🗺️"
    },
    {
        "name": "Space",
        "description": "Games about exploring galaxies and colonizing planets.",
        "examples": ["Xia: Legends of a Drift System", "Gaia Project", "Cosmic Encounter"],
        "icon": "🌌"
    },
    {
        "name": "Economic",
        "description": "Centers around money, trade, and building wealth.",
        "examples": ["Power Grid", "Acquire", "Monopoly"],
        "icon": "💰"
    },
    {
        "name": "War",
        "description": "Simulates battles or conflicts, often strategic.",
        "examples": ["Risk", "Memoir '44", "Axis & Allies"],
        "icon": "⚔️"
    },
    {
        "name": "Humor",
        "description": "Games with a focus on comedy or making fun of other genres.",
        "examples": ["Munchkin", "Exploding Kittens", "Joking Hazard"],
        "icon": "🤣"
    },
    {
        "name": "Comic Book",
        "description": "Games featuring heroic characters with superpowers.",
        "examples": ["Marvel Champions", "Sentinels of the Multiverse", "DC Deck-Building Game"],
        "icon": "🦸‍♂️"
    },
    {
        "name": "Sports",
        "description": "Games based on athletic competitions or sports strategies.",
        "examples": ["Blood Bowl", "StreetSoccer", "Baseball Highlights 2045"],
        "icon": "⚽"
    },
    {
        "name": "Medieval",
        "description": "Set in the Middle Ages with knights, castles, and feudalism.",
        "examples": ["Carcassonne", "Agricola", "Castles of Burgundy"],
        "icon": "🏰"
    },
    {
        "name": "Political",
        "description": "Focuses on governance, diplomacy, and power struggles.",
        "examples": ["Twilight Struggle", "Diplomacy", "Junta"],
        "icon": "🏛️"
    },
    {
        "name": "Transportation",
        "description": "Involves moving goods, passengers, or resources efficiently.",
        "examples": ["Ticket to Ride", "TransAmerica", "18XX"],
        "icon": "🚂"
    },
    {
        "name": "Animals",
        "description": "Themes centered around wildlife, pets, or creatures.",
        "examples": ["Everdell", "Wingspan", "Root"],
        "icon": "🐾"
    }
]

const mechanicsEnum = [
    { count: 40934, name: 'Dice Rolling' },
    { count: 22413, name: 'Hand Management' },
    { count: 17592, name: 'Roll / Spin and Move' },
    { count: 16672, name: 'Set Collection' },
    { count: 16583, name: 'Variable Player Powers' },       
    { count: 12272, name: 'Cooperative Game' },
    { count: 11235, name: 'Open Drafting' },
    { count: 10352, name: 'Hexagon Grid' },
    { count: 10176, name: 'Simulation' },
    { count: 8687, name: 'Tile Placement' },
    { count: 8676, name: 'Modular Board' },
    { count: 8402, name: 'Grid Movement' },
    { count: 7570, name: 'Action Points' },
    { count: 6652, name: 'Area Majority / Influence' },     
    { count: 6375, name: 'Simultaneous Action Selection' }, 
    { count: 6356, name: 'Solo / Solitaire Game' },
    { count: 6130, name: 'Memory' },
    { count: 5930, name: 'Point to Point Movement' },       
    { count: 5927, name: 'Take That' },
    { count: 5461, name: 'Area Movement' },
    { count: 5267, name: 'Player Elimination' },
    { count: 5028, name: 'Team-Based Game' },
    { count: 4990, name: 'Deck, Bag, and Pool Building' },  
    { count: 4817, name: 'Push Your Luck' },
    { count: 4522, name: 'Trading' },
    { count: 4397, name: 'Pattern Building' },
    { count: 4350, name: 'Role Playing' },
    { count: 4210, name: 'Scenario / Mission / Campaign Game' },
    { count: 4099, name: 'Auction / Bidding' },
    { count: 4048, name: 'Paper-and-Pencil' },
    { count: 3931, name: 'Storytelling' },
    { count: 3666, name: 'Worker Placement' },
    { count: 3442, name: 'Pattern Recognition' },
    { count: 3080, name: 'Campaign / Battle Card Driven' }, 
    { count: 2927, name: 'Betting and Bluffing' },
    { count: 2808, name: 'Pick-up and Deliver' },
    { count: 2610, name: 'Trick-taking' },
    { count: 2498, name: 'Voting' },
    { count: 2453, name: 'Race' },
    { count: 2389, name: 'Network and Route Building' },    
    { count: 2385, name: 'Action Queue' },
    { count: 2342, name: 'Variable Set-up' },
    { count: 2231, name: 'Secret Unit Deployment' },        
    { count: 2223, name: 'Deduction' },
    { count: 2138, name: 'Acting' },
    { count: 2106, name: 'Measurement Movement' },
    { count: 2099, name: 'Events' },
    { count: 1964, name: 'Square Grid' },
    { count: 1703, name: 'Movement Points' },
    { count: 1703, name: 'Variable Phase Order' },
    { count: 1541, name: 'Card Play Conflict Resolution' }, 
    { count: 1488, name: 'End Game Bonuses' },
    { count: 1388, name: 'Stock Holding' },
    { count: 1338, name: 'Line of Sight' },
    { count: 1312, name: 'Deck Construction' },
    { count: 1255, name: 'Real-Time' },
    { count: 1151, name: 'Track Movement' },
    { count: 1114, name: 'Action / Event' },
    { count: 1094, name: 'Rock-Paper-Scissors' },
    { count: 1084, name: 'Income' },
    { count: 1026, name: 'Auction/Bidding' },
    { count: 1024, name: 'Chit-Pull System' },
    { count: 996, name: 'Matching' },
    { count: 982, name: 'Enclosure' },
    { count: 915, name: 'Zone of Control' },
    { count: 914, name: 'Commodity Speculation' },
    { count: 812, name: 'Line Drawing' },
    { count: 741, name: 'Semi-Cooperative Game' },
    { count: 729, name: 'Contracts' },
    { count: 725, name: 'Ratio / Combat Results Table' },   
    { count: 721, name: 'Hidden Roles' },
    { count: 720, name: 'Market' },
    { count: 715, name: 'Multi-Use Cards' },
    { count: 682, name: 'Negotiation' },
    { count: 654, name: 'Connections' },
    { count: 652, name: 'Communication Limits' },
    { count: 621, name: 'Player Judge' },
    { count: 575, name: 'Closed Drafting' },
    { count: 572, name: 'Once-Per-Game Abilities' },        
    { count: 526, name: 'Lose a Turn' },
    { count: 522, name: 'Critical Hits and Failures' },     
    { count: 521, name: 'Move Through Deck' },
    { count: 504, name: 'Interrupts' },
    { count: 499, name: 'Spelling' },
    { count: 489, name: 'Victory Points as a Resource' },   
    { count: 482, name: 'Chaining' },
    { count: 481, name: 'Narrative Choice / Paragraph' },   
    { count: 480, name: 'Grid Coverage' },
    { count: 477, name: 'Die Icon Resolution' },
    { count: 461, name: 'Turn Order: Progressive' },        
    { count: 444, name: 'Command Cards' },
    { count: 421, name: 'Multiple Maps' },
    { count: 407, name: 'Re-rolling and Locking' },
    { count: 407, name: 'Stacking and Balancing' },
    { count: 404, name: 'Hidden Movement' },
    { count: 399, name: 'Action Drafting' },
    { count: 398, name: 'Map Addition' },
    { count: 397, name: 'Speed Matching' },
    { count: 395, name: 'Singing' },
    { count: 388, name: 'Traitor Game' },
]


const tagsEnum = ['Favorite', 'Own', "Prev. Owned", 'Wishlist', 'Played', 'Want to Play', 'For Trade', 'Want in Trade', 'Preordered']
const tagsDetailedEnum = [
    {
        label: "Favorite",
        icon: "❤️"
    }, {
        label: "Own",
        icon: "👑"
    }, {
        label: "Prev. Owned",
        icon: "🔙"
    }, {
        label: "Wishlist",
        icon: "🎁"
    }, {
        label: "Played",
        icon: "🎲"
    }, {
        label: "Want to Play",
        icon: "✨"
    }, {
        label: "For Trade",
        icon: "🔄"
    }, {
        label: "Want in Trade",
        icon: "🔁"
    }, {
        label: "Preordered",
        icon: "📦"
    }
]


// { 
//     label: "Favorite",
//     icon: "❤️"
// }, {
//     label: "Owned",
//     icon: "👑"
// }, {
//     label: "Wishlist",
//     icon: "🎁"
// }, {
//     label: "Played",
//     icon: "🎲"
// }, {
//     label: "Want to Play",
//     icon: "✨"
// }

const collectionsEnum = [
    {
        slug: "hot",
        name: "Hot",
        icon: "🔥",
        description: "Hottest games right now"
    }, {
        slug: "most-played",
        name: "Most Played",
        icon: "🎲",
        description: "Most played games"
    }, {
        slug: "top-rated",
        name: "Top Rated",
        icon: "⭐",
        description: "Highest rated games"
    }, {
        slug: "best-selling",
        name: "Best selling",
        icon: "💰",
        description: "Top-selling games"
    }, {
        slug: "trending",
        name: "Trending",
        icon: "📈",
        description: "Trending games"
    },
    {
        slug: "new",
        name: "New",
        icon: "🆕",
        description: "Recently released games."
    }, {
        slug: "best-for-2-players",
        name: "Best 2 Player",
        icon: "👫",
        description: "Top games for two players"
    }, {
        slug: "best-for-families",
        name: "Best for Families",
        icon: "👨‍👩‍👧‍👦",
        description: "Top games for families"
    },{
        slug: "best-for-parties",
        name: "Best for Parties",
        icon: "🎉",
        description: "Top party games"
    }, {
        slug: "best-for-beginners",
        name: "Best for Beginners",
        icon: "👶",
        description: "Top games for beginners"
    }, {
        slug: "best-for-experts",
        name: "Best for Experts",
        icon: "🧠",
        description: "Top games for experienced players"
    }
]

export {
    mechanicsEnum,
    typeEnum,
    themesEnum,
    tagsEnum,
    tagsDetailedEnum,
    collectionsEnum
}