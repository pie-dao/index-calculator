import React from 'react'
import HeatMap from './components/dashboard/charts/HeatMap'
import LineChart from './components/dashboard/charts/LineChart'
import PieChart from './components/dashboard/charts/PieChart'
import Panel from './components/ui/Panel'
import { StoreContext } from '../src/context/StoreContext'
import BarChart from './components/dashboard/charts/BarChart'
import { KPITable } from './components/dashboard/charts/KPITable'
import { TitleCard } from './components/ui/TitleCard'
import { StoreContextProps } from '../src/context/StoreContext'

function dashboard() {
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
      <Panel size="h-1/2 m-2" title="Portfolio Correlation Heatmap">
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
      <Panel size="h-1/2 m-2" title="Portfolio Split Pie Chart">
        <PieChart data={store.pies.ratio}/>
      </Panel>
      {
        Object.entries(store.bars).map(([kpi, data]) => (
          <Panel size="h-1/2 m-2" title={kpi} key={kpi}>
            <BarChart data={data.data} keys={data.keys} index={data.index} />
          </Panel>    
        ))
      }
    </div>
  )
}

export default dashboard
