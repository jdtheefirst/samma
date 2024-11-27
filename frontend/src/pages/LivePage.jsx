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

  // Local stream setup
  useEffect(() => {
    const setupLocalStream = async () => {
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
          alert("Please allow camera and microphone access to stream.");
          return; // Do not initialize Janus if permissions are not granted
        }

        console.log("Permissions granted for camera and microphone.");

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

  const startStreaming = () => {
    setStreaming(true);

    // Check that localStreamRef is available
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

    // Proceed with Janus initialization only when media is available
    initializeJanusForPublishing(stream);
  };

  const initializeJanusForPublishing = (stream) => {
    Janus.init({
      debug: "all",
      callback: () => {
        const janus = new Janus({
          server: "ws://test.worldsamma.org:8188",
          success: () => {
            const janusRoomId = 1234;
            setConnected(true);
            janus.attach({
              plugin: "janus.plugin.videoroom",
              success: (pluginHandle) => {
                createStream(pluginHandle, janusRoomId, stream);
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

  const createStream = (plugin, janusRoomId, stream) => {
    plugin.send({
      message: {
        request: "join",
        room: janusRoomId,
        ptype: "publisher",
      },
      success: () => {
        console.log("Joined the existing room successfully.");
        attachLocalStream(plugin, janusRoomId, stream);
      },
      error: (err) => {
        if (err && err.indexOf("already exists") === -1) {
          plugin.send({
            message: {
              request: "create",
              room: janusRoomId,
              description: "My Live Stream",
              ptype: "publisher",
              audio: true,
              video: true,
            },
            success: () => {
              console.log("Stream room created successfully.");
              attachLocalStream(plugin, janusRoomId, stream);
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

  const attachLocalStream = (plugin, janusRoomId, stream) => {
    plugin.createOffer({
      media: { video: true, audio: true },
      stream,
      success: (jsep) => {
        plugin.send({
          message: {
            request: "publish",
            room: janusRoomId,
          },
          jsep,
        });
        console.log("Publishing stream to room:", janusRoomId);
      },
      error: (err) => {
        console.error("Error creating WebRTC offer:", err);
      },
    });
  };

  const stopStreaming = () => {
    setConnected(false);
    setStreaming(false);
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
            onClick={startStreaming} // Start streaming on click
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
