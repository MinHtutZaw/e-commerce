import * as React from "react"
import { cn } from "@/lib/utils"

// Chart config types
export type ChartConfig = Record<string, {
  label: string
  color: string
}>

// Chart context
const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

// Chart container
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    // Create CSS variables for chart colors
    const style = Object.entries(config).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [`--color-${key}`]: value.color,
      }),
      {} as React.CSSProperties
    )

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn("", className)}
          style={style}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Chart tooltip content
interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, unknown>
    color?: string
    dataKey?: string
  }>
  label?: string
  labelFormatter?: (value: string) => string
  indicator?: "dot" | "line"
  hideLabel?: boolean
  nameKey?: string
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({ active, payload, label, labelFormatter, indicator = "dot", hideLabel, nameKey }, ref) => {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className="rounded-lg border bg-white p-2 shadow-md dark:bg-gray-800"
    >
      {!hideLabel && label && (
        <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, index) => {
          const key = nameKey ? String(item.payload[nameKey]) : item.name || item.dataKey
          const configItem = config[item.dataKey || item.name || ""]
          const color = item.color || configItem?.color || "var(--chart-1)"
          
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {indicator === "dot" && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="font-medium">{configItem?.label || key}:</span>
              <span>{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

// Re-export Tooltip from recharts with custom styling
export { Tooltip as ChartTooltip } from "recharts"

// Chart legend content
interface ChartLegendContentProps {
  payload?: Array<{
    value: string
    color: string
    dataKey?: string
  }>
}

const ChartLegendContent: React.FC<ChartLegendContentProps> = ({ payload }) => {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-2">
      {payload.map((item, index) => {
        const configItem = config[item.dataKey || item.value || ""]
        return (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {configItem?.label || item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Chart legend wrapper
interface ChartLegendProps {
  content: React.ReactElement
}

const ChartLegend: React.FC<ChartLegendProps> = ({ content }) => {
  return content
}

export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
}
