"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function SummonReasons() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reasonsStr, setReasonsStr] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [extraText, setExtraText] = useState<string>("");
  const [numOfPages, setNumOfPages] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [showNoticeReplyPage, setShowNoticeReplyPage] = useState<boolean>(false);

  const userID = session ? session.user?.id : "";
  const userId = session ? session.user?.id : "";

  useEffect(() => {
    const initializeData = async () => {
      if (session) {
        const userID = session.user?.id;
        if (userID) {
          const response = await fetch('/api/getReasons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: String(userID) }),
          });
          const result = await response.json();
          setReasonsStr(result);
        }
      }
    };
    initializeData();
  }, [session]);

  const reasons = reasonsStr ? reasonsStr.split('.,') : [];

  // Updated handleOptionSelect function
  const handleOptionSelect = (reason: string) => {
    if (selectedReason === reason) {
      setSelectedReason(""); // Unselect the reason
    } else {
      setSelectedReason(reason); // Select the clicked reason
    }
  };

  const handleNumOfPagesChange = (value: string) => {
    const numericValue = parseInt(value, 10);
    setNumOfPages(!isNaN(numericValue) ? Math.max(2, numericValue) : 2);
  };

  const handleSubmit = async () => {
    if (selectedReason === "" && extraText.trim() === "") {
      alert("Please select a reason or provide additional information");
      return;
    }

    setLoading(true);
    const combinedData = { userId, selectedReason, extraText };
    const finalCombinedData = selectedReason + ".," + "Additional Instructions: " + extraText;

    await fetch("/api/save-selected-reasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: String(userID),
        reasons: String(finalCombinedData),
      }),
    });



    try {
      const savePagesNum = await axios.post("http://sastelaptop.com:3010/api/fetchNumPages", {
        userId: userID,
        numOfPages: numOfPages,
      })


      const response = await axios.post(
        "http://sastelaptop.com:3010/api/getSummonNoticeReply",
        combinedData,
        { headers: { "Content-Type": "application/json" } }
      );

      if(response.status === 200) {
        router.push('/notice-response');
      } else {
        alert('Failed to save notice reply. Please try again');
      }

      // const noticeData = response.data;

      // const addResponse = await fetch("/api/saveNotice", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userID: String(userID),
      //     notice: String(noticeData)
      //   }),
      // });

      // if (addResponse.ok) {
      //   await addResponse.json();
      //   router.push('/notice-response');
      // } else {
      //   alert('Failed to save notice reply. Please try again.');
      // }

      // setShowNoticeReplyPage(true);
    } catch (error) {
      console.error("Error fetching notice reply:", error);
      setError("Failed to load notice reply data. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-4xl mx-auto p-5 font-sans">
          {reasons.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-5 flex-wrap mt-24">
                {/* <div className="w-32">
                  <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-full" />
                </div> */}
                <h3 className="text-xl font-bold text-center">
                  Please Select the Most Suitable Reason for Reply Generation
                </h3>
              </div>
              <div className="flex flex-wrap gap-5 mb-5">
                {reasons.map((reason, index) => (
                  <div
                    key={index}
                    className={`flex-1 min-w-[30%] p-5 rounded-lg border ${
                      selectedReason === reason ? "bg-gray-300" : "bg-gray-100"
                    } cursor-pointer hover:shadow-lg`}
                    onClick={() => handleOptionSelect(reason)}
                  >
                    <p>{reason}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-5">
                <label className="font-bold">Enter No. of Pages:</label>
                <input
                  type="number"
                  value={numOfPages}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleNumOfPagesChange(e.target.value)}
                  className="border rounded-md p-2 w-20"
                  min="2"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Any Additional Suggestions?
              </h3>
              <textarea
                value={extraText}
                onChange={(e) => setExtraText(e.target.value)}
                placeholder="Write your suggestions here..."
                rows={5}
                className="w-full p-3 border rounded-lg mb-5 resize-none"
              />
              <button
                className="cursor-pointer px-5 py-3 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms]"
                onClick={handleSubmit}
              >
                Continue
              </button>
            </>
          ) : (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-700 border-solid"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const LoadingSpinner: React.FC = () => {
  const words = [
    'Just a moment, we are generating the best reply!',
    'Loading... great things take time!',
    'Hang tight, almost there!',
    'Preparing something awesome for you!',
    'Your next experience is just a moment away!',
    'Almost there, innovation in the works!',
    'Loading magic… please stand by!',
    'Just a moment, we are preparing something special!',
    'Do not blink, awesomeness is coming!'
  ];
  
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const interval = setInterval(() => {
      setText((prevText) => prevText + currentWord[charIndex]);
      setCharIndex((prevIndex) => prevIndex + 1);
    }, 100);

    if (charIndex === currentWord.length) {
      clearInterval(interval);
      
      setTimeout(() => {
        setText('');
        setCharIndex(0);
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 1000);
    }

    return () => clearInterval(interval);
    
  }, [charIndex, wordIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {text}
      </h2>
      <Image src='/loading.gif' alt="Loading..." width={100} height={100} />
    </div>
  );
};