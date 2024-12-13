import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  useToast,
  Button,
} from "@chakra-ui/react";
import UpperNav from "../miscellenious/upperNav";
import { useNavigate } from "react-router-dom";
import { getLiveKitTokenFromBackend } from "../components/config/chatlogics";
import { Track } from "livekit-client";
import { useTracks, VideoTrack, LiveKitRoom } from "@livekit/components-react";

const MyComponent = () => {
  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  // Fetch YouTube Playlist

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
    >
      {cameraTracks.map((trackReference, index) => (
        <VideoTrack key={index} {...trackReference} />
      ))}
    </Box>
  );
};

const LiveStream = ({ user }) => {
  const LIVEKIT_URL = "wss://test.worldsamma.org"; // Replace with your LiveKit server URL
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

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

  // Cleanup LiveKit connection
  useEffect(() => {
    fetchPlaylistVideos();
  }, []);

  // Initialize LiveKit
  const initializeLiveKit = async () => {
    try {
      const liveKitToken = await getLiveKitTokenFromBackend(
        "test-room",
        user?._id,
        "subscriber",
        toast,
        navigate
      );
      if (!liveKitToken) throw new Error("Failed to generate LiveKit token");
      setToken(liveKitToken);
    } catch (error) {
      console.error("Error connecting to LiveKit:", error);
      setError(true);
    }
  };

  // Cleanup LiveKit connection
  useEffect(() => {
    initializeLiveKit();
  }, []);

  // Render logic
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      width="100%"
      fontFamily="Arial, sans-serif"
      color="gray.800"
    >
      <UpperNav />

      <Box width={"100%"} mb={"4"}>
        <Heading as="h1" mb={4}>
          Live Stream
        </Heading>
      </Box>

      {error ? (
        <Box mb={"4"}>
          <Text>Failed to initialize live stream. Please try again later.</Text>
          <Button onClick={initializeLiveKit} colorScheme="teal">
            Retry
          </Button>
        </Box>
      ) : token ? (
        <LiveKitRoom url={LIVEKIT_URL} token={token}>
          <MyComponent />
        </LiveKitRoom>
      ) : (
        <Text>Initializing live stream...</Text>
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
  );
};

export default LiveStream;
