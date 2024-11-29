const commonGames = [
    {
        name: 'Among Us',
        description: 'Among Us is a multiplayer online game developed and published by American game studio InnerSloth. The game was released in 2018 but gained a massive following in 2020 due to the COVID-19 pandemic.',
    }
]

const categoriesEnum = [
    "Abstract Strategy",
    "Action / Dexterity",
    "Adventure",
    "Age of Reason",
    "American Civil War",
    "American Indian Wars",
    "American Revolutionary War",
    "American West",
    "Ancient",
    "Animals",
    "Arabian",
    "Aviation / Flight",
    "Bluffing",
    "Book",
    "Card Game",
    "Children's Game",
    "City Building",
    "Civil War",
    "Civilization",
    "Collectible Components",
    "Comic Book / Strip",
    "Deduction",
    "Dice",
    "Economic",
    "Educational",
    "Electronic",
    "Environmental",
    "Expansion for Base-game",
    "Exploration",
    "Fan Expansion",
    "Fantasy",
    "Farming",
    "Fighting",
    "Game System",
    "Horror",
    "Humor",
    "Industry / Manufacturing",
    "Korean War",
    "Mafia",
    "Math",
    "Mature / Adult",
    "Maze",
    "Medical",
    "Medieval",
    "Memory",
    "Miniatures",
    "Modern Warfare",
    "Movies / TV / Radio theme",
    "Murder/Mystery",
    "Music",
    "Mythology",
    "Napoleonic",
    "Nautical",
    "Negotiation",
    "Novel-based",
    "Number",
    "Party Game",
    "Pike and Shot",
    "Pirates",
    "Political",
    "Post-Napoleonic",
    "Prehistoric",
    "Print & Play",
    "Puzzle",
    "Racing",
    "Real-time",
    "Religious",
    "Renaissance",
    "Science Fiction",
    "Space Exploration",
    "Spies/Secret Agents",
    "Sports",
    "Territory Building",
    "Trains",
    "Transportation",
    "Travel",
    "Trivia",
    "Video Game Theme",
    "Vietnam War",
    "Wargame",
    "Word Game",
    "World War I",
    "World War II",
    "Zombies",
]

const mechanicsEnum = [
    "Acting",
    "Action Drafting",
    "Action Points",
    "Action Queue",
    "Action Retrieval",
    "Action Timer",
    "Action/Event",
    "Advantage Token",
    "Alliances",
    "Area Majority / Influence",
    "Area Movement",
    "Area-Impulse",
    "Auction Compensation",
    "Auction: Dexterity",
    "Auction: Dutch",
    "Auction: Dutch Priority",
    "Auction: English",
    "Auction: Fixed Placement",
    "Auction: Multiple Lot",
    "Auction: Once Around",
    "Auction: Sealed Bid",
    "Auction: Turn Order Until Pass",
    "Auction/Bidding",
    "Automatic Resource Growth",
    "Betting and Bluffing",
    "Bias",
    "Bids As Wagers",
    "Bingo",
    "Bribery",
    "Campaign / Battle Card Driven",
    "Card Play Conflict Resolution",
    "Catch the Leader",
    "Chaining",
    "Chit-Pull System",
    "Closed Drafting",
    "Closed Economy Auction",
    "Command Cards",
    "Commodity Speculation",
    "Communication Limits",
    "Connections",
    "Constrained Bidding",
    "Contracts",
    "Cooperative Game",
    "Crayon Rail System",
    "Critical Hits and Failures",
    "Cube Tower",
    "Deck Construction",
    "Deck, Bag, and Pool Building",
    "Deduction",
    "Delayed Purchase",
    "Dice Rolling",
    "Die Icon Resolution",
    "Different Dice Movement",
    "Drawing",
    "Elapsed Real Time Ending",
    "Enclosure",
    "End Game Bonuses",
    "Events",
    "Finale Ending",
    "Flicking",
    "Follow",
    "Force Commitment",
    "Grid Coverage",
    "Grid Movement",
    "Hand Management",
    "Hexagon Grid",
    "Hidden Movement",
    "Hidden Roles",
    "Hidden Victory Points",
    "Highest-Lowest Scoring",
    "Hot Potato",
    "I Cut, You Choose",
    "Impulse Movement",
    "Income",
    "Increase Value of Unchosen Resources",
    "Induction",
    "Interrupts",
    "Investment",
    "Kill Steal",
    "King of the Hill",
    "Ladder Climbing",
    "Layering",
    "Legacy Game",
    "Line Drawing",
    "Line of Sight",
    "Loans",
    "Lose a Turn",
    "Mancala",
    "Map Addition",
    "Map Deformation",
    "Map Reduction",
    "Market",
    "Matching",
    "Measurement Movement",
    "Melding and Splaying",
    "Memory",
    "Minimap Resolution",
    "Modular Board",
    "Move Through Deck",
    "Movement Points",
    "Movement Template",
    "Moving Multiple Units",
    "Multi-Use Cards",
    "Multiple Maps",
    "Narrative Choice / Paragraph",
    "Negotiation",
    "Neighbor Scope",
    "Network and Route Building",
    "Once-Per-Game Abilities",
    "Open Drafting",
    "Order Counters",
    "Ordering",
    "Ownership",
    "Paper-and-Pencil",
    "Passed Action Token",
    "Pattern Building",
    "Pattern Movement",
    "Pattern Recognition",
    "Physical Removal",
    "Pick-up and Deliver",
    "Pieces as Map",
    "Player Elimination",
    "Player Judge",
    "Point to Point Movement",
    "Predictive Bid",
    "Prisoner's Dilemma",
    "Programmed Movement",
    "Push Your Luck",
    "Questions and Answers",
    "Race",
    "Random Production",
    "Ratio / Combat Results Table",
    "Re-rolling and Locking",
    "Real-Time",
    "Relative Movement",
    "Resource Queue",
    "Resource to Move",
    "Rock-Paper-Scissors",
    "Role Playing",
    "Roles with Asymmetric Information",
    "Roll / Spin and Move",
    "Rondel",
    "Scenario / Mission / Campaign Game",
    "Score-and-Reset Game",
    "Secret Unit Deployment",
    "Selection Order Bid",
    "Semi-Cooperative Game",
    "Set Collection",
    "Simulation",
    "Simultaneous Action Selection",
    "Singing",
    "Single Loser Game",
    "Slide/Push",
    "Solo / Solitaire Game",
    "Speed Matching",
    "Spelling",
    "Square Grid",
    "Stacking and Balancing",
    "Stat Check Resolution",
    "Static Capture",
    "Stock Holding",
    "Storytelling",
    "Sudden Death Ending",
    "Tags",
    "Take That",
    "Targeted Clues",
    "Team-Based Game",
    "Tech Trees / Tech Tracks",
    "Three Dimensional Movement",
    "Tile Placement",
    "Track Movement",
    "Trading",
    "Traitor Game",
    "Trick-taking",
    "Tug of War",
    "Turn Order: Auction",
    "Turn Order: Claim Action",
    "Turn Order: Pass Order",
    "Turn Order: Progressive",
    "Turn Order: Random",
    "Turn Order: Role Order",
    "Turn Order: Stat-Based",
    "Turn Order: Time Track",
    "Variable Phase Order",
    "Variable Player Powers",
    "Variable Set-up",
    "Victory Points as a Resource",
    "Voting",
    "Worker Placement",
    "Worker Placement with Dice Workers",
    "Worker Placement, Different Worker Types",
    "Zone of Control",
]


const typeEnum = [
    {
        "type": "Strategy",
        "description": "Games that focus on long-term planning and tactics to achieve goals. Players often compete with minimal reliance on luck.",
        "examples": ["Catan", "Terraforming Mars", "Risk"],
        "icon": "🧠"
    },
    {
        "type": "Deck-Building",
        "description": "Games where players start with a simple deck of cards and gradually build stronger decks through gameplay.",
        "examples": ["Dominion", "Clank!", "Star Realms"],
        "icon": "🃏"
    },
    {
        "type": "Cooperative",
        "description": "Players work together to achieve a common objective, often against the game itself.",
        "examples": ["Pandemic", "Forbidden Island", "Spirit Island"],
        "icon": "🤝"
    },
    {
        "type": "Party",
        "description": "Lighthearted games designed for larger groups, focusing on social interaction and fun.",
        "examples": ["Codenames", "Werewolf", "Just One"],
        "icon": "🎉"
    },
    {
        "type": "Role-Playing",
        "description": "Games where players assume characters with unique traits and abilities to explore fictional worlds.",
        "examples": ["Dungeons & Dragons", "Gloomhaven", "Betrayal at House on the Hill"],
        "icon": "🎭"
    },
    {
        "type": "Abstract",
        "description": "Games with simple mechanics that focus on strategy and pattern recognition, often without a strong theme.",
        "examples": ["Chess", "Go", "Azul"],
        "icon": "🔲"
    },
    {
        "type": "Trivia",
        "description": "Games that test players' knowledge in various topics, typically through questions and answers.",
        "examples": ["Trivial Pursuit", "Wits & Wagers", "Smart Ass"],
        "icon": "❓"
    },
    {
        "type": "Bluffing",
        "description": "Games where players use deception and bluffing to gain advantages over opponents.",
        "examples": ["Coup", "The Resistance", "Sheriff of Nottingham"],
        "icon": "😈"
    },
    {
        "type": "Economic",
        "description": "Games that simulate economic systems where players make investments, manage resources, and compete financially.",
        "examples": ["Monopoly", "Power Grid", "Brass: Birmingham"],
        "icon": "💰"
    },
    {
        "type": "Worker Placement",
        "description": "Games where players place tokens to claim actions or resources in order to achieve objectives.",
        "examples": ["Agricola", "Lords of Waterdeep", "Viticulture"],
        "icon": "👷"
    },
    {
        "type": "Dexterity",
        "description": "Physical skill games that require players to perform actions like stacking, flicking, or balancing pieces.",
        "examples": ["Jenga", "Flick 'em Up", "PitchCar"],
        "icon": "🤹"
    },
    {
        "type": "Legacy",
        "description": "Games with evolving stories and mechanics that change permanently over multiple play sessions.",
        "examples": ["Pandemic Legacy", "Gloomhaven", "Risk Legacy"],
        "icon": "📜"
    },
    {
        "type": "Tile-Laying",
        "description": "Games where players place tiles to build landscapes, paths, or patterns, aiming to create the best layout.",
        "examples": ["Carcassonne", "Isle of Skye", "Kingdomino"],
        "icon": "🧩"
    },
    {
        "type": "Set Collection",
        "description": "Games where players gather specific sets of items or cards to score points or unlock abilities.",
        "examples": ["Ticket to Ride", "7 Wonders", "Sushi Go!"],
        "icon": "📚"
    },
    {
        "type": "Push Your Luck",
        "description": "Games that involve taking risks for potential rewards, where players decide how far to go before stopping.",
        "examples": ["Can't Stop", "Incan Gold", "Deep Sea Adventure"],
        "icon": "🎲"
    },
    {
        "type": "Area Control",
        "description": "Games where players compete to control specific regions on a board, gaining points or resources based on dominance.",
        "examples": ["Risk", "Blood Rage", "Scythe"],
        "icon": "🌍"
    },
    {
        "type": "Hidden Role",
        "description": "Games where players have secret identities or objectives, often working to deceive or uncover others.",
        "examples": ["Secret Hitler", "Avalon", "Deception: Murder in Hong Kong"],
        "icon": "🕵️‍♂️"
    },
    {
        "type": "Deduction",
        "description": "Games where players use logic and clues to solve mysteries or identify hidden elements.",
        "examples": ["Clue", "Mysterium", "Cryptid"],
        "icon": "🕵️‍♀️"
    },
    {
        "type": "Storytelling",
        "description": "Games that focus on narrative and creativity, where players contribute to or interpret a story.",
        "examples": ["Dixit", "Once Upon a Time", "Rory's Story Cubes"],
        "icon": "📖"
    },
    {
        "type": "Pattern Recognition",
        "description": "Games that require players to identify and create patterns to score points or achieve goals.",
        "examples": ["Qwirkle", "Splendor", "Patchwork"],
        "icon": "🔍"
    },
    {
        "type": "Racing",
        "description": "Games where players compete to be the first to reach the end goal, often involving movement and speed strategies.",
        "examples": ["Formula D", "Camel Up", "Downforce"],
        "icon": "🏎️"
    },
    {
        "type": "Engine Building",
        "description": "Games where players create systems of components that generate resources or benefits over time.",
        "examples": ["Wingspan", "Race for the Galaxy", "Res Arcana"],
        "icon": "⚙️"
    }
]

const themesEnum = [
    {
        "theme": "Medieval",
        "description": "Games set in the Middle Ages, often featuring castles, knights, and feudal societies.",
        "examples": ["Carcassonne", "Orléans", "Architects of the West Kingdom"],
        "icon": "🏰"
    },
    {
        "theme": "Space",
        "description": "Games set in outer space or on distant planets, often involving exploration, aliens, or futuristic technology.",
        "examples": ["Terraforming Mars", "Twilight Imperium", "Eclipse"],
        "icon": "🚀"
    },
    {
        "theme": "Zombie Apocalypse",
        "description": "Games focused on surviving or fighting against hordes of zombies in a post-apocalyptic world.",
        "examples": ["Zombicide", "Dead of Winter", "Last Night on Earth"],
        "icon": "🧟"
    },
    {
        "theme": "Ancient Civilization",
        "description": "Games based on ancient cultures, focusing on historical periods such as Rome, Egypt, and Greece.",
        "examples": ["7 Wonders", "Concordia", "Tigris & Euphrates"],
        "icon": "🏛️"
    },
    {
        "theme": "Pirates",
        "description": "Games centered on pirate adventures, treasure hunting, and high-seas battles.",
        "examples": ["Merchants & Marauders", "Jamaica", "Dead Men Tell No Tales"],
        "icon": "🏴‍☠️"
    },
    {
        "theme": "Horror",
        "description": "Games with dark, spooky themes involving supernatural elements like ghosts, monsters, and haunted places.",
        "examples": ["Betrayal at House on the Hill", "Arkham Horror", "Fury of Dracula"],
        "icon": "👻"
    },
    {
        "theme": "Wild West",
        "description": "Games set in the American Old West, featuring cowboys, outlaws, and frontier life.",
        "examples": ["Western Legends", "Bang!", "Colt Express"],
        "icon": "🤠"
    },
    {
        "theme": "Post-Apocalyptic",
        "description": "Games set after a global catastrophe, where players must survive in a world of limited resources.",
        "examples": ["Fallout", "Wasteland Express Delivery Service", "Radlands"],
        "icon": "☢️"
    },
    {
        "theme": "Fantasy",
        "description": "Games set in magical worlds with wizards, dragons, and mythical creatures, often featuring epic quests.",
        "examples": ["Gloomhaven", "Mage Knight", "Descent"],
        "icon": "🧙‍♂️"
    },
    {
        "theme": "Detective",
        "description": "Games focused on solving mysteries, with players acting as detectives gathering clues and solving cases.",
        "examples": ["Clue", "Chronicles of Crime", "Sherlock Holmes Consulting Detective"],
        "icon": "🕵️"
    },
    {
        "theme": "Nature",
        "description": "Games that celebrate nature, wildlife, and ecosystems, often educational and visually serene.",
        "examples": ["Wingspan", "Cascadia", "PARKS"],
        "icon": "🌲"
    },
    {
        "theme": "Train",
        "description": "Games centered around building rail networks, transporting goods, and managing resources.",
        "examples": ["Ticket to Ride", "Railways of the World", "Steam"],
        "icon": "🚂"
    },
    {
        "theme": "Mythology",
        "description": "Games inspired by myths and legends from cultures around the world, such as Norse, Greek, and Egyptian mythology.",
        "examples": ["Blood Rage", "Santorini", "Ankh: Gods of Egypt"],
        "icon": "⚔️"
    },
    {
        "theme": "Sci-Fi Horror",
        "description": "Games combining science fiction and horror, often set in isolated spaceships or alien worlds.",
        "examples": ["Nemesis", "Aliens: Another Glorious Day in the Corps", "Escape from the Aliens in Outer Space"],
        "icon": "👽"
    },
    {
        "theme": "Exploration",
        "description": "Games that emphasize discovery and adventure in uncharted lands or fantasy settings.",
        "examples": ["Lost Ruins of Arnak", "The 7th Continent", "Robinson Crusoe"],
        "icon": "🗺️"
    },
    {
        "theme": "Economic",
        "description": "Games centered around wealth building, resource management, and financial strategies.",
        "examples": ["Power Grid", "Brass: Birmingham", "Stockpile"],
        "icon": "💰"
    },
    {
        "theme": "Medical",
        "description": "Games with themes based on medical professions, disease outbreaks, and health crises.",
        "examples": ["Pandemic", "Viral", "Quarantine"],
        "icon": "🧬"
    },
    {
        "theme": "Underwater",
        "description": "Games set in aquatic environments, often featuring marine exploration and underwater life.",
        "examples": ["Abyss", "Aquatica", "Underwater Cities"],
        "icon": "🌊"
    },
    {
        "theme": "Crime",
        "description": "Games involving criminal activities, law enforcement, and investigating cases.",
        "examples": ["Crime City", "Deception: Murder in Hong Kong", "Detective: A Modern Crime Game"],
        "icon": "🚓"
    },
    {
        "theme": "Food and Drink",
        "description": "Games centered around culinary themes, restaurants, or cooking competitions.",
        "examples": ["Food Chain Magnate", "Kitchen Rush", "Sushi Go!"],
        "icon": "🍔"
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
    commonGames,
    categoriesEnum,
    mechanicsEnum,
    typeEnum,
    themesEnum,
    tagsEnum
}