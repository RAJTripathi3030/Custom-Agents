import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export function AgentCard() {
  return (
    <Card size="lg" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Get to Know AI Agents</CardTitle>
        <CardDescription>
          This article will give you a good introduction to AI agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="link" size="lg" className="w-full" >
          <Link href="https://www.ibm.com/think/topics/ai-agents">Read Article</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
