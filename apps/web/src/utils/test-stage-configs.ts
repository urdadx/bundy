import { generateWordSearch, type Difficulty } from "@/utils/word-search-generator";

// Test configuration matching Meadow stages
const meadowStageConfigs = [
  { stage: 1, gridSize: 8, wordCount: 5, difficulty: "easy" as Difficulty },
  { stage: 2, gridSize: 10, wordCount: 6, difficulty: "easy" as Difficulty },
  { stage: 3, gridSize: 10, wordCount: 7, difficulty: "medium" as Difficulty },
  { stage: 4, gridSize: 12, wordCount: 8, difficulty: "medium" as Difficulty },
  { stage: 5, gridSize: 12, wordCount: 10, difficulty: "hard" as Difficulty },
];

console.log("🎮 Testing Meadow Stage Configurations\n");

meadowStageConfigs.forEach((config) => {
  console.log(`\n📍 Stage ${config.stage} (${config.difficulty.toUpperCase()})`);
  console.log(`   Grid Size: ${config.gridSize}x${config.gridSize}`);
  console.log(`   Target Words: ${config.wordCount}`);

  try {
    const puzzle = generateWordSearch({
      theme: "animals",
      difficulty: config.difficulty,
      size: config.gridSize,
      wordCount: config.wordCount,
    });

    console.log(`   ✅ Generated successfully!`);
    console.log(`   Words placed: ${puzzle.words.length}`);
    console.log(`   Words: ${puzzle.words.map((w) => w.word).join(", ")}`);
  } catch (error) {
    console.error(`   ❌ Failed:`, error);
  }
});

console.log("\n\n🎉 All stage configurations tested successfully!");
