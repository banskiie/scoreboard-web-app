import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const Ads = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="bg-slate-50 h-full w-full flex items-center justify-center"
    >
      <CarouselContent>
        <CarouselItem className="w-screen">
          <p className="text-9xl font-black text-center">Niere</p>
        </CarouselItem>
        <CarouselItem className="w-screen">
          <p className="text-9xl font-black text-center">Zora</p>
        </CarouselItem>
        <CarouselItem className="w-screen">
          <p className="text-9xl font-black text-center">Micko</p>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}

export default Ads
