import React, { useEffect, useRef, useState } from "react";
import "video.js/dist/video-js.css";
import { Box, Heading, Text, Spinner, Stack, Image } from "@chakra-ui/react";
import UpperNav from "../miscellenious/upperNav";
import Janus from "janus-gateway";

const LiveStream = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const janusRef = useRef(null);
  const streamingPluginRef = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Fetch YouTube Playlist
  const fetchPlaylistVideos = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLvaKkVKQu-3-hB4GzyHa69c5LQ1GyJ5S3&maxResults=5&key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch playlist videos");
      const data = await response.json();
      setVideos(data.items || []);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    }
  };

  const initializeJanusForViewing = () => {
    Janus.init({
      debug: "all",
      callback: () => {
        janusRef.current = new Janus({
          server: "wss://test.worldsamma.org/ws/",
          success: () => {
            janusRef.current.attach({
              plugin: "janus.plugin.streaming",
              success: (pluginHandle) => {
                streamingPluginRef.current = pluginHandle;
                watchStream(pluginHandle, 1234); // Use the same room ID created earlier.
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

  const watchStream = (plugin, janusRoomId) => {
    const body = { request: "watch", id: janusRoomId };
    plugin.send({
      message: body,
      success: () => {
        console.log("Watching stream from room:", janusRoomId);
        plugin.createAnswer({
          media: { audioSend: false, videoSend: false }, // Receive only
          success: (jsep) => {
            plugin.send({ message: { request: "start" }, jsep });
          },
          error: (err) => {
            console.error("Error creating WebRTC answer:", err);
          },
        });
      },
      error: (err) => {
        console.error("Error watching stream:", err);
      },
    });

    plugin.on("remoteStream", (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsLive(true);
        console.log("Remote stream started.");
      }
    });
  };

  // Initialize Video.js Player
  useEffect(() => {
    initializeJanusForViewing();
    return () => {
      if (janusRef.current) janusRef.current.destroy();
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Fetch Playlist Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPlaylistVideos();
      setLoading(false);
    };
    fetchData();
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
      <Box>
        <Heading as="h1" mb={4}>
          Live Stream
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : isLive ? (
          <Box data-vjs-player mb={6}>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              autoPlay
              controls
              aria-label="Live Stream Player"
            />
          </Box>
        ) : (
          <Text>No Live Stream Available</Text>
        )}

        <Box>
          <Heading as="h2" mb={4}>
            Playlist
          </Heading>
          {videos.length === 0 ? (
            <Text>No Videos Available</Text>
          ) : (
            <Stack spacing={4}>
              {videos.map((video) => (
                <Box
                  key={video.snippet.resourceId.videoId}
                  p={4}
                  border="1px solid #ccc"
                  borderRadius="md"
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                  gap={4}
                  _hover={{ bg: "gray.100" }}
                >
                  <Box width={{ base: "100%", md: "60%" }}>
                    {activeVideoId === video.snippet.resourceId.videoId ? (
                      <Box
                        as="iframe"
                        width="100%"
                        height="180px"
                        src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}?autoplay=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <Image
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        borderRadius="md"
                        onClick={() =>
                          setActiveVideoId(
                            activeVideoId === video.snippet.resourceId.videoId
                              ? null
                              : video.snippet.resourceId.videoId
                          )
                        }
                      />
                    )}
                  </Box>
                  <Box width={{ base: "100%", md: "40%" }}>
                    <Text fontWeight="bold">{video.snippet.title}</Text>
                    <Text fontSize="sm" noOfLines={2}>
                      {video.snippet.description}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LiveStream;
