import React from 'react'
import HeatMap from './components/dashboard/charts/heatMap'
import LineChart from './components/dashboard/charts/lineChart'
import PieChart from './components/dashboard/charts/PieChart'
import Panel from './components/ui/panel'
import store, { KPIs } from '../src/store/store'


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

const KPITable = ({ data }: { data: KPIs[] }): JSX.Element => (
  <div className="overflow-x-auto">
    <table className="table w-full table-compact">
      <thead>
        <tr>
          {
            Object.keys(data[0]).map(k => (<th key={k}>{k}</th>))
          }
        </tr>
      </thead> 
      <tbody>
        {              
          data.map(row => (
            <tr className="hover" key={row.name}>
              {
                Object.values(row).map((item, idx) => (
                  <th key={idx}>
                    {item}
                  </th>
                ))
              }
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
      <div className="stat-title">Total Performance</div> 
      <div className="stat-value text-success">↗︎ 14.7%</div> 
      <div className="stat-desc">Last 30d</div>
    </div> 
    <div className="stat place-items-center place-content-center">
      <div className="stat-title">Balance</div> 
      <div className="stat-value text-success">$1.2M</div> 
    </div> 
    <div className="stat place-items-center place-content-center">
      <div className="stat-title">Variance</div> 
      <div className="stat-value text-error">15%</div> 
      <div className="stat-desc text-error">↘︎</div>
    </div>
  </div>
)


function dashboard() {
  console.debug(store);
  return (
    <div className="h-screen overflow-auto">
      <TitleCard />
      <StatsTable />
      <Panel size="h-1/2 m-2" title="Portfolio Split Pie Chart">
        <PieChart data={store.pies.ratio}/>
      </Panel>
      <Panel size="h-1/2 m-2" title="Backtesting Returns Line Chart">
          <LineChart data={store.lines.returns} />
      </Panel>
      <Panel size="h-1/2 m-2" title="Performance Line Chart">
          <LineChart data={store.lines.performance} />
      </Panel>      
      <Panel size="h-1/2 m-2" title="Portfolio Covariance Heatmap">
          <HeatMap
            data={store.heatmaps.correlation.data}
            keys={store.heatmaps.correlation.keys}
            index={store.heatmaps.correlation.index}
          />
      </Panel>
      <Panel size="h-1/2 m-2" title="Portfolio Covariance Heatmap">
          <HeatMap
            data={store.heatmaps.covariance.data}
            keys={store.heatmaps.covariance.keys}
            index={store.heatmaps.covariance.index}
          />
      </Panel>
      <Panel size="h-1/2 m-2" title="KPI Table">
          <KPITable data={store.tables.kpi} />
      </Panel>
    </div>
  )
}

export default dashboard
