import { useEffect, useState } from "react";
import { Box, Heading, Text, Stack, Image } from "@chakra-ui/react";
import UpperNav from "../miscellenious/upperNav";

const LiveStream = ({ user }) => {
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      width="100%"
      fontFamily="Arial, sans-serif"
      color="gray.800"
      minH={"100vh"}
      overflow={"auto"}
      p={"6"}
    >
      <UpperNav />

      <Box width={"100%"} textAlign={"center"} mb={"4"} mt={20}>
        <Heading as="h1" mb={4}>
          Live Streams
        </Heading>
      </Box>

      <Box textAlign={"center"}>
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
                alignItems={"center"}
                width="100%"
                fontFamily="Arial, sans-serif"
                gap={4}
                _hover={{ bg: "gray.100" }}
              >
                <Box>
                  {activeVideoId === video.snippet.resourceId.videoId ? (
                    <Box
                      as="iframe"
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
                <Box textAlign={{ base: "center", md: "start" }}>
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
