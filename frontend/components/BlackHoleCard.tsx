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

export function BlackHoleCard() {
  return (
    <Card size="lg" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Wanna See a Cool Video On Black Holes Colliding??</CardTitle>
        <CardDescription>
          This video is bokners!!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" size="lg" className="w-full" asChild>
            <Link href="https://youtu.be/dQw4w9WgXcQ" target="_blank">
                Watch Video
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
