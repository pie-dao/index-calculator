import React from 'react'
import HeatMap from './components/dashboard/charts/heatMap'
import LineChart from './components/dashboard/charts/lineChart'
import PieChart from './components/dashboard/charts/PieChart'
import { data } from './components/dashboard/data/lineData'
import { data as pieData } from './components/dashboard/data/pieData'
import Panel from './components/ui/panel'

const TitleCard = (): JSX.Element => (
  <div className="hero h-1/8">
    <div className="text-center hero-content w-full">
      <div className="max-w">
        <h1 className="text-5xl font-bold">
              PieDAO Index Dashboard
        </h1> 
      </div>
    </div>
  </div>
)

const KPITable = (): JSX.Element => (
  <div className="overflow-x-auto">
    <table className="table w-full table-compact">
      <thead>
        <tr>
          <th></th> 
          <th>Name</th> 
          <th>Job</th> 
          <th>company</th> 
          <th>location</th> 
          <th>Last Login</th> 
          <th>Favorite Color</th>
          <th>New Row</th>
        </tr>
      </thead> 
      <tbody>
        { 
          [1,2,3,4,5].map(i => (
            <tr className="hover" key={i}>
              <th>{i}</th> 
              <td>Cy Ganderton</td> 
              <td>Quality Control Specialist</td> 
              <td>Littel, Schaden and Vandervort</td> 
              <td>Canada</td> 
              <td>12/16/2020</td> 
              <td>Blue</td>
              <td>Whatever</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

const StatsTable = (): JSX.Element => (
  <div className="w-full shadow stats">
    <div className="stat place-items-center place-content-center">
      <div className="stat-title">Downloads</div> 
      <div className="stat-value">310M</div> 
      <div className="stat-desc">Jan 1st - Feb 1st</div>
    </div> 
    <div className="stat place-items-center place-content-center">
      <div className="stat-title">New Users</div> 
      <div className="stat-value text-success">4,200</div> 
      <div className="stat-desc text-success">↗︎ 400 (22%)</div>
    </div> 
    <div className="stat place-items-center place-content-center">
      <div className="stat-title">New Registers</div> 
      <div className="stat-value text-error">1,200</div> 
      <div className="stat-desc text-error">↘︎ 90 (14%)</div>
    </div>
  </div>
)


function dashboard() {
  return (
    <div className="h-screen overflow-auto">
      <TitleCard />
      <StatsTable />
      <Panel size="h-1/2 m-2" title="Portfolio Split Pie Chart">
        <PieChart data={pieData as any}/>
      </Panel>
      <Panel size="h-1/2 m-2" title="Backtesting Returns Line Chart">
          <LineChart data={data} />
      </Panel>
      <Panel size="h-1/2 m-2" title="Performance Line Chart">
          <LineChart data={data} />
      </Panel>      
      <Panel size="h-1/2 m-2" title="Portfolio Correlation Heatmap">
          <HeatMap />
      </Panel>
      <Panel size="h-1/2 m-2" title="Portfolio Covariance Heatmap">
          <HeatMap />
      </Panel>
      <Panel size="h-1/2 m-2" title="KPI Table">
          <KPITable />
      </Panel>
    </div>
  )
}

export default dashboard
