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
import HeadlineStats from '@/components/dashboard/charts/HeadlineStats'

function Dashboard() {
  const { store } = React.useContext<StoreContextProps>(StoreContext);
  return (
    <div className="h-screen overflow-auto">
      <TitleCard />
      <HeadlineStats data={store.tables.headlines} />
      <Panel size="h-1/2 m-2 overflow-x-auto" title="Performance Line Chart">
          <LineChart data={store.lines.performance} index='% Change'/>
      </Panel>      
      <Panel size="h-1/2 m-2 overflow-x-auto" title="Backtesting Returns Line Chart">
          <LineChart data={store.lines.returns} index='% Change' />
      </Panel>
      <div className="card bordered m-2" >
        <div className="card-body flex flex-col">
          <h2 className="card-title">Portfolio Split and Risk</h2>       
        </div>
        <div className="flex h-full mb-10 flex-row flex-wrap justify-center items-center">
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3">Starting Asset Ratios:</h3>  
            <PieChart data={store.pies.ratio}/>
          </div>
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3">Marginal Contribution to Total Risk:</h3>
            <PieChart data={store.pies.mctr}/>
          </div>
        </div>
      </div>      
      <div className="card bordered m-2" >
        <div className="card-body flex flex-col">
          <h2 className="card-title">Asset Co-relationships</h2>       
        </div>
        <div className="flex h-full mb-10 flex-row flex-wrap justify-center items-center">
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3">Correlation:</h3>  
            <HeatMap
              data={store.heatmaps.correlation.data}
              keys={store.heatmaps.correlation.keys}
              index={store.heatmaps.correlation.index}
            />
          </div>
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3">Covariance:</h3>
            <HeatMap
              data={store.heatmaps.covariance.data}
              keys={store.heatmaps.covariance.keys}
              index={store.heatmaps.covariance.index}
            />
          </div>
        </div>
      </div>
      <div className="card bordered m-2 p-2">
        <KPITable data={store.tables.kpi} />
      </div>      
      {/* <div className="card bordered m-2">
        <div className="card-body h-full flex flex-col">
          <div className="card title w-full">
            <h1>Summary Bar Charts</h1>
          </div>
          <div className="flex flex-row flex-wrap h-full justify-center items-center">
          {
            Object.entries(store.bars).map(([kpi, data]) => (
              <div key={kpi} className="h-96 max-w-1/2" style={{ minWidth: '500px' }}>
                <BarChart data={data.data} keys={data.keys} index={data.index} />
              </div>
            ))
          }
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard
