import { KPIs } from "../../../types/indexCalculator";
import { largeNumberHandler } from "../../../utils/numberPrecision";

const pretty = (key: string): string => {
  /**
   * Remove underscores, undo snake casing
   */
  const prettyKey = key.replace('_', ' ');
  if (prettyKey === prettyKey.toUpperCase()) return prettyKey;
  const words = prettyKey.match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalize).join(" ");
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.substring(1);

const KPITable = ({ data }: { data: KPIs[] }): JSX.Element => (
  <div className="overflow-x-auto">
    <table className="table w-full table-compact">
      <thead>
        <tr>
          {
            Object.keys(data[0]).map(k => (<th key={k}>{pretty(k)}</th>))
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
