import { DatumValue, Point } from "@nivo/line"
import { PieTooltipProps } from "@nivo/pie";
import React from "react"
import { PieData } from "../../../../../src/types/store";
import { formatLargeInteger } from "../../../../../src/utils/numberPrecision";

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

type TooltipProps = {
  children: React.ReactNode,
  title?: string | number | Date
};

type HeatmapTooltipProps = {
  xKey: string,
  yKey: string,
  value: string
};

type BarTooltipProps = {
  id: string | number;
  value: number;
}

export const Tooltip = ({ children, title }: TooltipProps): JSX.Element => (
  <div
  style={{
    background: 'white',
    padding: '9px 12px',
    border: '1px solid #ccc',
  }}
>
  {
    title && <div style={{ color: '#000' }}>{title}</div>
  }
  { children }
</div>
)

export const SliceTooltip = ({ slice }: SliceProps): JSX.Element => (
  <Tooltip title={''}>
    {slice.points.map(point => (
      <div
        key={point.id}
        style={{
            color: "#000",
            padding: '3px 0',
        }}
      >
        <strong>{point.serieId}</strong> {point.data.yFormatted}
      </div>
    ))}
  </Tooltip>
)

export const PieToolTip = (props: PieTooltipProps<PieData>): JSX.Element => (
  <Tooltip title={''}>
      <div style={{ color: 'black' }}>
        { props.datum.label } : { props.datum.value }
      </div>
  </Tooltip>
)

export const HeatmapToolTip = (props: HeatmapTooltipProps): JSX.Element => (
  <Tooltip title={''}>
    <strong style={{ color: 'black' }}>
      {props.xKey} / {props.yKey}: {props.value}
    </strong>
  </Tooltip>
)

export const BarTooltip = ({ id, value }: BarTooltipProps): JSX.Element => (
  <Tooltip title={''}>
    <strong style={{ color: 'black' }}>
        {id}: {formatLargeInteger(value)}
    </strong>
  </Tooltip>
)
