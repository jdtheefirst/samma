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
const cors = require("cors");

// Define allowed origins
const allowedOrigins = [
  "https://worldsamma.org",
  "https://live.worldsamma.org",
];

// Configure CORS options
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config({ path: "./secrets.env" });
connectDB();

const app = express();
const PORT = process.env.PORT;

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Initialize Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
initializeSocketIO(server);

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

// Error handling
app.use(notFound);
app.use(errorHandler);
