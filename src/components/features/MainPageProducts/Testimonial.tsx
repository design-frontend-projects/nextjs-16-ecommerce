"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number
  content: string
  author: string
  role: string
  company: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content:
      "This platform has completely transformed how we approach our daily workflow. The intuitive design and powerful features have saved us countless hours.",
    author: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    image: "/professional-woman-diverse.png",
  },
  {
    id: 2,
    content:
      "The best investment we've made this year. Our team productivity has increased by 300% and collaboration has never been smoother.",
    author: "Michael Rodriguez",
    role: "CEO",
    company: "StartupHub",
    image: "/professional-man.jpg",
  },
  {
    id: 3,
    content:
      "Outstanding support and reliability. We've been using this for 6 months now and it's become an essential part of our tech stack.",
    author: "Emily Watson",
    role: "Engineering Lead",
    company: "DevStudio",
    image: "/professional-woman-glasses.png",
  },
  {
    id: 4,
    content:
      "Game-changing platform that delivers on every promise. The ROI was evident within the first month of implementation.",
    author: "James Kim",
    role: "CTO",
    company: "InnovateLab",
    image: "/professional-asian-man.png",
  },
]

export function AnimatedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<"left" | "right">("right")

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection("right")
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setDirection("left")
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setDirection("right")
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setDirection(index > currentIndex ? "right" : "left")
    setCurrentIndex(index)
  }

  return (
    <section className="w-full py-20 px-16 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Loved by teams worldwide</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {"Don't just take our word for it. Here's what our customers have to say."}
          </p>
        </div>

        <div className="relative">
          {/* Main testimonial card */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-2 shadow-lg">
                    <CardContent className="p-8 md:p-12">
                      <Quote className="w-12 h-12 text-accent mb-6" />
                      <blockquote className="text-xl md:text-2xl font-medium mb-8 text-pretty leading-relaxed">
                        {testimonial.content}
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-accent/20">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.author} />
                          <AvatarFallback>
                            {testimonial.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-lg">{testimonial.author}</div>
                          <div className="text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0 md:-mx-12 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="pointer-events-auto shadow-lg bg-background/95 hover:bg-accent hover:text-accent-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="pointer-events-auto shadow-lg bg-background/95 hover:bg-accent hover:text-accent-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-accent w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Company logos */}
        {/* <div className="mt-16 pt-16 border-t">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wide font-medium">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {["Google", "Netflix", "TripAdvisor", "Box", "eBay"].map((company) => (
              <div key={company} className="text-2xl font-bold text-foreground/80">
                {company}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}
