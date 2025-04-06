"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sponsors } from "./Data/sponser"; 

const RightSidebar = () => {
  const [showAllSponsor, setShowAllSponsor] = useState(false);
  const displaySponsor = showAllSponsor ? sponsors : sponsors.slice(0, 3);

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex text-lg font-semibold items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Popular
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              {displaySponsor.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-50 h-40 object-contain rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{sponsor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sponsor.description}
                    </p>
                    <a
                      href={sponsor.website}
                      target="_blank"
                      className="text-primary text-sm flex items-center mt-1 hover:underline"
                      rel="noopener noreferrer"
                    >
                      Visit website <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
              {sponsors.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full mt-4 dark:text-white"
                  onClick={() => setShowAllSponsor(!showAllSponsor)}
                >
                  {showAllSponsor ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </motion.aside>
  );
};

export default RightSidebar;
