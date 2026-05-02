"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { scrapeAgent } from "@/lib/api";

export default function WebScraperAgentPage() {
  const [mounted, setMounted] = useState(false)
  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [siteURL, setSiteURL] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
        setMounted(true)
    }, [])

    // THEN the conditional return
  if (!mounted) return null

  async function handleSend() {
    setLoading(true);
    const result = await scrapeAgent(tavilyApiKey, groqApiKey, siteURL);
    setOutput(result);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-20 lg:py-30 gap-6 md:gap-10">
      <h1 className="text-2xl md:text-3xl text-center">Web Scraper Agent</h1>
      <p className="text-sm md:text-base text-center max-w-xl text-muted-foreground">
        Scrape any webpage and extract structured information using natural
        language queries.
      </p>
      {/*----------------------------------------------- ABOUT CARD ---------------------------------------------*/}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>What is this?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm md:text-base">
          This agent takes a URL and a query, scrapes the webpage content, and
          uses an LLM to extract exactly the information you&apos;re looking for.
          Powered by Tavily and Groq.
        </CardContent>
      </Card>
      {/*--------------------------------------------- RESIZABLE INFORMATION (desktop) --------------------------------------------*/}
      <div className="w-full max-w-2xl hidden md:block">
        <ResizablePanelGroup
          orientation="horizontal"
          className="rounded-none border-1"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex flex-col h-[300px] p-6 gap-4">
              <span className="font-semibold text-lg text-amber-600">
                Getting API Keys
              </span>
              <ol className="flex flex-col gap-3 text-sm text-muted-foreground list-none">
                <li>
                  1. Tavily: Sign up at{" "}
                  <a
                    href="https://tavily.com"
                    target="_blank"
                    className="underline text-foreground"
                  >
                    tavily.com
                  </a>{" "}
                  → Dashboard → API Keys → Create new key
                </li>
                <li>
                  2. Groq: Sign up at{" "}
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    className="underline text-foreground"
                  >
                    console.groq.com
                  </a>{" "}
                  → API Keys → Create key
                </li>
              </ol>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex flex-col h-[300px] p-6 gap-4">
              <span className="font-semibold text-lg text-amber-600">
                Usage Tips
              </span>
              <ol className="flex flex-col gap-3 text-sm text-muted-foreground list-none">
                <li>
                  1. Be specific in your query : &quot;Extract all product prices&quot;
                  works better than &quot;get prices&quot;.
                </li>
                <li>
                  2. Works best on article pages, docs, and e-commerce sites.
                </li>
                <li>
                  3. Avoid querying login-protected or JavaScript-heavy pages
                </li>
              </ol>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/*--------------------------------------------- STACKED INFO CARDS (mobile) --------------------------------------------*/}
      <div className="w-full max-w-2xl flex flex-col gap-4 md:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-600">Getting API Keys</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Tavily: Sign up at <a href="https://tavily.com" target="_blank" className="underline text-foreground">tavily.com</a> → Dashboard → API Keys</p>
            <p>2. Groq: Sign up at <a href="https://console.groq.com" target="_blank" className="underline text-foreground">console.groq.com</a> → API Keys</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-600">Usage Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Be specific: &quot;Extract all product prices&quot; works better than &quot;get prices&quot;.</p>
            <p>2. Works best on article pages, docs, and e-commerce sites.</p>
            <p>3. Avoid login-protected or JavaScript-heavy pages.</p>
          </CardContent>
        </Card>
      </div>
      {/*--------------------------------------------- API KEY INPUT --------------------------------------------*/}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-amber-600">API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="input-tavily-api-key">
              Tavily API Key
            </FieldLabel>
            <Input
              id="input-tavily-api-key"
              type="password"
              placeholder="tvly-..."
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
            />
            <FieldLabel htmlFor="input-groq-api-key">Groq API Key</FieldLabel>
            <Input
              id="input-groq-api-key"
              type="password"
              placeholder="gsk-..."
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
            />
            <FieldDescription>
              Your API keys are encrypted and stored securely.
            </FieldDescription>
            <Button
              variant={"outline"}
              onClick={() => {
                console.log("tavilyApiKey", tavilyApiKey);
                console.log("groqApiKey", groqApiKey);
              }}
            >
              Console Log Keys
            </Button>
          </Field>
        </CardContent>
      </Card>
      {/*-------------------------------------------- INPUT QUERY FIELD -----------------------------------------*/}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-amber-600">Enter URL/s</CardTitle>
        </CardHeader>
        <CardContent>
          <Field orientation="vertical">
            <Input
              type="text"
              placeholder="Enter URL"
              value={siteURL}
              onChange={(e) => setSiteURL(e.target.value)}
            />
            <Button onClick={handleSend} disabled={loading} variant={"outline"}>
              {loading ? "Scraping..." : "Send"}
            </Button>
          </Field>

          {output && (
            <div className="mt-4 p-3 md:p-4 rounded border text-xs md:text-sm whitespace-pre-wrap break-words">
              {output}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
