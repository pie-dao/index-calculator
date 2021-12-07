import { KPIs } from "../../../types/indexCalculator";
import { largeNumberHandler } from "../../../utils/numberPrecision";

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
                    {largeNumberHandler(item)}
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

export default KPITable
