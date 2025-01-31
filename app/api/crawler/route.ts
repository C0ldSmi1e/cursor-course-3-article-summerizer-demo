export const runtime = "nodejs";

import { NextResponse } from "next/server";
import FirecrawlApp from "firecrawl";
import Together from "together-ai";

// Initialize Firecrawl with your API key
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
});

// Initialize Together AI
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY || "",
});

const cleaningPrompt = `You are a content cleaner. Your task is to extract and clean the main content from the provided markdown text while preserving its markdown formatting. Follow these rules:

1. Remove any navigation elements, headers, footers, sidebars, and advertisements
2. Remove any "Updated on", "Last modified", timestamps, or similar metadata
3. Remove any "Did this help you?" sections or feedback forms
4. Keep all the main content intact with its original markdown formatting
5. Preserve any important headings, lists, and code blocks from the main content
6. Remove any navigation links or menus
7. Keep any relevant images or diagrams that are part of the main content
8. Output only the cleaned markdown content, nothing else

Here's the markdown content to clean:

`;

const summarizationPrompt = `You are a professional summarizer. Your task is to create a concise summary (maximum 200 words) of the provided markdown content. Follow these rules:

1. Extract only the key points, main findings, and core concepts
2. Format the output in markdown, using appropriate headings and bullet points
3. Be direct and concise - no fluff or unnecessary details
4. Preserve any critical technical details or data points
5. Structure the summary with:
   - A brief overview (1-2 sentences)
   - Key points in bullet points
   - Any critical conclusions
6. Keep the markdown formatting minimal but effective
7. Do not include any introductory phrases like "This article discusses" or "In this text"

Here's the content to summarize:

`;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Use Firecrawl to scrape the URL and get markdown content
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!result.success || !result.markdown) {
      return NextResponse.json(
        { error: result.error || "Failed to scrape URL" },
        { status: 500 }
      );
    }

    // Clean the content using Together AI
    const cleanedContent = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: cleaningPrompt,
        },
        {
          role: "user",
          content: result.markdown,
        },
      ],
      temperature: 0.1, // Low temperature for more consistent output
      max_tokens: 4000,
    });

    const cleanedText = cleanedContent.choices?.[0]?.message?.content;
    if (!cleanedText) {
      return NextResponse.json(
        { error: "Failed to clean content" },
        { status: 500 }
      );
    }

    // Generate summary
    const summaryContent = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: summarizationPrompt,
        },
        {
          role: "user",
          content: cleanedText,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const summary = summaryContent.choices?.[0]?.message?.content;
    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    console.log(summary);

    // Return both cleaned content and summary
    return NextResponse.json({
      content: cleanedText,
      summary: summary,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process URL" },
      { status: 500 }
    );
  }
} 