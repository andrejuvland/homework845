const { Router } = require("express");
const add = require("../add");
const { kv } = require("@vercel/node"); // Import the kv object from @vercel/node

const router = new Router();

router.get("/sum/:number1/:number2", async (req, res) => {
  const { number1, number2 } = req.params;
  if (number1 == null || number2 == null) {
    res.status(400).send("Not provided numbers");
    return;
  }
  if (isNaN(parseInt(number1)) || isNaN(parseInt(number2))) {
    res.status(400).send("Numbers need to be integers");
    return;
  }

  // Retrieve favorite number from KV store
  const storedData = await kv.get("favoriteNumber");
  const favNumber = storedData ? storedData.favoriteNumber : null;

  let result = add(parseInt(number1), parseInt(number2));
  if (favNumber != null) {
    result = add(result, favNumber);
  }

  res.json({
    status: "success",
    result: result,
  });
});

router.post("/favNumber", async (req, res) => {
    const { number } = req.body;
    if (number == null) {
      res.status(400).send("No favorite number provided");
      return;
    }
    if (isNaN(parseInt(number))) {
      res.status(400).send("The favorite number needs to be an integer");
      return;
    }
  
    try {
      // Store the new favorite number in the KV store
      await kv.put("favoriteNumber", { favoriteNumber: parseInt(number) });
      
      res.json({
        status: "success",
        newFavoriteNumber: number,
      });
    } catch (error) {
      console.error("Error adding new favorite number to KV store:", error);
      res.status(500).send("Internal server error");
    }
  });
  
module.exports = router;