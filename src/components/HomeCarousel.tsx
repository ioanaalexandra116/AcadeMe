import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import GirlTitle from "../assets/main-logo.svg"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-4xl flex items-center justify-center"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
        <CarouselPrevious />
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-0.5">
              <Card style={{ width: 880, height: 400 }}>
                  <CardContent className="flex items-center justify-center h-full">
                    <img src={GirlTitle}
                    style={{
                      width: "400px",
                      height: "400px",
                    }}
                    />
                  </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  )
}
