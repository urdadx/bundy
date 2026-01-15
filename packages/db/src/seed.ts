import { db } from "./index";
import { world, stage, shopItem } from "./schema/game-schema";

const THEME_WORDS = {
  animals: [
    "LION",
    "TIGER",
    "ELEPHANT",
    "GIRAFFE",
    "ZEBRA",
    "MONKEY",
    "PANDA",
    "KANGAROO",
    "DOLPHIN",
    "PENGUIN",
    "EAGLE",
    "BUTTERFLY",
    "LEOPARD",
    "CHEETAH",
    "URCHIN",
    "CROCODILE",
    "GORILLA",
  ],
  planets: [
    "MERCURY",
    "VENUS",
    "EARTH",
    "MARS",
    "JUPITER",
    "SATURN",
    "URANUS",
    "NEPTUNE",
    "PLUTO",
    "MOON",
    "COMET",
    "ASTEROID",
    "GALAXY",
    "NEBULA",
  ],
  technology: [
    "COMPUTER",
    "INTERNET",
    "SOFTWARE",
    "HARDWARE",
    "KEYBOARD",
    "MOUSE",
    "MONITOR",
    "ALGORITHM",
    "DATABASE",
    "NETWORK",
    "SERVER",
    "CLOUD",
    "MOBILE",
    "TABLET",
    "LAPTOP",
    "DIGITAL",
    "BINARY",
    "CODING",
  ],
  food: [
    "PIZZA",
    "BURGER",
    "PASTA",
    "SUSHI",
    "TACO",
    "SANDWICH",
    "SALAD",
    "CHICKEN",
    "STEAK",
    "FISH",
    "RICE",
    "NOODLES",
    "BREAD",
    "CHEESE",
    "CHOCOLATE",
    "COOKIE",
    "CAKE",
    "FRUIT",
    "VEGETABLE",
  ],
  sports: [
    "SOCCER",
    "BASKETBALL",
    "FOOTBALL",
    "TENNIS",
    "BASEBALL",
    "HOCKEY",
    "GOLF",
    "SWIMMING",
    "RUNNING",
    "CYCLING",
    "BOXING",
    "CRICKET",
    "VOLLEYBALL",
    "RUGBY",
    "SKIING",
    "SURFING",
    "SKATING",
  ],
  general: [
    "HELLO",
    "WORLD",
    "FRIEND",
    "FAMILY",
    "HAPPY",
    "SMILE",
    "LOVE",
    "PEACE",
    "DREAM",
    "HOPE",
    "LIGHT",
    "MUSIC",
    "DANCE",
    "PLAY",
  ],
  science: [
    "ATOM",
    "MOLECULE",
    "GENETICS",
    "PHYSICS",
    "BIOLOGY",
    "CHEMISTRY",
    "ENERGY",
    "LABORATORY",
    "RESEARCH",
    "TELESCOPE",
    "MICROSCOPE",
    "GRAVITY",
  ],
  vocabulary: [
    "ELOQUENT",
    "EPHEMERAL",
    "SERENDIPITY",
    "SOLITUDE",
    "ETHEREAL",
    "LUMINOUS",
    "PANACEA",
    "MELLIFLUOUS",
    "PRISTINE",
    "EVOCATIVE",
    "RESONANCE",
    "SURREAL",
  ],
  countries: [
    "CANADA",
    "BRAZIL",
    "FRANCE",
    "GERMANY",
    "JAPAN",
    "AUSTRALIA",
    "EGYPT",
    "MEXICO",
    "ITALY",
    "SPAIN",
    "NORWAY",
    "SWEDEN",
  ],
};

// Add difficulty constraints matching the word search generator
const DIFFICULTY_CONFIG = {
  easy: { minWordLength: 4, maxWordLength: 8 },
  medium: { minWordLength: 4, maxWordLength: 10 },
  hard: { minWordLength: 5, maxWordLength: 11 },
};

function getRandomWords(
  theme: string,
  count: number,
  gridSize: number,
  difficulty: string,
): string {
  const words = THEME_WORDS[theme as keyof typeof THEME_WORDS] || THEME_WORDS.general;
  const diffConfig =
    DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.easy;

  // Filter by both grid size AND difficulty constraints
  const validWords = words.filter(
    (word) =>
      word.length >= diffConfig.minWordLength &&
      word.length <= diffConfig.maxWordLength &&
      word.length <= gridSize,
  );

  const uniqueWords = [...new Set(validWords)];
  const shuffled = [...uniqueWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(",");
}

async function seed() {
  console.log("🌱 Starting database seed...");

  console.log("🧹 Clearing existing data...");
  await db.delete(stage);
  await db.delete(world);
  await db.delete(shopItem);

  // Define all 6 worlds
  const worlds = [
    {
      id: "meadow",
      name: "Meadow",
      description: "A peaceful grassy field",
      color: "primary",
      requiredXp: 0,
      theme: "animals",
      order: 1,
    },
    {
      id: "relic",
      name: "Relic",
      description: "Forgotten ruins ",
      color: "secondary",
      requiredXp: 100,
      theme: "food",
      order: 2,
    },
    {
      id: "volcano",
      name: "Volcano",
      description: "Test your knowledge .",
      color: "danger",
      requiredXp: 200,
      theme: "science",
      order: 3,
    },
    {
      id: "cyber",
      name: "Cyber",
      description: "Building blocks of reality.",
      color: "super",
      requiredXp: 300,
      theme: "vocabulary",
      order: 4,
    },
    {
      id: "void",
      name: " Void",
      description: "Edge of the universe.",
      color: "highlight",
      requiredXp: 400,
      theme: "sports",
      order: 5,
    },
    {
      id: "malyka",
      name: "Malyka",
      description: "A journey through the cultures",
      color: "golden",
      requiredXp: 500,
      theme: "countries",
      order: 6,
    },
  ];

  console.log("🌍 Creating worlds...");
  await db.insert(world).values(worlds);
  console.log(`✅ Created ${worlds.length} worlds`);

  // Create 5 stages for each world
  console.log("🎮 Creating stages for all worlds...");
  for (const w of worlds) {
    const worldStages = [
      {
        id: `${w.id}-1`,
        worldId: w.id,
        stageNumber: 1,
        difficulty: "easy",
        gridSize: 8,
        wordCount: 5,
        timeLimit: 180,
        xpReward: 10,
        diamondReward: 5,
        words: getRandomWords(w.theme, 5, 8, "easy"),
      },
      {
        id: `${w.id}-2`,
        worldId: w.id,
        stageNumber: 2,
        difficulty: "easy",
        gridSize: 10,
        wordCount: 6,
        timeLimit: 240,
        xpReward: 15,
        diamondReward: 8,
        words: getRandomWords(w.theme, 6, 10, "easy"),
      },
      {
        id: `${w.id}-3`,
        worldId: w.id,
        stageNumber: 3,
        difficulty: "medium",
        gridSize: 10,
        wordCount: 7,
        timeLimit: 300,
        xpReward: 20,
        diamondReward: 10,
        words: getRandomWords(w.theme, 7, 10, "medium"),
      },
      {
        id: `${w.id}-4`,
        worldId: w.id,
        stageNumber: 4,
        difficulty: "medium",
        gridSize: 11,
        wordCount: 8,
        timeLimit: 360,
        xpReward: 25,
        diamondReward: 12,
        words: getRandomWords(w.theme, 8, 11, "medium"),
      },
      {
        id: `${w.id}-5`,
        worldId: w.id,
        stageNumber: 5,
        difficulty: "hard",
        gridSize: 11,
        wordCount: 10,
        timeLimit: 420,
        xpReward: 30,
        diamondReward: 15,
        words: getRandomWords(w.theme, 10, 11, "hard"),
      },
    ];
    await db.insert(stage).values(worldStages);
    console.log(`✅ Created stages for ${w.name}`);
  }

  // Create shop items
  console.log("🛍️ Creating shop items...");
  const shopItems = [
    {
      id: "freeze-potion",
      name: "Freeze Potion",
      description: "Tame the cold time itself",
      image: "/rewards/freeze-potion.png",
      price: 5,
      category: "powerup",
      sortOrder: 1,
    },
    {
      id: "golden-heart",
      name: "Golden Heart",
      description: "Heart of the pale queen of the frost",
      image: "/rewards/rare-heart.png",
      price: 5,
      category: "powerup",
      sortOrder: 2,
    },
    {
      id: "diamond-danes",
      name: "Diamond of the Danes",
      description: "A rare diamond with mystical powers",
      image: "/rewards/ruby.png",
      price: 30,
      category: "bundle",
      sortOrder: 3,
    },
    {
      id: "hints-10",
      name: "10 Hints",
      description: "Get 10 hints to help you solve puzzles faster",
      image: "/rewards/hint.png",
      price: 5,
      category: "powerup",
      sortOrder: 4,
    },
    {
      id: "heavyweight-champ",
      name: "Heavyweight Champ",
      description: "A mascot skin for the ultimate champion",
      image: "/rewards/wrestler.png",
      price: 10,
      category: "cosmetic",
      sortOrder: 5,
    },
    {
      id: "bracelet-cyclla",
      name: "Bracelet of Cyclla",
      description: "A mystical bracelet from the ages",
      image: "/rewards/rare-bracelets.png",
      price: 20,
      category: "cosmetic",
      sortOrder: 6,
    },
  ];

  await db.insert(shopItem).values(shopItems);
  console.log(`✅ Created ${shopItems.length} shop items`);

  console.log("\n📊 Seed Summary:");
  console.log(`   Worlds: ${worlds.length}`);
  console.log(`   Stages per World: 5`);
  console.log(`   Total Stages: ${worlds.length * 5}`);
  console.log(`   Shop Items: ${shopItems.length}`);
  console.log("\n🎉 Database seed completed successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
