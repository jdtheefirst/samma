// routes/events.js
const express = require("express");
const Event = require("../models/eventsModel");
const { limiter } = require("../middleware/limiter");
const router = express.Router();

// Middleware to check for overlapping events
const checkForOverlap = async (req, res, next) => {
  const { startTime, endTime, id } = req.body;

  try {
    const overlappingEvent = await Event.findOne({
      _id: { $ne: id }, // Exclude the current event in edit mode
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    });

    if (overlappingEvent) {
      return res.status(400).json({
        error: "This event overlaps with another existing event.",
      });
    }

    next();
  } catch (error) {
    console.error("Error checking for overlapping events:", error);
    res.status(500).json({ error: "Server error while checking overlaps." });
  }
};

// Fetch all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// Create a new event
router.post("/", checkForOverlap, async (req, res) => {
  const {
    roomName,
    description,
    location,
    participants,
    startTime,
    endTime,
    isAllDay,
    recurrenceRule,
  } = req.body;

  try {
    const event = new Event({
      roomName,
      description,
      location,
      participants,
      startTime,
      endTime,
      isAllDay,
      recurrenceRule,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event." });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(403).json({ error: "No resource found." });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

router.get("/room", limiter, async (req, res) => {
  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ error: "Room name is required." });
  }

  try {
    const roomDetails = await Event.findOne({ roomName: room });

    if (!roomDetails) {
      return res
        .status(404)
        .json({ error: `Room with name "${room}" does not exist.` });
    }

    // Get current time
    const now = new Date();

    // Check if the current time is between the event's start and end time
    if (now >= roomDetails.startTime && now <= roomDetails.endTime) {
      roomDetails.isLive = true; // Mark the room as live if the time is within range
    } else {
      roomDetails.isLive = false; // Mark the room as not live if the time is out of range
    }

    res.status(200).json(roomDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching room data." });
  }
});

module.exports = router;
