import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { Box, Flex, Heading, Text, Spinner, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  Room,
} from "livekit-client";
import UpperNav from "../miscellenious/upperNav";
import { getLiveKitTokenFromBackend } from "../components/config/chatlogics";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/video";

const Streamer = ({ user }) => {
  const [streaming, setStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const roomRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const startStreaming = () => {
    setStreaming(true);
    initializeLiveKitForPublishing();
  };

  const initializeLiveKitForPublishing = async () => {
    const roomUrl = "wss://test.worldsamma.org";
    try {
      console.log("Fetching token...");
      const token = await getLiveKitTokenFromBackend(
        "test-room",
        user?.name,
        "publisher",
        toast,
        navigate
      );

      if (!token) {
        throw new Error("Failed to generate token");
      }
      console.log("Token received:", token);

      const room = new Room({ adaptiveStream: true });

      console.log("Connecting to room...");
      await room.connect(roomUrl, token);

      roomRef.current = room;
      setConnected(true);

      const videoTrack = await createLocalVideoTrack();
      const audioTrack = await createLocalAudioTrack();

      if (videoTrack) {
        console.log("Publishing video track...");
        await room.localParticipant.publishTrack(videoTrack);
        // Attach video track to video element
        if (localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
        }
      }
      if (audioTrack) {
        console.log("Publishing audio track...");
        await room.localParticipant.publishTrack(audioTrack);
      }

      console.log("Streaming to LiveKit room...");
    } catch (error) {
      setConnected(false);
      console.error("Error during LiveKit connection:", error);
    }
  };

  const stopStreaming = async () => {
    setConnected(false);
    setStreaming(false);
    if (roomRef.current) {
      try {
        // Disable camera and microphone before disconnecting
        await roomRef.current.localParticipant.setCameraEnabled(false);
        await roomRef.current.localParticipant.setMicrophoneEnabled(false);

        // Disconnect the room after disabling the tracks
        roomRef.current.disconnect();
      } catch (error) {
        console.error("Error while stopping the stream:", error);
      }
    }
  };

  useEffect(() => {
    return async () => {
      await stopStreaming();
    };
  }, []);

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
      <Box
        position="relative"
        width="80%"
        maxWidth="720px"
        mb={2}
        marginTop={20}
        bg="black"
        borderRadius="8px"
        overflow="hidden"
      >
        <VideoPlayer localVideoRef={localVideoRef} />

        {!connected && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.7)"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="1.5rem"
          >
            <Spinner size="lg" />
            <Text ml={2}>Connecting...</Text>
          </Box>
        )}
      </Box>

      <Box textAlign="center" width="100%" maxWidth="500px">
        <Heading as="h2" size="lg" mb={3}>
          Live Stream Control
        </Heading>

        <Flex justifyContent="space-around" mb={3}>
          <Text>Status: {connected ? "Connected" : "Disconnected"}</Text>
          <Text>Status: {streaming ? "Live" : "Idle"}</Text>
        </Flex>

        <Flex justifyContent="center" gap={2}>
          <Button
            leftIcon={<FaPlay />}
            onClick={startStreaming}
            colorScheme="green"
            size="lg"
            fontSize={"sm"}
            isDisabled={streaming}
          >
            Start Streaming
          </Button>

          <Button
            leftIcon={<FaStop />}
            onClick={stopStreaming}
            colorScheme="red"
            size="lg"
            fontSize={"sm"}
          >
            Stop Streaming
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Streamer;
