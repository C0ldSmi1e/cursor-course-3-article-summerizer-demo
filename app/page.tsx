"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import Result from "./components/Result";

const Home = () => {
  const [result, setResult] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const handleSubmit = async (url: string) => {
    try {
      const response = await fetch("/api/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data.content);
      setSummary(data.summary);
      setNotes("");
      setCurrentUrl(url);
      setShowSearch(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch content");
    }
  };

  const handleReturn = () => {
    setShowSearch(true);
    setResult("");
    setSummary("");
    setNotes("");
    setCurrentUrl("");
  };

  const handleSaveSummary = (newSummary: string) => {
    setSummary(newSummary);
  };

  const handleSaveNotes = (newNotes: string) => {
    setNotes(newNotes);
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl min-h-screen py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Web Content Crawler
        </h1>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      
      <div className="w-full space-y-4">
        <SignedIn>
          {showSearch ? (
            <SearchBar onSubmit={handleSubmit} />
          ) : (
            <Result 
              content={result} 
              summary={summary} 
              notes={notes}
              url={currentUrl}
              onReturn={handleReturn}
              onSaveSummary={handleSaveSummary}
              onSaveNotes={handleSaveNotes}
            />
          )}
        </SignedIn>
        <SignedOut>
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Web Content Crawler</h2>
            <p className="text-muted-foreground mb-8">
              Sign in to start analyzing and summarizing web content.
            </p>
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </main>
  );
};

export default Home;
