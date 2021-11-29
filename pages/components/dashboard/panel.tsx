import React from 'react'

function panel({ children }: { children: React.ReactNode}): JSX.Element {
  return (
    <div className="card bordered h-96">
      { children }
    </div> 
  )
}

export default panel
