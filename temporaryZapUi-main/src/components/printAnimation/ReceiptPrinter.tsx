"use client";

import {
  CheckCircle as CheckCircleIcon,
  CircleNotch as CircleNotchIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { cn } from "../../helpers/classname-helper";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(
  null,
);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-91%)",
  "translateY(-91%)",
  "translateY(-81%)",
  "translateY(-81%)",
  "translateY(-70%)",
  "translateY(-70%)",
  "translateY(-58%)",
  "translateY(-58%)",
  "translateY(-45%)",
  "translateY(-45%)",
  "translateY(-32%)",
  "translateY(-32%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-10%)",
  "translateY(-10%)",
  "translateY(-3%)",
  "translateY(-3%)",
  "translateY(0%)",
];

const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: "Processing your order",
  printing: "Printing your receipt",
  complete: "Order complete",
};

const machineStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '1.5rem',
  border: '1px solid #334155',
  backgroundColor: '#1e293b',
  padding: '0.75rem',
  paddingBottom: '2rem',
  boxShadow: '0 20px 36px -20px rgba(0, 0, 0, 0.55), 0 6px 14px -8px rgba(0, 0, 0, 0.24)',
};

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);

  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }

  return context;
}

function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Receipt printer",
  animate = true,
  children,
  className,
  feedMotion = "stepped",
  stage,
  style,
  ...props
}: ReceiptPrinterRootProps & { style?: React.CSSProperties }) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full max-w-sm flex-col items-center",
          className,
        )}
        data-stage={stage}
        style={{ position: 'relative', display: 'flex', width: '100%', maxWidth: '380px', flexDirection: 'column', alignItems: 'center', margin: '0 auto', ...style }}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div
      className={cn("receipt-printer-machine", className)}
      style={{ ...machineStyle, ...style }}
      {...props}
    >
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '1.5rem',
          right: '1.5rem',
          bottom: '0.75rem',
          zIndex: 40,
          height: '8px',
          borderRadius: '4px',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
        }}
      />
    </div>
  );
}

function ReceiptPrinterHeader({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn("receipt-printer-header", className)}
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        height: '44px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0.5rem 0.5rem 0.5rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn("receipt-printer-screen", className)}
      style={{
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        borderRadius: '0.85rem',
        border: '1px solid #0f172a',
        backgroundColor: '#090d16',
        padding: '1rem',
        color: '#f8fafc',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
        ...style
      }}
      {...props}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
}

function StatusIndicator({
  animate,
  move,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === "complete";

  return (
    <span
      aria-hidden="true"
      style={{ position: 'relative', display: 'grid', width: '20px', height: '20px', placeItems: 'center', flexShrink: 0 }}
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            style={{ gridColumnStart: 1, gridRowStart: 1, display: 'grid', placeItems: 'center', color: '#22c55e' }}
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="complete"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CheckCircleIcon size={18} weight="fill" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            style={{ gridColumnStart: 1, gridRowStart: 1, display: 'grid', placeItems: 'center', color: '#94a3b8' }}
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="working"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CircleNotchIcon
              className={cn(
                animate && "animate-spin motion-reduce:animate-none",
              )}
              size={18}
              weight="bold"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterStatusProps & { style?: React.CSSProperties }) {
  const { animate, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: '0.5rem', ...style }}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        style={{ display: 'grid', minWidth: 0, flex: 1, alignItems: 'center' }}
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            style={{
              gridColumnStart: 1,
              gridRowStart: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 500,
              fontSize: '0.75rem',
              color: '#94a3b8',
              lineHeight: 1
            }}
            exit={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(-4px)" : "translateY(0px)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(4px)" : "translateY(0px)",
            }}
            key={stage}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn("receipt-printer-paper", className)}
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '20rem',
        backgroundColor: '#ffffff',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        fontFamily: 'monospace, Courier New, sans-serif',
        color: '#0f172a',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        clipPath: receiptClipPath,
        ...style
      }}
      {...props}
    >
      {children}
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Output",
  );
  const isReceiptVisible = stage !== "processing";
  const shouldUseSteppedFeed =
    feedMotion === "stepped" && stage === "printing" && shouldMove;

  return (
    <div
      className={cn("receipt-printer-output", className)}
      style={{
        position: 'relative',
        zIndex: 50,
        marginTop: '-1rem',
        height: '34rem',
        width: 'calc(88% + 2rem)',
        maxWidth: '100%',
        overflow: 'hidden',
        padding: '0 1.25rem',
        ...style
      }}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: '1.5rem',
            right: '1.5rem',
            top: '-4px',
            zIndex: 20,
            height: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            filter: 'blur(6px)'
          }}
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        aria-hidden={stage !== "complete"}
        style={{ position: 'relative' }}
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.75 : 0,
            ease: shouldUseSteppedFeed ? "linear" : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};
