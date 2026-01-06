1. we have 6 worlds named meadow, relic, volcano, cyber, void and malyka
2. Each world has the following requirement that need to be met inorder to complete it.
- number of xp - the user needs to collect/gain a specified number of xp in 		 order to complete or enter a world. for example, inorder to enter world relic, the user needs to have 50 xp if not they are denied access (world is locked)
 - each world has one theme for which the word search words will be generated from (example: animals, food, science, vocabulary, sports, countries/cities)
 - each world has 5 stages with increasing difficulty of words and grid style and size. this will determine how the puzzle will be generated for each stage
 for example, in relic word 1, the words will be basic with a grid size of say 6 * 6.
 - for each stage, there are its set of words, allocated time to complete the puzzle and grid settings (theme, difficulty, size, word count). take a look at the #world-search-generator.ts file for more context.
 - by default a user has 10 xp and 0 diamonds