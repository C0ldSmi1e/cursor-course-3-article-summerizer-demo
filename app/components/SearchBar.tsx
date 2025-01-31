"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface SearchBarProps {
  onSubmit: (url: string) => Promise<void>;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(url);
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to crawl"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 