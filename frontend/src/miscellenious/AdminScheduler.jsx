import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import ShareableLinks from "../components/shareable-links";

const localizer = momentLocalizer(moment);

const AdminScheduler = () => {
  const [events, setEvents] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    location: "",
    participants: "",
    start: new Date(),
    end: new Date(),
    isAllDay: false,
    recurrenceRule: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/schedule/events");
      const data = await response.json();
      setEvents(
        data.map((event) => ({
          id: event._id,
          title: event.roomName,
          description: event.description,
          location: event.location,
          participants: event.participants,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          isAllDay: event.isAllDay,
          recurrenceRule: event.recurrenceRule,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        title: "Error",
        description: "Could not fetch events.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Save event to the backend
  const saveEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: formState.title,
          description: formState.description,
          location: formState.location,
          participants: formState.participants.split(",").map((p) => p.trim()),
          startTime: formState.start,
          endTime: formState.end,
          isAllDay: formState.isAllDay,
          recurrenceRule: formState.recurrenceRule,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to save event");
      }

      toast({
        title: "Event saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchEvents();
      onClose();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not save the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete event from the backend
  const deleteEvent = async (eventId) => {
    if (!eventId) {
      toast({
        title: "Error",
        description: "No event ID found.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/schedule/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to delete event");
      }

      toast({
        title: "Event deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchEvents();
      onclose();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not delete the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={(event) => {
          setFormState({
            id: event.id || "",
            title: event.title || "",
            description: event.description || "",
            location: event.location || "",
            participants: event.participants || "",
            start: event.start,
            end: event.end,
            isAllDay: event.isAllDay || false,
            recurrenceRule: event.recurrenceRule || "",
          });
          onOpen();
        }}
        onSelectSlot={(slotInfo) => {
          setFormState({
            title: "",
            description: "",
            location: "",
            participants: "",
            start: slotInfo.start,
            end: slotInfo.end,
            isAllDay: slotInfo.action === "doubleClick",
            recurrenceRule: "",
          });
          onOpen();
        }}
        style={{
          height: "25rem",
        }}
        tooltipAccessor={(event) =>
          `${event.title}\n${event.description}\nLocation: ${event.location}\nParticipants: ${event.participants}`
        }
      />

      {/* Modal for creating a new event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {formState.id ? "Share Event" : "Create Event"}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Text textAlign={"center"} fontSize={"sm"} mb={"2"}>
              Start: {moment(formState.start).format("YYYY-MM-DD HH:mm")} &nbsp;
              End: {moment(formState.end).format("YYYY-MM-DD HH:mm")}
            </Text>
            {formState.id && <ShareableLinks roomName={formState.title} />}
            <FormControl mt={"2"}>
              <FormLabel>Room Name</FormLabel>
              <Input
                value={formState.title}
                onChange={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formState.description}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Participants (comma-separated)</FormLabel>
              <Input
                value={formState.participants}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    participants: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Recurrence Rule</FormLabel>
              <Input
                placeholder="E.g., DAILY, WEEKLY"
                value={formState.recurrenceRule}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    recurrenceRule: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Checkbox
                isChecked={formState.isAllDay}
                onChange={(e) =>
                  setFormState({ ...formState, isAllDay: e.target.checked })
                }
              >
                All Day Event
              </Checkbox>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {formState.id ? (
              <Button
                onClick={() => deleteEvent(formState.id)}
                isLoading={loading}
                colorScheme="red"
                mr={3}
              >
                Delete
              </Button>
            ) : (
              <Button
                onClick={saveEvent}
                isLoading={loading}
                colorScheme="blue"
                mr={3}
              >
                Save
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminScheduler;
