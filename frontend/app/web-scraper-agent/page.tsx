import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Key, Lightbulb } from "lucide-react"

export default function WebScraperAgentPage() {
  return (
    <div className="flex flex-col items-center justify-center py-30 gap-10">
      <h1 className="text-3xl">Web Scraper Agent</h1>
      <p>
        Scrape any webpage and extract structured information using natural
        language queries.
      </p>
      {/*----------------------------------------------- ABOUT CARD ---------------------------------------------*/}
      <Card className="w-2xl">
        <CardHeader>
          <CardTitle>What is this?</CardTitle>
        </CardHeader>
        <CardContent>
          This agent takes a URL and a query, scrapes the webpage content, and
          uses an LLM to extract exactly the information you're looking for.
          Powered by Tavily and Groq.
        </CardContent>
      </Card>
      {/*--------------------------------------------- RESIZABLE INFORMATION --------------------------------------------*/}
      <ResizablePanelGroup
        orientation="horizontal"
        className="max-w-2xl rounded-none border-1"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-[300px] p-6 gap-4">
            <Key className="absolute bottom-10 left-55 w-52 h-52 text-muted-foreground/12" />
                <span className="font-semibold text-lg text-amber-600">Getting API Keys</span>
                <ol className="flex flex-col gap-3 text-sm text-muted-foreground list-none">
                    <li>
                        1. Tavily: Sign up at{" "}
                        <a href="https://tavily.com" target="_blank" className="underline text-foreground">
                            tavily.com
                        </a>
                        {" "}→ Dashboard → API Keys → Create new key
                    </li>
                    <li>
                        2. Groq: Sign up at{" "}
                        <a href="https://console.groq.com" target="_blank" className="underline text-foreground">
                            console.groq.com
                        </a>
                        {" "}→ API Keys → Create key
                    </li>
                </ol>
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-[300px] p-6 gap-4">
            <Lightbulb className="absolute bottom-10 right-55 w-52 h-52 text-muted-foreground/12" />
                <span className="font-semibold text-lg text-amber-600">Usage Tips</span>
                <ol className="flex flex-col gap-3 text-sm text-muted-foreground list-none">
                    <li>
                        1. Be specific in your query : "Extract all product prices" works better than "get prices".
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
      {/*--------------------------------------------- API KEY INPUT --------------------------------------------*/}
      <Card className="w-2xl">
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
            />
            <FieldLabel htmlFor="input-groq-api-key">Groq API Key</FieldLabel>
            <Input
              id="input-groq-api-key"
              type="password"
              placeholder="gsk-..."
            />
            <FieldDescription>
              Your API keys are encrypted and stored securely.
            </FieldDescription>
            <Button variant={"outline"}>Save Keys</Button>
          </Field>
        </CardContent>
      </Card>
      {/*-------------------------------------------- INPUT QUERY FIELD -----------------------------------------*/}
      <Card className="w-2xl">
        <CardHeader>
          <CardTitle className="text-amber-600">Query</CardTitle>
        </CardHeader>
        <CardContent>
          <Field orientation="vertical">
            <Input type="text" placeholder="Enter your query" />
            <Input type="text" placeholder="Enter URL" />
            <Button variant={"outline"}>Send</Button>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
