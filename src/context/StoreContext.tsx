import { Performance, Store } from "../types/store";
import sampleData from '../samples/store.json';
import samplePerformance from '../samples/performance.json';
import { createContext, useState } from "react";
import { getBarData } from "../utils/bar";
import { getKpis } from "../utils/table";
import { getPieData } from "../utils/pie";
import { getHeatMapData, getHeatmapKeys } from "../utils/heatmap";
import { addPerformanceToLineData, getLineData, performanceGetter, priceGetter, returnGetter } from "../utils/line";
import { IndexCalculatorOutput } from "../types/indexCalculator";

export type StoreContextProps = {
  store: Store;
  setStore?: (store: Store) => void
}

const { performance } = samplePerformance;

// Advanced setter function for the store
export const convertToStoreData = (data: IndexCalculatorOutput[], performance: Performance): Store => ({
  lines: {
    performance: addPerformanceToLineData(getLineData(data, performanceGetter), performance),
    returns: getLineData(data, returnGetter),
    price: getLineData(data, priceGetter),
  },
  heatmaps: {
    covariance: {
      data: getHeatMapData(data, "token", "covariance"),
      keys: getHeatmapKeys(data),
      index: "token"
    },
    correlation: {
      data: getHeatMapData(data, "token", "correlation"),
      keys: getHeatmapKeys(data),
      index: "token",
    }
  },
  pies: {
    ratio: getPieData(data)
  },
  tables: {
    kpi: getKpis(data)
  },
  bars: getBarData(data)
});


export const StoreContext = createContext<StoreContextProps>({
  store: convertToStoreData(sampleData, performance as Performance),
});

export const StoreContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const storeData = convertToStoreData(sampleData, performance as Performance);
  const [store, setStore] = useState(storeData);
  console.debug({ store });
  return (
    <StoreContext.Provider value={{
        store,
        setStore,
      }}>
      { props.children }
    </StoreContext.Provider>
  )
}

export default StoreContextProvider