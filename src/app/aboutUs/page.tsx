"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Sahiel Khurana",
    designation: "AI Engineer | Full Stack Developer",
    image: "/sahiel.jpg",
    linkedin: "https://www.linkedin.com/in/sahiel-profile",
  },
  {
    id: 2,
    name: "Ekansh Juneja",
    designation: "AI Engineer | Full Stack Developer",
    image: "/ekansh.jpg",
    linkedin: "https://www.linkedin.com/in/ekansh-juneja-46991b249",
  },
  {
    id: 3,
    name: "Naveen Sharma",
    designation: "AI Engineer | Full Stack Developer",
    image: "/naveen.jpg",
    linkedin: "https://www.linkedin.com/in/naveen-sharma-871b7a257",
  },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="w-full bg-black py-8">
          <div className="ml-8">
            <h2 className="text-white text-sm mb-1">Learn More About</h2>
            <h1 className="font-bold text-3xl md:text-4xl text-white">
              About Us
            </h1>
          </div>
        </div>

        {/* About Us Content */}
        <div className="min-h-[85vh] w-full flex items-start justify-center px-4 mt-4 mb-0">
          {/* Card Section */}
          <div
            className="relative w-full max-w-[1100px] mx-auto rounded-md md:rounded-lg p-6 shadow-md bg-gray-300"
            style={{
              width: "90%",
              maxWidth: "1100px",
            }}
          >
            <h1 className="font-bold text-lg md:text-xl text-black text-left">
              NOTICE-REPLY: Revolutionizing Legal Operations with AI
            </h1>
            <p className="text-black mt-2">
              We believe in simplifying the complexities of the legal world.
              Our mission is to empower individuals and businesses by merging
              cutting-edge technology with expert legal insights. Whether you are
              a seasoned legal professional or someone navigating legal
              challenges for the first time, our platform is an initiative to
              provide tools, resources, and support needed to tackle legal
              matters with ease and confidence.
            </p>
            <p className="text-black mt-2">
              NOTICE-REPLY is your all-in-one legal assistant, offering automated,
              AI-powered legal reply generation for notices and summons. Accessible, efficient, and intuitive,
              our platform transforms how you handle legal tasks.
            </p>

            {/* Subheading for Objectives */}
            <h2 className="font-bold text-lg md:text-xl text-black mt-4">
              Objectives
            </h2>

            {/* Objectives Bullet Points */}
            <ul className="list-disc list-inside text-black mt-2 space-y-1">
              <li>Bridge the gap between legal expertise and accessibility through advanced AI tools.</li>
              <li>Offer tailored legal replies to notices and contracts using LLM-powered templates.</li>
              <li>Empower users to make informed decisions and confidently navigate legal challenges.</li>
            </ul>

            {/* Developer Credits Section - Right-Aligned Below Objectives */}
            <div className="flex justify-end mt-6">
              <div
                className="flex items-center p-1 bg-gray-300 rounded-md"
                style={{ width: "120px", height: "40px" }} // Smaller box size
              >
                <AnimatedTooltip items={people} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}