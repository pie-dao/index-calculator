import React from 'react'
import HeatMap from './components/dashboard/charts/heatMap'
import LineChart from './components/dashboard/charts/lineChart'
import { data } from './components/dashboard/data/lineData'

function dashboard() {
  return (
    <div className="h-screen overflow-auto">
      <div className="hero h-1/8">
        <div className="text-center hero-content w-full">
          <div className="max-w">
            <h1 className="text-5xl font-bold">
                  PieDAO Index Dashboard
            </h1> 
          </div>
        </div>
      </div>
      <div className="card bordered h-1/2 m-2">
        <LineChart data={data} />
      </div>
      <div className="flex flex-row card bordered h-1/2 m-2">
        <div className="card h-full w-1/2">
          <HeatMap />
        </div>
        <div className="card h-full w-1/2">
          <HeatMap />
        </div>
      </div>
    </div>
  )
}

export default dashboard
