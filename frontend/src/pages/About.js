import React, { useState } from "react";
import { Box, Text, Center, Image } from "@chakra-ui/react";
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
    <Center
      display={"flex"}
      flexDir={"column"}
      w="100%"
      background={"whitesmoke"}
      overflow={"auto"}
    >
      {show && <CoffeeModal isOpen={true} onClose={handleCloseModal} />}
      <Box
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
          backgroundColor: "#f4f4f4",
          color: "#333",
          margin: 0,
          padding: 4,
        }}
      >
        <div id="root">
          <header
            style={{
              backgroundColor: "#003366",
              color: "white",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <h1 style={{ fontSize: "2.5em" }}>
              Welcome to the World Samma Federation
            </h1>
            <p style={{ fontSize: "1.2em", marginTop: "10px" }}>
              Your global community for martial arts and other sports
              enthusiasts. Join us to connect, learn, and grow in your martial
              arts journey.
            </p>
          </header>
          <main style={{ padding: "20px" }}>
            <section>
              <a href="/">Back</a>
            </section>
            <section
              id="about"
              style={{ marginBottom: "30px", textAlign: "start" }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                About Us
              </h2>
              <p>
                The World Samma Federation is dedicated to promoting the art of
                Samma and supporting martial artists worldwide. Our community
                provides resources, training, and events for all skill levels.
              </p>
            </section>
            <section
              id="features"
              style={{ marginBottom: "30px", textAlign: "start" }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Features
              </h2>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>Comprehensive training programs</li>
                <li>Global competitions and events</li>
                <li>Exclusive member resources</li>
                <li>Community forums and support</li>
              </ul>
            </section>
            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Introduction
              </h2>
              <p className=" leading-relaxed">
                Samma is a modern martial art that blends striking, grappling,
                and self-defense techniques into a structured system. Developed
                for both competition and practical application, Samma emphasizes
                efficiency, adaptability, and mental discipline. Unlike
                traditional martial arts that focus on rigid techniques, Samma
                evolves with combat trends, integrating elements from various
                fighting styles to create a comprehensive martial art.
              </p>
            </section>

            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                History of Samma
              </h2>
              <p className="leading-relaxed">
                Samma originated as a hybrid fighting system designed to address
                the limitations of singular martial arts styles. Drawing
                influence from striking arts like <strong>Muay Thai</strong> and{" "}
                <strong>Karate</strong>, grappling arts like{" "}
                <strong>Judo</strong>
                and <strong>Brazilian Jiu-Jitsu</strong>, and self-defense
                techniques from <strong>Krav Maga</strong>, Samma was formulated
                to be practical, adaptable, and effective for both sport and
                real-world scenarios.
              </p>
              <p className="leading-relaxed mt-4">
                The system was formalized under the World Samma Federation
                (WSF), which established structured training programs, ranking
                criteria, and competitive formats. Today, Samma continues to
                evolve as practitioners refine techniques and test them in live
                competition.
              </p>
            </section>

            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Techniques & Fighting Styles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    1. Striking Techniques
                  </h3>
                  <ul className="list-disc list-inside ">
                    <li>Punches – Jab, Cross, Hook, Uppercut</li>
                    <li>Elbow Strikes – Horizontal, Downward, Spinning</li>
                    <li>Kicks – Front Kick, Roundhouse, Side Kick, Axe Kick</li>
                    <li>Knee Strikes – Clinch Knees, Jumping Knees</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    2. Grappling & Throws
                  </h3>
                  <ul className="list-disc list-inside ">
                    <li>Takedowns – Single-leg, Double-leg, Hip Toss</li>
                    <li>Sweeps – Leg Sweep, Foot Trap</li>
                    <li>Joint Locks – Armbar, Kimura, Guillotine Choke</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Ranking System & Belt Colors
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Belt
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm">White Belt</td>
                      <td className="px-6 py-4 text-sm">
                        Beginner (Basic Techniques, Stance, and Footwork)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Yellow Belt</td>
                      <td className="px-6 py-4 text-sm">
                        Intermediate (Introduction to Grappling and Counters)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Green Belt</td>
                      <td className="px-6 py-4 text-sm">
                        Advanced (Combination Techniques, Sparring)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm ">Blue Belt</td>
                      <td className="px-6 py-4 text-sm ">
                        Proficient (Advanced Grappling, Competitive Strategies)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm ">Red Belt</td>
                      <td className="px-6 py-4 text-sm ">
                        Expert (Coaching and Advanced Combat Tactics)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm ">Black Belt</td>
                      <td className="px-6 py-4 text-sm ">
                        Mastery Level (Full Combat Application and Instruction)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Philosophy & Principles
              </h2>
              <ul className="list-disc list-inside ">
                <li>
                  Efficiency – Every movement should serve a purpose and
                  maximize effectiveness.
                </li>
                <li>
                  Adaptability – A fighter should be able to transition between
                  striking, grappling, and defense fluidly.
                </li>
                <li>
                  Mental Discipline – Training the mind is just as important as
                  training the body.
                </li>
                <li>
                  Respect & Honor – Practitioners must uphold the martial art’s
                  integrity inside and outside of combat.
                </li>
                <li>
                  Self-Improvement – Samma is not just about fighting; it’s
                  about continuous growth in all aspects of life.
                </li>
              </ul>
            </section>

            <section className="mb-12 text-start">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                Samma vs. Other Martial Arts
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Martial Art
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Strengths
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Weaknesses
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Karate</td>
                      <td className="px-6 py-4 text-sm">
                        Strong striking, disciplined training
                      </td>
                      <td className="px-6 py-4 text-sm">Limited grappling</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Judo</td>
                      <td className="px-6 py-4 text-sm">
                        Excellent throws, control techniques
                      </td>
                      <td className="px-6 py-4 text-sm ">Limited striking</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm  font-medium">
                        Muay Thai
                      </td>
                      <td className="px-6 py-4 text-sm ">
                        Devastating clinch, powerful kicks
                      </td>
                      <td className="px-6 py-4 text-sm ">Weak ground game</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm  font-medium">BJJ</td>
                      <td className="px-6 py-4 text-sm ">
                        High-level ground submissions
                      </td>
                      <td className="px-6 py-4 text-sm ">No striking</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm  font-medium">Samma</td>
                      <td className="px-6 py-4 text-sm ">
                        Well-rounded, adaptable, combines striking and grappling
                      </td>
                      <td className="px-6 py-4 text-sm ">
                        Still developing global recognition
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className=" leading-relaxed mt-6">
                Samma offers a balanced approach, making it highly effective in
                modern combat sports and self-defense situations.
              </p>
            </section>

            <section style={{ marginBottom: "30px", textAlign: "start" }}>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Conclusion
              </h2>
              <p className="leading-relaxed">
                Samma is an evolving martial art that integrates the best
                elements from multiple disciplines into a unified system.
                Whether practiced for self-defense, competition, or personal
                development, Samma offers a well-rounded approach to martial
                arts that continues to grow in popularity worldwide.
              </p>
            </section>
            <section style={{ marginBottom: "30px", textAlign: "start" }}>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Archives
              </h2>
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

              {/* Book Embed Section */}
              <div className="mt-6 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Read the Samma Martial Art Book
                </h3>

                {/* Responsive Book Embed */}
                <div className="relative w-full" style={{ paddingTop: "75%" }}>
                  <iframe
                    src="https://archive.org/embed/sammaV5"
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>

                <a
                  href="https://res.cloudinary.com/dsdlgmgwi/image/upload/v1740820684/sammaV6.pdf"
                  download
                  style={{
                    textDecoration: "none",
                    color: "blue",
                  }} // Adjust color as needed
                >
                  Download Our Curriculum (PDF)
                </a>
              </div>

              <Text fontSize={"md"} textAlign={"center"} my={"3"}>
                ℹ️ Help us translate the curriculum booklet into other world
                languages by sending an editable draft to the Email:
                support@worldsamma.org. Include your name, country, and province
                for a credit/mention. Thanking you in advance.
              </Text>
            </section>
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
          </main>
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
        </div>
      </Box>
    </Center>
  );
};

export default AboutPage;
