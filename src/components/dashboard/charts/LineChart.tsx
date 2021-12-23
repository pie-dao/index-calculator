import React from 'react'
import { LineProps, Point, ResponsiveLine } from '@nivo/line'
import Tooltip from './tooltips'
import { customTheme } from '../../../utils/theme'
import { DatumValue } from '@nivo/core';

type SliceProps = { 
    slice: { 
      id: DatumValue;
      height: number;
      width: number;
      x0: number;
      x: number;
      y0: number;
      y: number;
      points: Point[];
    }
  };

const SliceTooltip = ({ slice }: SliceProps): JSX.Element => (
    <Tooltip title={''}>
        {slice.points.map(point => (
        <div
            key={point.id}
            style={{
                color: 'black',
                padding: '3px 0',
            }}
        >
            <div className="flex justify-space-between items-center">
                <div style={{
                    marginRight: '1rem',
                    width: '10px',
                    height: '10px',
                    backgroundColor: point.color,
                    borderRadius: '100%'
                }}></div>
                <div>
                    <strong>{point.serieId}</strong> {point.data.yFormatted}
                </div>
            </div>
        </div>
        ))}
    </Tooltip>
)

function lineChart({ data, index }: { data: LineProps['data'], index: string }) {
  return (
    <ResponsiveLine
      data={data}
      colors={{ datum: 'color' }}
      curve="catmullRom"
      margin={{ top: 50, right: 110, bottom: 70, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
      yFormat=" >-.2%"
      sliceTooltip={({slice}) => <SliceTooltip slice={slice}/>}
      axisTop={null}
      theme={customTheme}
      enableSlices="x"
      axisRight={null}
      axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45,
          legend: 'Date',
          legendOffset: 60,
          legendPosition: 'middle'
      }}
      axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: index,
          legendOffset: -50,
          legendPosition: 'middle'
      }}
      pointSize={8}
      enableGridX={false}
      enableGridY={false}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={false}
      legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              toggleSerie: true,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}      
    />
  )
}

export default lineChart
