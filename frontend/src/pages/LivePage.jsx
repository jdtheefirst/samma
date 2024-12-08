import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { Box, Flex, Heading, Text, Spinner, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { LocalAudioTrack, LocalVideoTrack, Room } from "livekit-client";
import VideoPlayer from "../components/video";
import UpperNav from "../miscellenious/upperNav";
import { ChatState } from "../components/Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const Streamer = () => {
  const [streaming, setStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const roomRef = useRef(null);
  const { user } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  // Local stream setup
  useEffect(() => {
    const setupLocalStream = async () => {
      try {
        // Get the local media stream (audio + video)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, frameRate: 30 },
          audio: true,
        });

        // Display local video in the browser
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
      } catch (error) {
        console.error("Error initializing local stream:", error);
      }
    };

    setupLocalStream();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getLiveKitTokenFromBackend = async (roomName, userId, role) => {
    if (!user) {
      navigate("/dashboard");
      return;
    }

    try {
      // Request to create or check the room
      const createRoomResponse = await fetch("/api/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, userId, role }),
      });

      const createRoomData = await createRoomResponse.json();
      console.log(createRoomData.message, createRoomData.token, createRoomData);

      toast({
        title: createRoomData.message,
        status: "info",
      });

      if (!createRoomResponse.ok) {
        throw new Error(createRoomData.error || "Failed to create room");
      }

      return createRoomData.token;
    } catch (error) {
      console.error(error);
    }
  };

  const startStreaming = () => {
    setStreaming(true);

    if (!localStreamRef.current) {
      console.error("Local stream is not available.");
      return;
    }

    // Ensure media tracks are available
    const stream = localStreamRef.current;
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    if (!videoTrack || !audioTrack) {
      console.error("Video or audio track is missing.");
      return;
    }

    // Proceed with LiveKit initialization only when media is available
    initializeLiveKitForPublishing(stream);
  };

  const initializeLiveKitForPublishing = async (stream) => {
    const roomUrl = "wss://test.worldsamma.org:8443";
    try {
      console.log("Fetching token...");
      const token = await getLiveKitTokenFromBackend(
        "test-room",
        user._id,
        "publisher"
      );

      if (!token) {
        throw new Error("Failed to generate token");
      }
      console.log("Token received:", token);

      const room = new Room();

      console.log("Connecting to room...");
      await room.connect(roomUrl, token);

      roomRef.current = room;
      setConnected(true);
      console.log("Connected to room");

      // Ensure valid stream tracks are available
      if (
        stream.getAudioTracks().length === 0 ||
        stream.getVideoTracks().length === 0
      ) {
        throw new Error("Stream does not have valid audio or video tracks");
      }

      // Local tracks
      const localAudio = new LocalAudioTrack(stream.getAudioTracks()[0]);
      const localVideo = new LocalVideoTrack(stream.getVideoTracks()[0]);

      // Publish local tracks to the room
      console.log("Publishing tracks...");
      await room.localParticipant.publishTrack(localAudio);
      await room.localParticipant.publishTrack(localVideo);

      console.log("Streaming to LiveKit room...");
      setConnected(true);
    } catch (error) {
      setConnected(false);
      console.error("Error during LiveKit connection:", error);
    }
  };

  const stopStreaming = () => {
    setConnected(false);
    setStreaming(false);
    if (roomRef.current) {
      roomRef.current.disconnect();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
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
