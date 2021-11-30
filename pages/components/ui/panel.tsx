import React, { ReactNode } from 'react'

interface PanelProps {
  title: string;
  size?: string;
  children: ReactNode
}

function Panel(props: PanelProps): JSX.Element {
  const className = `card bordered ${props.size ?? 'h-96' }`;
  return (
    <div className={className}>
      <div className="card-body">
        <h2 className="card-title">{ props.title }</h2>       
        { props.children }
      </div>
    </div> 
  )
}

export default Panel
