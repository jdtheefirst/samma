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
  const [rtmpPlugin, setRtmpPlugin] = useState(null);
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
            setConnected(true);
            janus.attach({
              plugin: "janus.plugin.streaming",
              success: (pluginHandle) => {
                setRtmpPlugin(pluginHandle);
                createStream(pluginHandle);
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

  const createStream = (plugin) => {
    const janusRoomId = 1234; // Assign a unique ID for the stream room.
    plugin.send({
      message: {
        request: "create",
        type: "live",
        id: janusRoomId,
        description: "My Live Stream",
        audio: true,
        video: true,
      },
      success: () => {
        console.log("Stream room created with ID:", janusRoomId);
        attachLocalStream(plugin, janusRoomId);
      },
      error: (err) => {
        console.error("Error creating stream room:", err);
      },
    });
  };

  const attachLocalStream = async (plugin, janusRoomId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      plugin.createOffer({
        media: { video: true, audio: true },
        stream,
        success: (jsep) => {
          plugin.send({
            message: {
              request: "publish",
              id: janusRoomId,
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

  const startStreaming = () => {
    if (rtmpPlugin) {
      rtmpPlugin.send({
        message: { request: "publish" },
        success: () => {
          console.log("Streaming started successfully!");
          setStreaming(true);
        },
        error: (err) => {
          console.error("Error starting stream:", err);
        },
      });
    } else {
      console.error("RTMP plugin not attached.");
    }
  };

  const stopStreaming = () => {
    if (rtmpPlugin) {
      rtmpPlugin.hangup();
      setConnected(false);
      setStreaming(false);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const cleanUp = () => {
    if (janusRef.current) {
      janusRef.current.destroy();
      console.log("Janus destroyed successfully");
      setConnected(false);
      setStreaming(false);
    }
    if (rtmpPlugin) {
      rtmpPlugin.detach(); // Detach the plugin
      console.log("Detached from streaming plugin");
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
            onClick={startStreaming}
            isDisabled={streaming || !connected}
            colorScheme="green"
            size="lg"
            fontSize={"sm"}
          >
            Start Streaming
          </Button>

          <Button
            leftIcon={<FaStop />}
            onClick={stopStreaming}
            isDisabled={!streaming}
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
