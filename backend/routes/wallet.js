const express = require("express");
const router = express.Router();
const db = require("../database");
const authMiddleware = require("../middleware/auth");

// Get wallet balance for authenticated user
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    db.get(
      "SELECT balance FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          console.error("Error fetching wallet balance:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ balance: user.balance || 0 });
      }
    );
  } catch (error) {
    console.error("Error in wallet balance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Deposit to wallet
router.post("/deposit", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    db.run(
      "UPDATE users SET balance = balance + ? WHERE id = ?",
      [amount, userId],
      function (err) {
        if (err) {
          console.error("Error depositing to wallet:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Get updated balance
        db.get(
          "SELECT balance FROM users WHERE id = ?",
          [userId],
          (err, user) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }

            res.json({
              message: "Deposit successful",
              balance: user.balance || 0,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in wallet deposit:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Withdraw from wallet
router.post("/withdraw", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Check current balance
    db.get(
      "SELECT balance FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          console.error("Error checking balance:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        if ((user.balance || 0) < amount) {
          return res.status(400).json({ error: "Insufficient balance" });
        }

        // Withdraw
        db.run(
          "UPDATE users SET balance = balance - ? WHERE id = ?",
          [amount, userId],
          function (err) {
            if (err) {
              console.error("Error withdrawing from wallet:", err);
              return res.status(500).json({ error: "Database error" });
            }

            // Get updated balance
            db.get(
              "SELECT balance FROM users WHERE id = ?",
              [userId],
              (err, updatedUser) => {
                if (err) {
                  return res.status(500).json({ error: "Database error" });
                }

                res.json({
                  message: "Withdrawal successful",
                  balance: updatedUser.balance || 0,
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in wallet withdraw:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
