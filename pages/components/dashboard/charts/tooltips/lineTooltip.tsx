import { DatumValue, Point } from "@nivo/line"

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
}

export const SliceTooltip = ({ slice }: SliceProps): JSX.Element => (
  <div
    style={{
      background: 'white',
      padding: '9px 12px',
      border: '1px solid #ccc',
    }}
  >
    <div>Date: {slice.id}</div>
    {slice.points.map(point => (
      <div
        key={point.id}
        style={{
            color: "#000",
            padding: '3px 0',
        }}
      >
        <strong>{point.serieId}</strong> [{point.data.yFormatted}]
      </div>
    ))}
  </div>
)
