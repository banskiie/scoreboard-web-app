import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
// Platinum
import Plat1 from "@/assets/sponsors/plat_1.png"
import Plat2 from "@/assets/sponsors/plat_2.png"
import Plat3 from "@/assets/sponsors/plat_3.png"
import Silver1 from "@/assets/sponsors/silver_1.jpg"
import Silver2 from "@/assets/sponsors/silver_2.jpg"
import Silver3 from "@/assets/sponsors/silver_3.png"
import Silver4 from "@/assets/sponsors/silver_4.jpg"
import Silver5 from "@/assets/sponsors/silver_5.png"
import Bronze1 from "@/assets/sponsors/bronze_1.jpg"
import Bronze2 from "@/assets/sponsors/bronze_2.png"
import Bronze3 from "@/assets/sponsors/bronze_3.png"
import Bronze4 from "@/assets/sponsors/bronze_4.png"
import Bronze5 from "@/assets/sponsors/bronze_5.jpg"
import Bronze6 from "@/assets/sponsors/bronze_6.jpg"
import Bronze7 from "@/assets/sponsors/bronze_7.jpg"
import Bronze8 from "@/assets/sponsors/bronze_8.png"

const Ads = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full flex items-center justify-center"
    >
      <CarouselContent className="w-screen h-[700px]">
        <CarouselItem className="w-full flex items-center justify-center">
          <Image src={Plat1} priority className="h-4/5 object-contain" alt="" />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <Image src={Plat2} priority className="h-4/5 object-contain" alt="" />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <Image src={Plat3} priority className="h-4/5 object-contain" alt="" />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <Image
            src={Silver1}
            priority
            className="h-4/5 object-contain"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <Image
            src={Silver2}
            priority
            className="h-4/5 object-contain"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <Image
            src={Silver3}
            priority
            className="h-4/5 object-contain"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <div className="h-full flex flex-row w-full items-center">
            <Image
              src={Silver4}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
            <Image
              src={Silver5}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <div className="h-full flex flex-row w-full items-center justify-center">
            <Image
              src={Bronze1}
              priority
              className="h-4/5 object-contain w-1/2 pl-12"
              alt=""
            />
            <Image
              src={Bronze2}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <div className="h-full flex flex-row w-full items-center justify-center">
            <Image
              src={Bronze3}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
            <Image
              src={Bronze4}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <div className="h-full flex flex-row w-full items-center justify-center">
            <Image
              src={Bronze5}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
            <Image
              src={Bronze6}
              priority
              className="h-4/5 object-contain w-1/2 pr-12"
              alt=""
            />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-center">
          <div className="h-full flex flex-row w-full items-center justify-center">
            <Image
              src={Bronze7}
              priority
              className="h-4/5 object-contain w-1/2"
              alt=""
            />
            <Image
              src={Bronze8}
              priority
              className="h-4/5 object-contain w-1/2 pr-14"
              alt=""
            />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-around flex-col py-8">
          <span className="text-8xl text-center font-bold">
            BME Partners Inc.
          </span>
          <span className="text-8xl text-center font-bold">
            G-Galyx Inn Hotel
          </span>
          <span className="text-8xl text-center font-bold">Barba</span>
          <span className="text-8xl text-center font-bold">
            FAR-GO MOTOR PARTS, INC.
          </span>
          <span className="text-8xl text-center font-bold">Villa Tuna</span>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-around flex-col py-8">
          <span className="text-8xl text-center font-bold">
            Solid Shipping Lines
          </span>
          <span className="text-8xl text-center font-bold">Joesons</span>
          <span className="text-8xl text-center font-bold">Caltex</span>
          <span className="text-8xl text-center font-bold">
            Julius Magallanes
          </span>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-around flex-col py-8">
          <span className="text-8xl text-center font-bold">
            Off Season Enterprise
          </span>
          <span className="text-8xl text-center font-bold">Xtremeworks</span>
          <span className="text-8xl text-center font-bold">
            Graphics All-In Store
          </span>
          <span className="text-8xl text-center font-bold">
            Quadgroup Distribution Inc
          </span>
          <span className="text-8xl text-center font-bold">ZC E&L Corp</span>
        </CarouselItem>
        <CarouselItem className="w-full flex items-center justify-around flex-col py-8">
          <span className="text-8xl text-center font-bold">
            Stronghold Insurance Company, Inc
          </span>
          <span className="text-8xl text-center font-bold">Axa</span>
          <span className="text-8xl text-center font-bold">Prudential</span>
          <span className="text-8xl text-center font-bold">
            Metrobank Cagayan de Oro - Velez
          </span>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}

export default Ads
