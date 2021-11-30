import React from 'react'
import { HeatMapDatum, ResponsiveHeatMap } from '@nivo/heatmap'
function heatMap({ data, keys, index }: { data: HeatMapDatum[], keys: string[], index: string }): JSX.Element {
  return (
    <ResponsiveHeatMap
        data={data}
        keys={keys}
        indexBy={index}
        forceSquare={true}
        padding={4}
        colors="PuRd"
        axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 36 }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: index,
            legendPosition: 'middle',
            legendOffset: -40
        }}
        cellOpacity={1}
        cellBorderWidth={4}
        animate={true}
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
    />
  )
}

export default heatMap
