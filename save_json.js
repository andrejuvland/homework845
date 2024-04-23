const fs = require("fs");
const { kv } = require("@vercel/node");

// Read the content of number.json file
const numberJsonPath = path.resolve(__dirname, "../number.json");
const numberJsonContent = fs.readFileSync(numberJsonPath, "utf-8");

// Parse the content of number.json file
const { favouriteNumber } = JSON.parse(numberJsonContent);

// Store the favorite number in KV store during initialization
(async () => {
  try {
    await kv.put("favoriteNumber", { favouriteNumber });
    console.log("Favorite number stored in KV store:", favouriteNumber);
  } catch (error) {
    console.error("Error storing favorite number in KV store:", error);
  }
})();

// Export the save function
const save = async (favNumber) => {
  console.log("saving");
  await kv.put("favoriteNumber", favNumber);
};

module.exports = { save };