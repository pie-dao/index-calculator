import { BarDatum, ResponsiveBar } from '@nivo/bar'
import { formatLargeInteger } from '../../../utils/numberPrecision'
import { colorScheme, customTheme } from '../../../utils/theme'
import Tooltip from './tooltips'

type BarTooltipProps = {
    id: string | number;
    value: number;
};
  
const BarTooltip = ({ id, value }: BarTooltipProps): JSX.Element => (
    <Tooltip title={''}>
      <strong style={{ color: 'black' }}>
          {id}: {formatLargeInteger(value)}
      </strong>
    </Tooltip>
);
  
export type BarChartProps = {
    data: BarDatum[],
    keys: string[],
    index: string
};

const BarChart = ({ data, keys, index }: BarChartProps) => (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={index}
        theme={customTheme}
        tooltip={({ id, value }) => <BarTooltip id={id} value={value}/>}
        colors={{ scheme: colorScheme }}
        margin={{ top: 50, right: 120, bottom: 50, left: 10 }}
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
            legendOffset: 40,
            format: v => formatLargeInteger(v)
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
