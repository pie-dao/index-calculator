import React from "react"

type TooltipProps = {
  children: React.ReactNode,
  title?: string | number | Date
};

const Tooltip = ({ children, title }: TooltipProps): JSX.Element => (
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

export default Tooltip
