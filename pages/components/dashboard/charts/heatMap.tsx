import React from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { data } from '../data/heatmapData'
function heatMap(): JSX.Element {
  return (
    <ResponsiveHeatMap
        data={data}
        keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut',
            'junk',
            'sushi',
            'ramen',
            'curry',
            'udon'
        ]}
        indexBy="country"
        margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
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
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        cellOpacity={1}
        cellBorderWidth={4}
        cellBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }}
        animate={true}
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
    />
  )
}

export default heatMap
