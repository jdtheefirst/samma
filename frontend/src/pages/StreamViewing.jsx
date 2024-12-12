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
import { ChatState } from "../components/Context/ChatProvider";
import { Room } from "livekit-client";
import VideoPlayer from "../components/video";

const LiveStream = () => {
  const roomRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = ChatState();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const LIVEKIT_URL = "wss://test.worldsamma.org"; // Replace with your LiveKit server URL
  const [token, setToken] = useState("");
  const VideoRef = useRef(null);

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
    }
  };

  const connectToRoom = async (token) => {
    try {
      const room = new Room();

      await room.connect(LIVEKIT_URL, token);
      roomRef.current = room;

      console.log("Connected!");

      room.on("trackSubscribed", (track, publication, participant) => {
        console.log("Track subscribed:", track);

        // Attach video track to the video element
        if (track instanceof VideoTrack && VideoRef.current) {
          // Attach the track to the video element
          const mediaStream = track.mediaStreamTrack
            ? new MediaStream([track.mediaStreamTrack])
            : track.mediaStream;

          VideoRef.current.srcObject = mediaStream;
          VideoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
          });
        }
      });

      room.on("participantConnected", (participant) => {
        console.log("Participant connected:", participant.identity);
      });

      room.on("participantDisconnected", (participant) => {
        console.log("Participant disconnected:", participant.identity);

        // Detach video track if needed
        if (VideoRef.current && VideoRef.current.srcObject) {
          VideoRef.current.srcObject = null;
        }
      });

      room.on("trackUnsubscribed", (track, publication, participant) => {
        console.log("Track unsubscribed:", track);

        // Detach video track if needed
        if (VideoRef.current && VideoRef.current.srcObject) {
          VideoRef.current.srcObject = null;
        }
      });
    } catch (error) {
      console.error("Error connecting to room:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to LiveKit Room.",
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (token) {
      connectToRoom(token);
    }
    return () => {
      // Detach video track if needed
      if (VideoRef.current && VideoRef.current.srcObject) {
        VideoRef.current.srcObject = null;
      }
    };
  }, [token]);

  // Cleanup LiveKit connection
  useEffect(() => {
    initializeLiveKit();
    fetchPlaylistVideos();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={"start"}
      width="100%"
      fontFamily="Arial, sans-serif"
      color="gray.800"
    >
      <UpperNav />
      <Box marginTop={20}>
        <Heading as="h1" mb={4}>
          Live Stream
        </Heading>

        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign="center"
          py={10}
        >
          {token ? (
            <VideoPlayer localVideoRef={VideoRef} />
          ) : (
            <Box>
              <Text fontSize={"sm"}>No live video is currently available.</Text>
              <Button
                mt={4}
                colorScheme="teal"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </Button>
            </Box>
          )}
        </Box>
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
