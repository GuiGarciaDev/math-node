import React, { useMemo } from "react"

interface PlotPoint {
  x: number
  y: number
}

interface PlotChartProps {
  points: PlotPoint[]
  width: number
  height: number
}

export const PlotChart: React.FC<PlotChartProps> = React.memo(
  ({ points, width, height }) => {
    const padding = 8

    const metrics = useMemo(() => {
      if (points.length === 0) {
        return {
          path: "",
          zeroLineY: null as number | null,
          zeroLineX: null as number | null,
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
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
        padding + ((x - minX) / rangeX) * (width - padding * 2)
      const scaleY = (y: number) =>
        height - padding - ((y - minY) / rangeY) * (height - padding * 2)

      let path = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`
      for (let i = 1; i < points.length; i++) {
        path += ` L ${scaleX(points[i].x)} ${scaleY(points[i].y)}`
      }

      const zeroLineY =
        minY > 0 || maxY < 0
          ? null
          : height - padding - ((0 - minY) / rangeY) * (height - padding * 2)

      const zeroLineX =
        minX > 0 || maxX < 0
          ? null
          : padding + ((0 - minX) / rangeX) * (width - padding * 2)

      return {
        path,
        zeroLineY,
        zeroLineX,
        minX,
        maxX,
        minY,
        maxY,
      }
    }, [height, points, width])

    const xMid = (metrics.minX + metrics.maxX) / 2
    const yMid = (metrics.minY + metrics.maxY) / 2

    return (
      <div
        style={{
          width: "100%",
          height,
          background: "var(--bg-input)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.2 }}
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <React.Fragment key={f}>
              <line
                x1="0"
                y1={`${f * 100}%`}
                x2="100%"
                y2={`${f * 100}%`}
                stroke="var(--text-dim)"
                strokeWidth="0.5"
              />
              <line
                x1={`${f * 100}%`}
                y1="0"
                x2={`${f * 100}%`}
                y2="100%"
                stroke="var(--text-dim)"
                strokeWidth="0.5"
              />
            </React.Fragment>
          ))}
        </svg>

        {metrics.zeroLineY !== null && (
          <div
            style={{
              position: "absolute",
              top: metrics.zeroLineY,
              left: 0,
              width: "100%",
              height: 1,
              background: "var(--text-dim)",
            }}
          />
        )}

        {metrics.zeroLineX !== null && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: metrics.zeroLineX,
              width: 1,
              height: "100%",
              background: "var(--text-dim)",
            }}
          />
        )}

        {metrics.path && (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            style={{ position: "absolute", top: 0, left: 0 }}
            preserveAspectRatio="none"
          >
            <path
              d={metrics.path}
              fill="none"
              stroke="var(--category-display)"
              strokeWidth="2"
              style={{
                filter: "drop-shadow(0 0 4px rgba(20, 174, 92, 0.35))",
              }}
            />
          </svg>
        )}

        {points.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--text-dim)",
            }}
          >
            No data
          </div>
        )}

        {points.length > 0 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 8,
                right: 8,
                bottom: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pointerEvents: "none",
                color: "var(--text-dim)",
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span>{metrics.minX.toFixed(1)}</span>
              <span>{xMid.toFixed(1)}</span>
              <span>{metrics.maxX.toFixed(1)}</span>
            </div>

            <div
              style={{
                position: "absolute",
                left: 4,
                top: 8,
                bottom: 14,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                pointerEvents: "none",
                color: "var(--text-dim)",
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span>{metrics.maxY.toFixed(1)}</span>
              <span>{yMid.toFixed(1)}</span>
              <span>{metrics.minY.toFixed(1)}</span>
            </div>

            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0.5 }}
            >
              {[0, 0.5, 1].map((f) => (
                <line
                  key={`x-tick-${f}`}
                  x1={8 + f * (width - 16)}
                  y1={height - 10}
                  x2={8 + f * (width - 16)}
                  y2={height - 6}
                  stroke="var(--text-dim)"
                  strokeWidth="0.8"
                />
              ))}
              {[0, 0.5, 1].map((f) => (
                <line
                  key={`y-tick-${f}`}
                  x1={4}
                  y1={8 + f * (height - 22)}
                  x2={8}
                  y2={8 + f * (height - 22)}
                  stroke="var(--text-dim)"
                  strokeWidth="0.8"
                />
              ))}
            </svg>
          </>
        )}
      </div>
    )
  },
)

PlotChart.displayName = "PlotChart"
