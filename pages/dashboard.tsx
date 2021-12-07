import React from 'react'
import HeatMap from '../src/components/dashboard/charts/HeatMap'
import LineChart from '../src/components/dashboard/charts/LineChart'
import PieChart from '../src/components/dashboard/charts/PieChart'
import Panel from '../src/components/ui/Panel'
import { StoreContext } from '../src/context/StoreContext'
import BarChart from '../src/components/dashboard/charts/BarChart'
import KPITable from '../src/components/dashboard/charts/KPITable'
import TitleCard from '../src/components/ui/TitleCard'
import { StoreContextProps } from '../src/context/StoreContext'

function Dashboard() {
  const { store } = React.useContext<StoreContextProps>(StoreContext);
  return (
    <div className="h-screen overflow-auto">
      <TitleCard />
      <Panel size="h-1/2 m-2" title="Backtesting Returns Line Chart">
          <LineChart data={store.lines.returns} index='% Change' />
      </Panel>
      <Panel size="h-1/2 m-2" title="Performance Line Chart">
          <LineChart data={store.lines.performance} index='% Change' />
      </Panel>
      <Panel size="h-1/2 m-2" title="Heatmaps">
        <div className="flex flex-row flex-wrap h-full justify-center items-center">
          <div>
            <h1>Portfolio Correlation</h1>
          </div>
          <div className="h-full flex-initial w-1/2" style={{ minWidth: '500px' }}>
          <HeatMap
            data={store.heatmaps.correlation.data}
            keys={store.heatmaps.correlation.keys}
            index={store.heatmaps.correlation.index}
          />
          </div>
        </div>
        <div className="flex flex-row flex-wrap h-full justify-center items-center">
          <div>
            <h1>Portfolio Covariance</h1>
          </div>
          <div className="h-full flex-initial w-1/2" style={{ minWidth: '500px' }}>
          <HeatMap
            data={store.heatmaps.covariance.data}
            keys={store.heatmaps.covariance.keys}
            index={store.heatmaps.covariance.index}
          />
          </div>
        </div>        
      </Panel>
      <Panel size="h-1/2 m-2" title="KPI Table">
          <KPITable data={store.tables.kpi} />
      </Panel>
      <Panel size="h-1/2 m-2" title="Portfolio Split Pie Chart">
        <PieChart data={store.pies.ratio}/>
      </Panel>
      <div className="flex flex-row flex-wrap h-1/2 justify-center items-center">
      <div>
        <h1>Summary Bar Charts</h1>
      </div>
      {
        Object.entries(store.bars).map(([kpi, data]) => (
          // <Panel size="h-1/2 m-2 w-1/2" title={kpi} key={kpi}>
          <div key={kpi} className="h-full flex-initial max-w-1/2" style={{ minWidth: '500px' }}>
            <BarChart data={data.data} keys={data.keys} index={data.index} />
          </div>
          // </Panel>    
        ))
      }
      </div>
    </div>
  )
}

export default Dashboard
