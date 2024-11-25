import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import "../App.css";
import "webrtc-adapter";
import StatusIndicator from "../components/Status";
import { Box, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import Janus from "janus-gateway";
import VideoPlayer from "../components/video";
import UpperNav from "../miscellenious/upperNav";

const JanusRtmpStreamer = () => {
  const janusRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check permissions
        const cameraPermission = await navigator.permissions.query({
          name: "camera",
        });
        const micPermission = await navigator.permissions.query({
          name: "microphone",
        });

        if (
          cameraPermission.state !== "granted" ||
          micPermission.state !== "granted"
        ) {
          console.warn("Camera or microphone permissions are not granted.");
          // Optionally show a UI prompt here to notify the user
        } else {
          alert("Please allow camera and microphone access to stream.");
          console.log("Permissions granted for camera and microphone.");
        }

        // Initialize Janus
        initializeJanusForPublishing();
      } catch (error) {
        console.error(
          "Error initializing Janus or checking permissions:",
          error
        );
      }
    };

    initialize();

    // Cleanup logic on component unmount
    return () => {
      cleanUp();
    };
  }, []);

  const initializeJanusForPublishing = () => {
    Janus.init({
      debug: "all",
      callback: () => {
        const janus = new Janus({
          server: "wss://test.worldsamma.org/ws/",
          success: () => {
            const janusRoomId = 1234;
            setConnected(true);
            janus.attach({
              plugin: "janus.plugin.videoroom", // Use VideoRoom plugin for live streaming
              success: (pluginHandle) => {
                createStream(pluginHandle, janusRoomId); // Create a VideoRoom (broadcasting room)
              },
              error: (err) => {
                console.error("Error attaching plugin:", err);
              },
            });
          },
          error: (err) => {
            console.error("Error initializing Janus Gateway:", err);
          },
        });
      },
    });
  };
  const createStream = (plugin, janusRoomId) => {
    // First, check if the room already exists. If it does, just skip creation.
    plugin.send({
      message: {
        request: "join", // Try to join the room if it exists.
        room: janusRoomId, // Room ID
        ptype: "publisher", // Join as publisher
      },
      success: () => {
        console.log("Joined the existing room successfully.");
        attachLocalStream(plugin, janusRoomId); // Proceed with stream attachment if joining is successful
      },
      error: (err) => {
        if (err && err.indexOf("already exists") === -1) {
          // Only attempt to create the room if it doesn't exist
          plugin.send({
            message: {
              request: "create", // Create the room if it doesn't exist
              room: janusRoomId, // Room ID
              description: "My Live Stream", // Stream description
              ptype: "publisher", // Publisher type
              audio: true,
              video: true,
            },
            success: () => {
              console.log("Stream room created successfully.");
              attachLocalStream(plugin, janusRoomId); // Proceed to attach the local stream
            },
            error: (err) => {
              console.error("Error creating stream room:", err);
            },
          });
        } else {
          console.error("Error joining or creating the room:", err);
        }
      },
    });
  };

  const attachLocalStream = async (plugin, janusRoomId) => {
    try {
      // Get local media stream (video + audio)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: true,
      });

      // Display local video in the browser
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      // Create WebRTC offer for the stream
      plugin.createOffer({
        media: { video: true, audio: true },
        stream,
        success: (jsep) => {
          // Send the offer to the VideoRoom to publish the stream
          plugin.send({
            message: {
              request: "publish", // Publish the stream to the room
              room: janusRoomId, // The room to publish to
            },
            jsep,
          });
          console.log("Publishing stream to room:", janusRoomId);
        },
        error: (err) => {
          console.error("Error creating WebRTC offer:", err);
        },
      });
    } catch (err) {
      console.error("Error accessing user media:", err);
    }
  };

  const stopStreaming = () => {
    setConnected(false);
    setStreaming(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const cleanUp = () => {
    if (janusRef.current) {
      janusRef.current.destroy();
      console.log("Janus destroyed successfully");
      setConnected(false);
      setStreaming(false);
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
          <StatusIndicator
            status={connected ? "Connected" : "Disconnected"}
            isConnected={connected}
          />
          <StatusIndicator
            status={streaming ? "Live" : "Idle"}
            isConnected={streaming}
          />
        </Flex>

        <Flex justifyContent="center" gap={2}>
          <Button
            leftIcon={<FaPlay />}
            isDisabled
            colorScheme="green"
            size="lg"
            fontSize={"sm"}
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

export default JanusRtmpStreamer;
