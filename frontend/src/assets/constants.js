// Types: Focus on the overall experience or purpose of the game.
const typeEnum = [
    {
        "name": "Strategy Games",
        "description": "Games requiring long-term planning and strategic decision-making.",
        "examples": ["Catan", "Terraforming Mars", "Twilight Imperium"],
        "icon": "♟️"
    },
    {
        "name": "Party Games",
        "description": "Light-hearted games meant for groups and social settings.",
        "examples": ["Codenames", "Dixit", "Telestrations"],
        "icon": "🎉"
    },
    {
        "name": "Cooperative Games",
        "description": "Players work together to achieve a shared goal.",
        "examples": ["Pandemic", "Forbidden Desert", "Arkham Horror"],
        "icon": "🤝"
    },
    {
        "name": "Family Games",
        "description": "Easy-to-learn games suitable for all ages.",
        "examples": ["Ticket to Ride", "Carcassonne", "Monopoly"],
        "icon": "👨‍👩‍👧‍👦"
    },
    {
        "name": "Children's Games",
        "description": "Games designed specifically for young children.",
        "examples": ["Candy Land", "Chutes and Ladders", "Memory"],
        "icon": "🧸"
    },
    {
        "name": "Abstract Games",
        "description": "Games with minimal theme, focusing on pure strategy or mechanics.",
        "examples": ["Chess", "Go", "Azul"],
        "icon": "🔲"
    },
    {
        "name": "Dexterity Games",
        "description": "Games requiring physical skill and precision.",
        "examples": ["Jenga", "Flick 'em Up", "Klask"],
        "icon": "🤹‍♂️"
    },
    {
        "name": "Role-Playing Games (RPGs)",
        "description": "Players assume roles and develop narratives within a set framework.",
        "examples": ["Dungeons & Dragons", "Pathfinder", "Fate"],
        "icon": "🎭"
    },
    {
        "name": "Thematic Games",
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
        "name": "Sci-fi",
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
        "name": "Historical",
        "description": "Games based on real-world historical events or eras.",
        "examples": ["7 Wonders", "Twilight Struggle", "Ticket to Ride"],
        "icon": "🏺"
    },
    {
        "name": "Pirates",
        "description": "Games involving high-seas adventure and treasure hunting.",
        "examples": ["Dead Men Tell No Tales", "Jamaica", "Merchants & Marauders"],
        "icon": "🏴‍☠️"
    },
    {
        "name": "Post-apocalyptic",
        "description": "Set in worlds after a catastrophic event, focusing on survival.",
        "examples": ["Dead of Winter", "Wasteland Express", "Fallout"],
        "icon": "☢️"
    },
    {
        "name": "Western",
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
        "name": "Spy/Secret Agent",
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
        "name": "Crime/Mystery",
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
        "name": "Space Exploration",
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
        "name": "Military/War",
        "description": "Simulates battles or conflicts, often strategic.",
        "examples": ["Risk", "Memoir '44", "Axis & Allies"],
        "icon": "⚔️"
    },
    {
        "name": "Humor/Parody",
        "description": "Games with a focus on comedy or making fun of other genres.",
        "examples": ["Munchkin", "Exploding Kittens", "Joking Hazard"],
        "icon": "🤣"
    },
    {
        "name": "Superheroes",
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

// Mechanics: Focus on specific gameplay systems or actions.
const mechanicsEnum = [
    {
        "name": "Worker Placement",
        "description": "Players assign workers to specific actions or locations to gain resources or benefits.",
        "examples": ["Agricola", "Viticulture", "Lords of Waterdeep"],
        "icon": "👷‍♂️"
    },
    {
        "name": "Dice Rolling",
        "description": "Gameplay revolves around rolling dice for outcomes or resource generation.",
        "examples": ["Catan", "King of Tokyo", "Yahtzee"],
        "icon": "🎲"
    },
    {
        "name": "Deck Building",
        "description": "Players build a personal deck of cards as part of gameplay.",
        "examples": ["Dominion", "Clank!", "Ascension"],
        "icon": "🃏"
    },
    {
        "name": "Tile Placement",
        "description": "Players place tiles to create patterns, areas, or pathways.",
        "examples": ["Carcassonne", "Azul", "Patchwork"],
        "icon": "🧩"
    },
    {
        "name": "Set Collection",
        "description": "Players gather sets of items or cards to earn points.",
        "examples": ["Ticket to Ride", "Sushi Go!", "7 Wonders"],
        "icon": "🃟"
    },
    {
        "name": "Area Control",
        "description": "Players compete to control regions on the board for advantages or points.",
        "examples": ["Risk", "Small World", "El Grande"],
        "icon": "🌍"
    },
    {
        "name": "Card Drafting",
        "description": "Players select cards from a shared pool to build strategies.",
        "examples": ["7 Wonders", "Terraforming Mars", "Blood Rage"],
        "icon": "📜"
    },
    {
        "name": "Social Deduction",
        "description": "Players use bluffing and deduction to uncover hidden roles or objectives.",
        "examples": ["Werewolf", "The Resistance", "Secret Hitler"],
        "icon": "🤔"
    },
    {
        "name": "Hand Management",
        "description": "Players strategically manage the cards in their hand.",
        "examples": ["Race for the Galaxy", "Gloomhaven", "Lost Cities"],
        "icon": "✋"
    },
    {
        "name": "Resource Management",
        "description": "Players manage resources like money, goods, or time efficiently.",
        "examples": ["Terraforming Mars", "Power Grid", "Puerto Rico"],
        "icon": "🛠️"
    },
    {
        "name": "Cooperative Play",
        "description": "Players work together against the game or a shared threat.",
        "examples": ["Pandemic", "Forbidden Island", "Spirit Island"],
        "icon": "🤝"
    },
    {
        "name": "Push Your Luck",
        "description": "Players risk losing rewards by continuing actions.",
        "examples": ["Quacks of Quedlinburg", "Can't Stop", "Incan Gold"],
        "icon": "🎰"
    },
    {
        "name": "Auction/Bidding",
        "description": "Players bid resources or points to gain advantages.",
        "examples": ["Power Grid", "Ra", "Keyflower"],
        "icon": "💸"
    },
    {
        "name": "Bluffing",
        "description": "Players deceive others to achieve objectives or gain advantages.",
        "examples": ["Coup", "Sheriff of Nottingham", "Love Letter"],
        "icon": "😏"
    },
    {
        "name": "Pattern Building",
        "description": "Players create specific patterns to score points.",
        "examples": ["Azul", "Sagrada", "Photosynthesis"],
        "icon": "🖼️"
    },
    {
        "name": "Pick-up and Deliver",
        "description": "Players transport goods or items between locations for rewards.",
        "examples": ["Merchants & Marauders", "Istanbul", "Firefly"],
        "icon": "🚚"
    },
    {
        "name": "Variable Player Powers",
        "description": "Players have unique abilities or advantages based on their role or faction.",
        "examples": ["Root", "Scythe", "Cosmic Encounter"],
        "icon": "🦸‍♂️"
    },
    {
        "name": "Action Points",
        "description": "Players have a limited number of actions to take each turn.",
        "examples": ["Scythe", "Terra Mystica", "Blood Rage"],
        "icon": "⚡"
    },
    {
        "name": "Trading",
        "description": "Players exchange resources or goods with each other.",
        "examples": ["Catan", "Bohnanza", "Chinatown"],
        "icon": "🔄"
    },
    {
        "name": "Route/Network Building",
        "description": "Players create paths or connections between locations for points.",
        "examples": ["Ticket to Ride", "Railways of the World", "Power Grid"],
        "icon": "🚂"
    },
    {
        "name": "Memory",
        "description": "Players must remember information or patterns to succeed.",
        "examples": ["Codenames", "Dixit", "Memoir '44"],
        "icon": "🧠"
    },
    {
        "name": "Role Playing",
        "description": "Players assume characters and act out roles within the game.",
        "examples": ["Dungeons & Dragons", "Fiasco", "Call of Cthulhu"],
        "icon": "🎭"
    }
]


const tagsEnum = ['Favorite', 'Owned', 'Wishlist', 'Played', 'Want to Play']


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

export {
    mechanicsEnum,
    typeEnum,
    themesEnum,
    tagsEnum
}