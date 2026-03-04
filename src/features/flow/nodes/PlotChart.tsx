import React, { useMemo } from "react"

interface PlotPoint {
  x: number
  y: number
}

interface PlotChartProps {
  points: PlotPoint[]
  heightClassName?: string
}

export const PlotChart: React.FC<PlotChartProps> = React.memo(
  ({ points, heightClassName = "h-[120px]" }) => {
    const viewWidth = 100
    const viewHeight = 100
    const frame = {
      left: 10,
      right: 4,
      top: 6,
      bottom: 12,
    }

    const metrics = useMemo(() => {
      const plotWidth = viewWidth - frame.left - frame.right
      const plotHeight = viewHeight - frame.top - frame.bottom

      if (points.length === 0) {
        return {
          path: "",
          zeroLineY: null as number | null,
          zeroLineX: null as number | null,
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
          xTicks: [] as Array<{ x: number; label: string }>,
          yTicks: [] as Array<{ y: number; label: string }>,
        }
      }

      const xs = points.map((p) => p.x)
      const ys = points.map((p) => p.y)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)
      const rangeX = maxX - minX || 1
      const rangeY = maxY - minY || 1

      const scaleX = (x: number) =>
        frame.left + ((x - minX) / rangeX) * plotWidth
      const scaleY = (y: number) =>
        frame.top + ((maxY - y) / rangeY) * plotHeight

      let path = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`
      for (let i = 1; i < points.length; i++) {
        path += ` L ${scaleX(points[i].x)} ${scaleY(points[i].y)}`
      }

      const zeroLineY =
        minY > 0 || maxY < 0
          ? null
          : frame.top + ((maxY - 0) / rangeY) * plotHeight

      const zeroLineX =
        minX > 0 || maxX < 0
          ? null
          : frame.left + ((0 - minX) / rangeX) * plotWidth

      const tickFractions = [0, 0.5, 1]
      const xTicks = tickFractions.map((fraction) => {
        const x = frame.left + fraction * plotWidth
        const value = minX + fraction * rangeX
        return { x, label: value.toFixed(1) }
      })

      const yTicks = tickFractions.map((fraction) => {
        const y = frame.top + fraction * plotHeight
        const value = maxY - fraction * rangeY
        return { y, label: value.toFixed(1) }
      })

      return {
        path,
        zeroLineY,
        zeroLineX,
        minX,
        maxX,
        minY,
        maxY,
        xTicks,
        yTicks,
      }
    }, [frame.bottom, frame.left, frame.right, frame.top, points])

    return (
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-input)] ${heightClassName}`}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          className="absolute left-0 top-0"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <React.Fragment key={f}>
              <line
                x1={frame.left}
                y1={frame.top + f * (viewHeight - frame.top - frame.bottom)}
                x2={viewWidth - frame.right}
                y2={frame.top + f * (viewHeight - frame.top - frame.bottom)}
                stroke="var(--text-dim)"
                strokeWidth="0.25"
                opacity="0.3"
              />
              <line
                x1={frame.left + f * (viewWidth - frame.left - frame.right)}
                y1={frame.top}
                x2={frame.left + f * (viewWidth - frame.left - frame.right)}
                y2={viewHeight - frame.bottom}
                stroke="var(--text-dim)"
                strokeWidth="0.25"
                opacity="0.3"
              />
            </React.Fragment>
          ))}

          {metrics.zeroLineY !== null && (
            <line
              x1={frame.left}
              y1={metrics.zeroLineY}
              x2={viewWidth - frame.right}
              y2={metrics.zeroLineY}
              stroke="var(--text-dim)"
              strokeWidth="0.35"
              opacity="0.7"
            />
          )}

          {metrics.zeroLineX !== null && (
            <line
              x1={metrics.zeroLineX}
              y1={frame.top}
              x2={metrics.zeroLineX}
              y2={viewHeight - frame.bottom}
              stroke="var(--text-dim)"
              strokeWidth="0.35"
              opacity="0.7"
            />
          )}

          {metrics.path && (
            <path
              d={metrics.path}
              fill="none"
              stroke="var(--category-display)"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              filter="drop-shadow(0 0 4px rgba(20, 174, 92, 0.35))"
            />
          )}

          {points.length > 0 && (
            <>
              {metrics.xTicks.map((tick, idx) => (
                <React.Fragment key={`x-tick-${idx}`}>
                  <line
                    x1={tick.x}
                    y1={viewHeight - frame.bottom}
                    x2={tick.x}
                    y2={viewHeight - frame.bottom + 2.2}
                    stroke="var(--text-dim)"
                    strokeWidth="0.35"
                  />
                  <text
                    x={tick.x}
                    y={viewHeight - 2}
                    textAnchor="middle"
                    fontSize="3"
                    fill="var(--text-dim)"
                    className="font-mono"
                  >
                    {tick.label}
                  </text>
                </React.Fragment>
              ))}

              {metrics.yTicks.map((tick, idx) => (
                <React.Fragment key={`y-tick-${idx}`}>
                  <line
                    x1={frame.left - 2.2}
                    y1={tick.y}
                    x2={frame.left}
                    y2={tick.y}
                    stroke="var(--text-dim)"
                    strokeWidth="0.35"
                  />
                  <text
                    x={frame.left - 2.8}
                    y={tick.y + 1}
                    textAnchor="end"
                    fontSize="3"
                    fill="var(--text-dim)"
                    className="font-mono"
                  >
                    {tick.label}
                  </text>
                </React.Fragment>
              ))}
            </>
          )}
        </svg>

        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[var(--text-dim)]">
            No data
          </div>
        )}
      </div>
    )
  },
)

PlotChart.displayName = "PlotChart"
