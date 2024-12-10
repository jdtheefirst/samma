import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Stack,
  Image,
  useToast,
} from "@chakra-ui/react";
import UpperNav from "../miscellenious/upperNav";
import {
  Room,
  RemoteTrackPublication,
  RemoteParticipant,
  Track,
} from "livekit-client";
import { useNavigate } from "react-router-dom";

const LiveStream = () => {
  const videoRef = useRef(null);
  const roomRef = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [participantCount, setParticipantCount] = useState(0);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const LIVEKIT_URL = "ws://test.worldsamma.org:7880"; // Replace with your LiveKit server URL

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

  // Initialize LiveKit for viewing
  const initializeLiveKit = async () => {
    try {
      const token = await getLiveKitTokenFromBackend(
        "test-room",
        user._id,
        "subscriber",
        toast,
        navigate
      );

      if (!token) {
        throw new Error("Failed to generate token");
      }

      const room = new Room();
      await room.connect(LIVEKIT_URL, token);

      roomRef.current = room;

      // Track participant count
      const updateParticipantCount = () => {
        setParticipantCount(room.participants.size + 1); // +1 includes local participant
      };

      // Initialize participant count
      updateParticipantCount();

      // Listen for participant events
      room.on("participantConnected", updateParticipantCount);
      room.on("participantDisconnected", updateParticipantCount);

      // Subscribe to tracks
      room.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === Track.Kind.Video && videoRef.current) {
          track.attach(videoRef.current);
          setIsLive(true);
        }
      });

      room.on("trackUnsubscribed", (track, publication, participant) => {
        if (track.kind === Track.Kind.Video && videoRef.current) {
          track.detach(videoRef.current);
          setIsLive(false);
        }
      });
    } catch (error) {
      console.error("Error connecting to LiveKit:", error);
    }
  };

  // Cleanup LiveKit connection
  useEffect(() => {
    initializeLiveKit();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
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
              autoPlay
              controls
              aria-label="Live Stream Player"
            />
            <Text fontSize={"sm"}>{participantCount}</Text>
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
