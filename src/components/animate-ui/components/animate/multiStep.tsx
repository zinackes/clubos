import * as React from 'react';
import {
  Tabs as TabsPrimitive,
  TabsContent as TabsContentPrimitive,
  TabsContents as TabsContentsPrimitive,
  type TabsProps as TabsPrimitiveProps,
  type TabsContentProps as TabsContentPrimitiveProps,
  type TabsContentsProps as TabsContentsPrimitiveProps,
} from '@/components/animate-ui/primitives/animate/tabs';
import { cn } from '@/lib/utils';
import {Button} from "@/components/ui/button.tsx";

interface MultiStepContextType {
  currentStep: string;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  steps: string[];
}

const MultiStepContext = React.createContext<MultiStepContextType | null>(null);

function useMultiStep() {
  const context = React.useContext(MultiStepContext);
  if (!context) {
    throw new Error('useMultiStep must be used within a MultiSteps component');
  }
  return context;
}

interface MultiStepsProps extends Omit<TabsPrimitiveProps, 'value' | 'onValueChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
  steps: string[];
}

function MultiSteps({
                      className,
                      steps,
                      value: controlledValue,
                      onValueChange,
                      defaultValue,
                      ...props
                    }: MultiStepsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || steps[0]);

  const currentStep = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (onValueChange) {
          onValueChange(newValue);
        }
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
      },
      [onValueChange, controlledValue]
  );

  const currentIndex = steps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  const nextStep = React.useCallback(() => {
    if (!isLastStep) {
      handleValueChange(steps[currentIndex + 1]);
    }
  }, [currentIndex, isLastStep, steps, handleValueChange]);

  const prevStep = React.useCallback(() => {
    if (!isFirstStep) {
      handleValueChange(steps[currentIndex - 1]);
    }
  }, [currentIndex, isFirstStep, steps, handleValueChange]);

  return (
      <MultiStepContext.Provider value={{ currentStep, nextStep, prevStep, isFirstStep, isLastStep, steps }}>
        <TabsPrimitive
            value={currentStep}
            onValueChange={handleValueChange}
            className={cn('flex flex-col', className)}
            {...props}
        />
      </MultiStepContext.Provider>
  );
}

interface MultiStepTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  validateFn?: (param: any) => void;
}

const MultiStepNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, onClick, ...props }, ref) => {
        const { nextStep, isLastStep } = useMultiStep();

        const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                await onClick(e);
                nextStep();
            } else {
                nextStep();
            }
        };

        return (
            <Button
                ref={ref}
                type="button"
                onClick={handleClick}
                className={cn(isLastStep && "hidden", className)}
                {...props}
            />
        );
    }
);
MultiStepNext.displayName = "MultiStepNext";

const MultiStepPrev = React.forwardRef<HTMLButtonElement, MultiStepTriggerProps>(
    ({ className, onClick, ...props }, ref) => {
      const { prevStep, isFirstStep } = useMultiStep();

      return (
          <Button
              ref={ref}
              type="button"
              variant={"outline"}
              onClick={(e) => {
                prevStep();
                onClick?.(e);
              }}
              disabled={isFirstStep || props.disabled}
              className={cn(isFirstStep && "opacity-50 cursor-not-allowed", className)}
              {...props}
          />
      );
    }
);
MultiStepPrev.displayName = "MultiStepPrev";

type TabsContentsProps = TabsContentsPrimitiveProps;
function MultiStepsContents(props: TabsContentsProps) {
  return <TabsContentsPrimitive {...props} />;
}

type TabsContentProps = TabsContentPrimitiveProps;
function MultiStepContent({ className, ...props }: TabsContentProps) {
  return (
      <TabsContentPrimitive
          className={cn('outline-none h-full', className)}
          {...props}
      />
  );
}

export {
  MultiSteps,
  MultiStepsContents,
  MultiStepContent,
  MultiStepNext,
  MultiStepPrev,
  useMultiStep,
};