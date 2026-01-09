import { db } from "./index";
import { world, stage } from "./schema/game-schema";

const THEME_WORDS = {
  animals: ['LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'MONKEY', 'PANDA', 'KANGAROO', 'DOLPHIN', 'PENGUIN', 'EAGLE', 'BUTTERFLY', 'LEOPARD', 'CHEETAH', 'RHINOCEROS', 'HIPPOPOTAMUS', 'CROCODILE', 'GORILLA'],
  planets: ['MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO', 'MOON', 'COMET', 'ASTEROID', 'GALAXY', 'NEBULA'],
  technology: ['COMPUTER', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'KEYBOARD', 'MOUSE', 'MONITOR', 'ALGORITHM', 'DATABASE', 'NETWORK', 'SERVER', 'CLOUD', 'MOBILE', 'TABLET', 'LAPTOP', 'DIGITAL', 'BINARY', 'CODING'],
  food: ['PIZZA', 'BURGER', 'PASTA', 'SUSHI', 'TACO', 'SANDWICH', 'SALAD', 'CHICKEN', 'STEAK', 'FISH', 'RICE', 'NOODLES', 'BREAD', 'CHEESE', 'CHOCOLATE', 'COOKIE', 'CAKE', 'FRUIT', 'VEGETABLE'],
  sports: ['SOCCER', 'BASKETBALL', 'FOOTBALL', 'TENNIS', 'BASEBALL', 'HOCKEY', 'GOLF', 'SWIMMING', 'RUNNING', 'CYCLING', 'BOXING', 'CRICKET', 'VOLLEYBALL', 'RUGBY', 'SKIING', 'SURFING', 'SKATING'],
  general: ['HELLO', 'WORLD', 'FRIEND', 'FAMILY', 'HAPPY', 'SMILE', 'LOVE', 'PEACE', 'DREAM', 'HOPE', 'LIGHT', 'MUSIC', 'DANCE', 'PLAY'],
  science: ['ATOM', 'MOLECULE', 'GENETICS', 'PHYSICS', 'BIOLOGY', 'CHEMISTRY', 'ENERGY', 'LABORATORY', 'RESEARCH', 'TELESCOPE', 'MICROSCOPE', 'GRAVITY'],
  vocabulary: ['ELOQUENT', 'EPHEMERAL', 'SERENDIPITY', 'SOLITUDE', 'ETHEREAL', 'LUMINOUS', 'PANACEA', 'MELLIFLUOUS', 'PRISTINE', 'EVOCATIVE', 'RESONANCE', 'SURREAL'],
  countries: ['CANADA', 'BRAZIL', 'FRANCE', 'GERMANY', 'JAPAN', 'AUSTRALIA', 'EGYPT', 'MEXICO', 'ITALY', 'SPAIN', 'NORWAY', 'SWEDEN']
};

function getRandomWords(theme: string, count: number, maxLength: number): string {
  const words = THEME_WORDS[theme as keyof typeof THEME_WORDS] || THEME_WORDS.general;
  const validWords = words.filter(word => word.length <= maxLength - 2);
  const shuffled = [...validWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(',');
}

async function seed() {
  console.log("🌱 Starting database seed...");

  console.log("🧹 Clearing existing data...");
  await db.delete(stage);
  await db.delete(world);

  // Define all 6 worlds
  // Each world gives 100 XP total (10+15+20+25+30), so XP requirements increase by 100
  const worlds = [
    {
      id: "meadow",
      name: "Meadow",
      description: "A peaceful grassy field where majestic animals roam free.",
      color: "primary",
      requiredXp: 0,
      theme: "animals",
      order: 1,
    },
    {
      id: "relic",
      name: "Relic",
      description: "Forgotten ruins filled with ancient culinary secrets.",
      color: "secondary",
      requiredXp: 100,
      theme: "food",
      order: 2,
    },
    {
      id: "volcano",
      name: "Volcano",
      description: "Test your knowledge amidst the heat of flowing magma.",
      color: "danger",
      requiredXp: 200,
      theme: "science",
      order: 3,
    },
    {
      id: "cyber",
      name: "Cyber",
      description: "A digital landscape where words are the building blocks of reality.",
      color: "super",
      requiredXp: 300,
      theme: "vocabulary",
      order: 4,
    },
    {
      id: "void",
      name: " Void",
      description: "The ultimate challenge at the edge of the universe.",
      color: "highlight",
      requiredXp: 400,
      theme: "sports",
      order: 5,
    },
    {
      id: "malyka",
      name: "Malyka",
      description: "A journey through the cultures and languages of the world.",
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
        words: getRandomWords(w.theme, 5, 8),
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
        words: getRandomWords(w.theme, 6, 10),
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
        words: getRandomWords(w.theme, 7, 10),
      },
      {
        id: `${w.id}-4`,
        worldId: w.id,
        stageNumber: 4,
        difficulty: "medium",
        gridSize: 12,
        wordCount: 8,
        timeLimit: 360,
        xpReward: 25,
        diamondReward: 12,
        words: getRandomWords(w.theme, 8, 12),
      },
      {
        id: `${w.id}-5`,
        worldId: w.id,
        stageNumber: 5,
        difficulty: "hard",
        gridSize: 12,
        wordCount: 10,
        timeLimit: 420,
        xpReward: 30,
        diamondReward: 15,
        words: getRandomWords(w.theme, 10, 12),
      },
    ];
    await db.insert(stage).values(worldStages);
    console.log(`✅ Created stages for ${w.name}`);
  }

  console.log("\n📊 Seed Summary:");
  console.log(`   Worlds: ${worlds.length}`);
  console.log(`   Stages per World: 5`);
  console.log(`   Total Stages: ${worlds.length * 5}`);
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
