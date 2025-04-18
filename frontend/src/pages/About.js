import React, { useState } from "react";
import {
  Box,
  Text,
  Center,
  Image,
  Heading,
  Grid,
  UnorderedList,
  ListItem,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  Link,
  List,
} from "@chakra-ui/react";
import logo8 from "../assets/images/Mombasa.jpg";
import logo9 from "../assets/images/Nairobi.jpg";
import { CiLocationOn } from "react-icons/ci";
import CoffeeModal from "../miscellenious/coffee";

const AboutPage = () => {
  const [show, setShow] = useState(false);
  const handleCloseModal = () => {
    setShow(false);
  };
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      w="100%"
      background={"whitesmoke"}
      overflow={"auto"}
    >
      {show && <CoffeeModal isOpen={true} onClose={handleCloseModal} />}
      <Box
        fontFamily="Arial, sans-serif"
        lineHeight="1.6"
        backgroundColor="#f4f4f4"
        color="#333"
        margin="0"
        padding="2"
      >
        <Box id="root">
          <Box
            as="header"
            bg="#003366"
            color="white"
            textAlign="center"
            p="20px"
          >
            <Heading fontSize="2.5em">
              Welcome to the World Samma Federation
            </Heading>
            <Text fontSize="1.2em" mt="10px">
              Your global community for martial arts and other sports
              enthusiasts. Join us to connect, learn, and grow in your martial
              arts journey.
            </Text>
          </Box>

          <Box as="main" p="20px">
            <Box as="section">
              <Link href="/">Back</Link>
            </Box>

            <Box as="section" id="about" mb="30px" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                About Us
              </Heading>
              <Text>
                The World Samma Federation is dedicated to promoting the art of
                Samma and supporting martial artists worldwide. Our community
                provides resources, training, and events for all skill levels.
              </Text>
            </Box>

            <Box as="section" id="features" mb="30px" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                Features
              </Heading>
              <List styleType="disc" pl="20px">
                <ListItem>Comprehensive training programs</ListItem>
                <ListItem>Global competitions and events</ListItem>
                <ListItem>Exclusive member resources</ListItem>
                <ListItem>Community forums and support</ListItem>
              </List>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                Introduction
              </Heading>
              <Text leading="relaxed">
                Samma is a modern martial art that blends striking, grappling,
                and self-defense techniques into a structured system. Developed
                for both competition and practical application, Samma emphasizes
                efficiency, adaptability, and mental discipline. Unlike
                traditional martial arts that focus on rigid techniques, Samma
                evolves with combat trends, integrating elements from various
                fighting styles to create a comprehensive martial art.
              </Text>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                History of Samma
              </Heading>
              <Text leading="relaxed">
                Samma originated as a hybrid fighting system designed to address
                the limitations of singular martial arts styles. Drawing
                influence from striking arts like <strong>Muay Thai</strong> and{" "}
                <strong>Karate</strong>, grappling arts like{" "}
                <strong>Judo</strong> and <strong>Brazilian Jiu-Jitsu</strong>,
                and self-defense techniques from <strong>Krav Maga</strong>,
                Samma was formulated to be practical, adaptable, and effective
                for both sport and real-world scenarios.
              </Text>
              <Text leading="relaxed" mt="4">
                The system was formalized under the World Samma Federation
                (WSF), which established structured training programs, ranking
                criteria, and competitive formats. Today, Samma continues to
                evolve as practitioners refine techniques and test them in live
                competition.
              </Text>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                Techniques & Fighting Styles
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="8">
                <Box>
                  <Heading fontSize="xl" fontWeight="semibold" mb="2">
                    1. Striking Techniques
                  </Heading>
                  <UnorderedList pl="4">
                    <ListItem>Punches – Jab, Cross, Hook, Uppercut</ListItem>
                    <ListItem>
                      Elbow Strikes – Horizontal, Downward, Spinning
                    </ListItem>
                    <ListItem>
                      Kicks – Front Kick, Roundhouse, Side Kick, Axe Kick
                    </ListItem>
                    <ListItem>
                      Knee Strikes – Clinch Knees, Jumping Knees
                    </ListItem>
                  </UnorderedList>
                </Box>
                <Box>
                  <Heading fontSize="xl" fontWeight="semibold" mb="2">
                    2. Grappling & Throws
                  </Heading>
                  <UnorderedList pl="4">
                    <ListItem>
                      Takedowns – Single-leg, Double-leg, Hip Toss
                    </ListItem>
                    <ListItem>Sweeps – Leg Sweep, Foot Trap</ListItem>
                    <ListItem>
                      Joint Locks – Armbar, Kimura, Guillotine Choke
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Grid>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                Ranking System & Belt Colors
              </Heading>
              <Box overflowX="auto">
                <Table minW="full" borderRadius="lg">
                  <Thead>
                    <Tr>
                      <Th
                        px="6"
                        py="3"
                        textAlign="left"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Belt
                      </Th>
                      <Th
                        px="6"
                        py="3"
                        textAlign="left"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Level
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        White Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Beginner (Basic Techniques, Stance, and Footwork)
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        Yellow Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Intermediate (Introduction to Grappling and Counters)
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        Green Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Advanced (Combination Techniques, Sparring)
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        Blue Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Proficient (Advanced Grappling, Competitive Strategies)
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        Red Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Expert (Coaching and Advanced Combat Tactics)
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px="6" py="4" fontSize="sm">
                        Black Belt
                      </Td>
                      <Td px="6" py="4" fontSize="sm">
                        Mastery Level (Full Combat Application and Instruction)
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading fontSize="2xl" md="3xl" fontWeight="semibold" mb="4">
                Philosophy & Principles
              </Heading>
              <UnorderedList pl="4">
                <ListItem>
                  Efficiency – Every movement should serve a purpose and
                  maximize effectiveness.
                </ListItem>
                <ListItem>
                  Adaptability – A fighter should be able to transition between
                  striking, grappling, and defense fluidly.
                </ListItem>
                <ListItem>
                  Mental Discipline – Training the mind is just as important as
                  training the body.
                </ListItem>
                <ListItem>
                  Respect & Honor – Practitioners must uphold the martial art’s
                  integrity inside and outside of combat.
                </ListItem>
                <ListItem>
                  Self-Improvement – Samma is not just about fighting; it’s
                  about continuous growth in all aspects of life.
                </ListItem>
              </UnorderedList>
            </Box>

            <Box as="section" mb="12" textAlign="start">
              <Heading as="h2" size="xl" mb={6}>
                Samma vs. Other Martial Arts
              </Heading>
              <TableContainer overflowX="auto">
                <Table variant="simple" size="md" borderRadius="lg">
                  <Thead>
                    <Tr>
                      <Th textTransform="uppercase">Martial Art</Th>
                      <Th textTransform="uppercase">Strengths</Th>
                      <Th textTransform="uppercase">Weaknesses</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td fontWeight="medium">Karate</Td>
                      <Td>Strong striking, disciplined training</Td>
                      <Td>Limited grappling</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="medium">Judo</Td>
                      <Td>Excellent throws, control techniques</Td>
                      <Td>Limited striking</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="medium">Muay Thai</Td>
                      <Td>Devastating clinch, powerful kicks</Td>
                      <Td>Weak ground game</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="medium">BJJ</Td>
                      <Td>High-level ground submissions</Td>
                      <Td>No striking</Td>
                    </Tr>
                    <Tr bg="gray.100">
                      <Td fontWeight="bold">Samma</Td>
                      <Td>
                        Well-rounded, adaptable, combines striking and grappling
                      </Td>
                      <Td>Still developing global recognition</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Text mt={6} lineHeight="tall">
                Samma offers a balanced approach, making it highly effective in
                modern combat sports and self-defense situations.
              </Text>
            </Box>

            <Box mb={8} textAlign="start">
              <Heading as="h2" size="lg" mb={4}>
                Conclusion
              </Heading>
              <Text>
                Samma is an evolving martial art that integrates the best
                elements from multiple disciplines into a unified system.
                Whether practiced for self-defense, competition, or personal
                development, Samma offers a well-rounded approach to martial
                arts that continues to grow in popularity worldwide.
              </Text>
            </Box>

            <Box mb={8} textAlign="start">
              <Heading as="h2" size="lg" mb={4}>
                Archives
              </Heading>

              <Text fontFamily="Arial, sans-serif" mb={4}>
                <strong
                  style={{
                    fontWeight: "extrabold",
                    fontFamily: "fantacy",
                    textEmphasis: "GrayText",
                  }}
                >
                  15th March 2011 (in Mombasa City Centre):
                </strong>
                &nbsp; Formation of the Society of African Mixed Martial Arts
                and use of SAMMA as its acronym (acronym inspired by east
                African street slang word for a flip, "sama"). Then making of
                cheni 6 curriculum began with "designing" of the tamati (sign
                out) pattern.
              </Text>
              <Text fontFamily="Arial, sans-serif" mb={4}>
                <strong
                  style={{
                    fontWeight: "extrabold",
                    fontFamily: "fantacy",
                    textEmphasis: "GrayText",
                  }}
                >
                  1st August 2013 (in Mombasa North Coast):
                </strong>
                &nbsp; Transformation of SAMMA to a martial art after the
                completion of the main contents of cheni 6 curriculum. Immediate
                formation of the World Samma Federation (WSF) to unify and voice
                for wasamma (samma exponents) worldwide.
              </Text>
              <Text fontFamily="Arial, sans-serif" mb={4}>
                <strong
                  style={{
                    fontWeight: "extrabold",
                    fontFamily: "fantacy",
                    textEmphasis: "GrayText",
                  }}
                >
                  March 2021:
                </strong>
                &nbsp; Introduction of samma pigano (sparring) method at Kenya
                Coast, that is; THREE ranges of man to man combat (stick, elbow,
                punch, knee, kick and finally grappling).
              </Text>

              <Box mt={6} borderRadius="lg">
                <Heading as="h3" size="md" mb={3}>
                  Read the Samma Martial Art Book
                </Heading>

                {/* Responsive Book Embed */}
                <Box w="full" h={{ base: "50vh", md: "80vh" }}>
                  <iframe
                    src="https://archive.org/embed/sammaV5"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowfullscreen
                  ></iframe>
                </Box>

                <Link
                  href="https://res.cloudinary.com/dsdlgmgwi/image/upload/v1740820684/sammaV6.pdf"
                  download
                  color="blue.500"
                  mt={3}
                  display="block"
                >
                  Download Our Curriculum (PDF)
                </Link>
              </Box>
              <Text fontSize={"md"} textAlign={"center"} my={"3"}>
                ℹ️ Help us translate the curriculum booklet into other world
                languages by sending an editable draft to the Email:
                support@worldsamma.org. Include your name, country, and province
                for a credit/mention. Thanking you in advance.
              </Text>
            </Box>
            <Box
              display="flex"
              flexWrap={"wrap"}
              justifyContent={"space-evenly"}
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
            >
              <Box
                display={"flex"}
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={{ base: "20px", md: "0" }}
                onClick={() => setShow(true)}
                cursor="pointer"
                textAlign="center"
              >
                <Image
                  src={logo9}
                  boxSize={{ base: "300px", md: "400px" }}
                  borderRadius={2}
                  mx="auto"
                  mb="10px"
                  boxShadow="dark-lg"
                  p="6"
                  rounded="md"
                  bg="white"
                />
                <Box
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  textColor="goldenrod"
                >
                  <CiLocationOn style={{ color: "red", marginRight: "5px" }} />
                  Nairobi, Kenya
                </Box>
              </Box>

              <Box
                display={"flex"}
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={{ base: "20px", md: "0" }}
                onClick={() => setShow(true)}
                cursor="pointer"
              >
                <Image
                  src={logo8}
                  boxSize={{ base: "300px", md: "400px" }}
                  borderRadius={2}
                  mx="auto"
                  mb="10px"
                  boxShadow="dark-lg"
                  p="6"
                  rounded="md"
                  bg="white"
                />
                <Box
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  textColor="goldenrod"
                >
                  <CiLocationOn style={{ color: "red", marginRight: "5px" }} />
                  Mombasa, Kenya
                </Box>
              </Box>
              <Box
                display={"flex"}
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={{ base: "20px", md: "0" }}
                onClick={() => setShow(true)}
                cursor="pointer"
                textAlign="center"
              >
                <Image
                  src={
                    "https://res.cloudinary.com/dsdlgmgwi/image/upload/v1720940066/training_dmljwp.jpg"
                  }
                  boxSize={{ base: "300px", md: "400px" }}
                  borderRadius={2}
                  mx="auto"
                  mb="10px"
                  boxShadow="dark-lg"
                  p="6"
                  rounded="md"
                  bg="white"
                  loading="lazy"
                />
                <Box
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  textColor="goldenrod"
                >
                  <CiLocationOn style={{ color: "red", marginRight: "5px" }} />
                  Nairobi, Kenya
                </Box>
              </Box>
            </Box>
          </Box>
          <footer
            style={{
              backgroundColor: "#003366",
              color: "white",
              textAlign: "center",
              padding: "10px",
              width: "100%",
            }}
          >
            <Text>{`Copyright © World Samma Academy. 1999-${new Date().getFullYear()}`}</Text>{" "}
            All rights reserved. Terms and conditions apply. For queries and
            comments Email: support@worldsamma.org
          </footer>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
