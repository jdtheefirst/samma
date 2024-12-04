const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRouter");
const payRoutes = require("./routes/payRouter");
const clubRouter = require("./routes/clubsRouter");
const messageRouter = require("./routes/messageRoute");
const submitRouter = require("./routes/submitRouter");
const provinceRouter = require("./routes/provinceRouter");
const nationalRouter = require("./routes/nationalRouter");
const voteRouter = require("./routes/voteRouter");
const donateRouter = require("./routes/donateRouter");
const useTranslator = require("./routes/translateRouter");
const downloadRouter = require("./routes/downloadRouter");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initializeSocketIO } = require("./socket");
const { limiter } = require("./middleware/limiter");

dotenv.config({ path: "./secrets.env" });
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// Initialize Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
initializeSocketIO(server);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.post("/api/create-room", async (req, res) => {
  const { roomName } = req.body;

  const { RoomServiceClient } = await import("livekit-server-sdk");

  if (!roomName) {
    return res.status(400).json({ error: "Room name is required" });
  }

  const roomService = new RoomServiceClient(
    process.env.LIVEKIT_SERVER_URL,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );

  try {
    const token = await generateApiToken();
    console.log(token);

    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 300, // Automatically close the room after 5 minutes of inactivity
      maxParticipants: 10, // Set maximum participants
    });

    res.status(200).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Helper function to generate an API token for room creation
async function generateApiToken() {
  const { AccessToken } = await import("livekit-server-sdk");

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  token.addGrant({ roomCreate: true });
  const tokenJwt = await token.toJwt();

  return tokenJwt;
}

app.post("/api/generate-token", limiter, async (req, res) => {
  try {
    const { AccessToken } = await import("livekit-server-sdk");

    const { identity, room } = req.query;

    if (!identity || !room) {
      console.error("Identity or room is missing from the request.");
      return res.status(400).json({ error: "Identity and room are required" });
    }

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity,
        ttl: 3600, // Token expiry in seconds
      }
    );

    // Add grant permissions
    token.addGrant({ roomJoin: true, room });

    // Generate JWT token
    const tokenJwt = await token.toJwt();

    // Send the token to the frontend
    res.json(tokenJwt);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/paycheck", payRoutes);
app.use("/api/message", messageRouter);
app.use("/api/clubs", clubRouter);
app.use("/api/submit", submitRouter);
app.use("/api/province", provinceRouter);
app.use("/api/national", nationalRouter);
app.use("/api/translate", useTranslator);
app.use("/api/donate", donateRouter);
app.use("/api/poll", voteRouter);
app.use("/api/download", downloadRouter);

// // Serve static assets and React frontend in production
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "./frontend/build")));

//   // Serve index.html for all other routes
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "./frontend/build", "index.html"));
//   });
// } else {
//   // Fallback for development or other environments
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
