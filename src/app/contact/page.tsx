"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar"; // Importing Navbar component
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to send the message using EmailJS
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface EmailJSResponse {
  status: number;
  text: string;
}

const sendMessage = async (data: FormData): Promise<EmailJSResponse> => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY!
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default function ContactUs() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnSubmitData>();

  interface OnSubmitData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  const onSubmit = async (data: OnSubmitData): Promise<void> => {
    setIsSending(true);
    try {
      const result = await sendMessage(data);
      if (result.status === 200) {
        setIsSuccess(true);
        setGlobalMessage("Message sent successfully!");
        setGlobalSuccess("true");
      }
    } catch (error) {
      setGlobalSuccess("false");
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="w-full bg-black py-8">
          <div className="ml-8">
            <h2 className="text-white text-sm mb-1">Reach Out to Us</h2>
            <h1 className="font-bold text-3xl md:text-4xl text-white">
              Contact Us
            </h1>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="min-h-[85vh] w-full flex items-start justify-center px-4 mt-4 mb-0">
          {/* Card Section */}
          <div
            className="relative w-full max-w-[1100px] mx-auto rounded-md md:rounded-lg p-6 shadow-md bg-gray-300"
            style={{
              width: "90%",
              maxWidth: "1100px",
            }}
          >
            {!isSuccess ? (
              <>
                {globalMessage && (
                  <p
                    className={`text-${
                      globalSuccess === "true" ? "green" : "red"
                    }-500`}
                  >
                    {globalMessage}
                  </p>
                )}
                <h1 className="font-bold text-lg md:text-xl text-black text-left">
                  Send us a message
                </h1>

                {/* Form */}
                <form className="my-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-black font-medium mb-1">
                      Your Name
                    </label>
                    <input
                      id="name"
                      placeholder="Enter your name"
                      {...register("name", { required: true })}
                      className="w-full p-2 rounded-md bg-gray-200 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-black font-medium mb-1">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full p-2 rounded-md bg-gray-200 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email?.message ? String(errors.email.message) : ""}
                    </p>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-black font-medium mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      placeholder="Enter the subject"
                      {...register("subject", { required: true })}
                      className="w-full p-2 rounded-md bg-gray-200 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-black font-medium mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Write your message here..."
                      {...register("message", { required: true })}
                      className="w-full p-2 rounded-md bg-gray-200 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full py-2 px-4 ${
                      isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#000] hover:bg-[#333]'
                    } text-white rounded-md font-medium transition-all duration-[300ms]`}
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            ) : (
              // Success Message After Submission
              <h1 className="font-bold text-xl md:text-xl text-green-500 text-center">
                Thank you for reaching out!
              </h1>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}