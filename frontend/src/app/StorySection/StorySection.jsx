"use client";
import React, { useEffect, useRef, useState } from "react";
import StoryCard from "./component/StoryCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";

const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [scrollAmount, setScrollAmount] = useState(200); // Default scroll amount
  const [isAddStory, setIsAddStory] = useState(true); 
  const containerRef = useRef(null);

   const {story,fetchStoryPosts}=usePostStore();;
  

   useEffect(()=>{
    fetchStoryPosts()
   },[fetchStoryPosts])

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        setMaxScroll(containerRef.current.scrollWidth - containerRef.current.clientWidth);
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };

    const updateScrollAmount = () => {
      if (window.innerWidth < 640) {
        setScrollAmount(100); // Smaller scroll step for small screens
      } else {
        setScrollAmount(200); // Default for larger screens
      }
    };

    if (containerRef.current) {
      updateMaxScroll();
    }
    updateScrollAmount();

    window.addEventListener("resize", updateMaxScroll);
    window.addEventListener("resize", updateScrollAmount);

    return () => {
      window.removeEventListener("resize", updateMaxScroll);
      window.removeEventListener("resize", updateScrollAmount);
    };
  }, [story]);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const amount = direction === "left" ? -scrollAmount : scrollAmount;
      containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex space-x-2 overflow-x-auto scroll-smooth py-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="whitespace-nowrap flex space-x-2">
          <StoryCard isAddStory={isAddStory} />
          {story.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>

      {/* Left Scroll Button */}
      {scrollPosition > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 sm:p-2"
          onClick={() => scroll("left")}
        >
          <ChevronLeft />
        </Button>
      )}

      {/* Right Scroll Button */}
      {scrollPosition < maxScroll && maxScroll > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 sm:p-2"
          onClick={() => scroll("right")}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

export default StorySection;
