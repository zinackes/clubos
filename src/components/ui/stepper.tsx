import * as React from "react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepType {
  name: string;
  description?: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
}

interface StepperProps {
  step: number;
  stepsList: StepType[];
  className?: string;
}

export default function Stepper({ step, stepsList, className }: StepperProps) {
  const progressPercentage = stepsList.length > 1 
    ? ((step - 1) / (stepsList.length - 1)) * 100 
    : 0;
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        <div 
          className="absolute top-5 h-1.5 bg-border/40 z-9 rounded-full w-full"
          style={{
            left: '4%',
            maxWidth: '90%',
          }}
        />
        
        <div
          className="absolute top-5 h-1.5 bg-primary transition-all duration-500 ease-in-out rounded-full z-9"
          style={{
            left: '4%',
            width: `calc(90% * ${progressPercentage / 100})`,
            maxWidth: '90%',
          }}
        />

        {stepsList.map((myStep, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isActive = step === stepNumber;
          const isUpcoming = step < stepNumber;

          const Icon = myStep.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isActive &&
                    "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                  isUpcoming &&
                    "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className={cn("w-5 h-5", isActive && "animate-in fade-in duration-300")} />
                )}
              </div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-foreground",
                    isCompleted && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {myStep.name}
                </p>
                {myStep.description && (
                  <p
                    className={cn(
                      "text-xs mt-1 transition-colors",
                      isActive && "text-muted-foreground",
                      isCompleted && "text-muted-foreground",
                      isUpcoming && "text-muted-foreground/60"
                    )}
                  >
                    {myStep.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
