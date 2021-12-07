import { BarDatum, ResponsiveBar } from '@nivo/bar'
import { formatBarAxis } from '../../../../src/utils'
import { colorScheme, customTheme } from './theme'
import { BarTooltip } from './tooltips'

const BarChart = ({ data, keys, index }: { data: BarDatum[], keys: string[], index: string }) => (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={index}
        theme={customTheme}
        tooltip={({ id, value }) => <BarTooltip id={id} value={value}/>}
        colors={{ scheme: colorScheme }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        layout="horizontal"
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        enableLabel={false}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: index,
            legendPosition: 'middle',
            legendOffset: 32,
            format: v => formatBarAxis(v)
        }}
        enableGridY={false}
        axisLeft={{
            legend: 'coin',
            legendPosition: 'middle',
            legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
    />
)
export default BarChart
