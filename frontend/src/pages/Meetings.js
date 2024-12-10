import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Grid,
  GridItem,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
// import { useRoom, VideoRenderer } from "@livekit/components-react";
import UpperNav from "../miscellenious/upperNav";

const LiveKitMeeting = ({ roomId, token }) => {
  const toast = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Create a LiveKit room instance
  const { connect, room, participants, isConnecting, isConnected } = useRoom();

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        // Connect to the LiveKit server
        await connect(`wss://your-livekit-server`, token, {
          autoSubscribe: true,
        });

        // Add local tracks
        const localTracks = await createLocalTracks({
          audio: true,
          video: true,
        });

        room.localParticipant.publishTracks(localTracks);

        toast({
          title: "Connected to the room.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error connecting to LiveKit room:", error);
        toast({
          title: "Error",
          description: "Failed to connect to the meeting.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [connect, room, token, toast]);

  const toggleMute = () => {
    const audioTrack = room?.localParticipant.audioTracks.values().next()
      .value?.track;
    if (audioTrack) {
      const isEnabled = audioTrack.isMuted;
      isEnabled ? audioTrack.unmute() : audioTrack.mute();
      setIsMuted(!isEnabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = room?.localParticipant.videoTracks.values().next()
      .value?.track;
    if (videoTrack) {
      const isEnabled = videoTrack.isMuted;
      isEnabled ? videoTrack.unmute() : videoTrack.mute();
      setIsVideoOn(!isEnabled);
    }
  };

  const leaveMeeting = () => {
    if (room) {
      room.disconnect();
    }
    toast({
      title: "You have left the meeting.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      fontFamily="Arial, sans-serif"
      color="gray.800"
    >
      <UpperNav />

      <VStack spacing={4} align="stretch" mt={10}>
        <Box p={4} bg="gray.100" borderRadius="md">
          <Text fontSize="xl" fontWeight="bold">
            Meeting Room: {roomId}
          </Text>
        </Box>
        <Grid
          templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={4}
          bg="gray.50"
          p={4}
          borderRadius="md"
          maxH="80vh"
          overflowY="auto"
        >
          {/* Local participant video */}
          {room?.localParticipant && (
            <GridItem>
              <VideoRenderer
                track={
                  room.localParticipant.getTrack(Track.Source.Camera)?.track
                }
                isLocal
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  background: "black",
                }}
              />
              <Text textAlign="center" fontSize="sm" mt={2}>
                You
              </Text>
            </GridItem>
          )}

          {/* Remote participant videos */}
          {participants.map((participant) => (
            <GridItem key={participant.sid}>
              <VideoRenderer
                track={participant.getTrack(Track.Source.Camera)?.track}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  background: "black",
                }}
              />
              <Text textAlign="center" fontSize="sm" mt={2}>
                {participant.identity}
              </Text>
            </GridItem>
          ))}
        </Grid>

        <HStack justifyContent="center" spacing={2} mt={4}>
          <Button
            colorScheme={isMuted ? "red" : "blue"}
            onClick={toggleMute}
            isDisabled={!isConnected}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <Button
            colorScheme={isVideoOn ? "blue" : "red"}
            onClick={toggleVideo}
            isDisabled={!isConnected}
          >
            {isVideoOn ? "Stop Video" : "Start Video"}
          </Button>
          <Button colorScheme="gray" onClick={leaveMeeting}>
            Leave Meeting
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LiveKitMeeting;
