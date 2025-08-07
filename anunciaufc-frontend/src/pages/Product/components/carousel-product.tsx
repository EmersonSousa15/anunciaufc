import {useEffect, useState} from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"

export function CarouselProduct({ images }: { images: File[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  return (
    <div className="mt-16 md:mx-5">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem>
              <img key={index} src={image ? `data:image/png;base64,${image}` : ""} alt="" className="w-full h-[400px]" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="w-full h-3 flex justify-center items-center gap-2 mt-2">
        { images.map((_, index) => (
          <div className={`bg-[#00629B] w-[5px] h-[5px] rounded-full transition-all delay-150  ${index + 1 === current ? "w-[8px] h-[8px]" : ''}`}>
          </div>
        ))}
      </div>
    </div >
  )
}

