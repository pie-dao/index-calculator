import { Store } from "../types/store";
import sampleData from '../samples/idxCalc.json';
import { createContext, useState } from "react";
import { getBarData } from "../utils/bar";
import { getKpis } from "../utils/table";
import { getPieData, getMctrData } from "../utils/pie";
import { getHeatMapData, getHeatmapKeys } from "../utils/heatmap";
import { addPerformanceToLineData, getLineData, performanceGetter, priceGetter, returnGetter } from "../utils/line";
import { ReducedIndexCalculator } from "../types/indexCalculator";
import { getHeadlines } from "@/utils/headlines";

export type StoreContextProps = {
  store: Store;
  setStore?: (store: Store) => void
}

// Advanced setter function for the store
export const convertToStoreData = (
  indexCalculator: ReducedIndexCalculator
): Store => ({
  lines: {
    performance: addPerformanceToLineData(getLineData(indexCalculator.dataSet, performanceGetter), indexCalculator.performance),
    returns: getLineData(indexCalculator.dataSet, returnGetter),
    price: getLineData(indexCalculator.dataSet, priceGetter),
  },
  heatmaps: {
    covariance: {
      data: getHeatMapData(indexCalculator.dataSet, "token", "covariance"),
      keys: getHeatmapKeys(indexCalculator.dataSet),
      index: "token"
    },
    correlation: {
      data: getHeatMapData(indexCalculator.dataSet, "token", "correlation"),
      keys: getHeatmapKeys(indexCalculator.dataSet),
      index: "token",
    }
  },
  pies: {
    ratio: getPieData(indexCalculator.dataSet),
    mctr: getMctrData(indexCalculator.dataSet),
  },
  tables: {
    kpi: getKpis(indexCalculator.dataSet),
    headlines: getHeadlines(indexCalculator),
  },
  bars: getBarData(indexCalculator.dataSet)
});


export const StoreContext = createContext<StoreContextProps>({
  store: convertToStoreData(sampleData as any),
});

export const StoreContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const storeData = convertToStoreData(sampleData as any);
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