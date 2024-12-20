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
const schedule = require("./routes/schedule");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initializeSocketIO } = require("./socket");
const { limiter } = require("./middleware/limiter");
const cors = require("cors");

// Define allowed origins
const allowedOrigins = [
  "https://worldsamma.org",
  "https://live.worldsamma.org",
  "https://test.worldsamma.org",
];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

dotenv.config({ path: "./secrets.env" });
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cors(corsOptions));

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

app.post("/api/create-room", limiter, async (req, res) => {
  const { roomName, userId, role } = req.body;

  const { RoomServiceClient } = await import("livekit-server-sdk");

  const roomService = new RoomServiceClient(
    process.env.LIVEKIT_SERVER_URL,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );

  if (!roomName || !userId || !role) {
    return res
      .status(400)
      .json({ error: "Room name, userId, and role are required" });
  }

  try {
    const rooms = await roomService.listRooms();
    const existingRoom = rooms.find((room) => room.name === roomName);

    if (!existingRoom && role === "publisher") {
      // No room exists, allow the publisher to create the room
      const newRoom = {
        name: roomName,
        emptyTimeout: 60,
        maxParticipants: 10000,
      };
      const createdRoom = await roomService.createRoom(newRoom);

      const token = await generateLiveKitToken(roomName, userId, role);
      return res.status(200).json({
        message: "Room created successfully",
        room: createdRoom,
        token,
      });
    }

    if (existingRoom && role === "publisher") {
      // Room exists and a publisher is trying to join, deny the request
      const roomName = "test-room"; // Name of the room to delete

      // Attempt to delete the room
      await roomService.deleteRoom(roomName);
      return res.status(403).json({
        message: "A publisher is already streaming in this room, room deleted!",
      });
    }

    if (existingRoom && role === "subscriber") {
      // Room exists and a subscriber is trying to join, allow it
      const token = await generateLiveKitToken(roomName, userId, role);
      return res.json({
        message: "Generated token",
        token,
      });
    }

    if (!existingRoom && role === "subscriber") {
      // No room exists and a subscriber is trying to join, deny the request
      return res.status(403).json({
        message: "Live streaming hasn't started",
      });
    }
  } catch (error) {
    console.error("Error processing room:", error);
    return res.status(500).json({ error: "Failed to process room" });
  }
});

async function generateLiveKitToken(roomName, userId, role) {
  const { AccessToken } = await import("livekit-server-sdk");

  const identity = userId;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const ttl = "10m";

  const canPublish = (await role) === "publisher";
  const canSubscribe = (await role) === "subscriber";
  console.log(canPublish, canSubscribe);

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl,
  });

  // Add grants
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  // Return the token as JWT
  return await token.toJwt();
}

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
app.use("/api/schedule", schedule);

app.use(notFound);
app.use(errorHandler);
