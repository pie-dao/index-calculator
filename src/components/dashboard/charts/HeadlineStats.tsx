import { HeadlineStat } from "@/types/indexCalculator";

export default ({ data }: { data: HeadlineStat[] }): JSX.Element => (
  <div className="w-full shadow stats">
    {data.map(d => (
      <div key={d.title} className="stat place-items-center place-content-center">
        <div className="stat-title">{ d. title }</div> 
        <div className={ d.text ? `stat-value ${d.text}` : 'stat-value' }>{ d.value }</div> 
        {d.change && <div className="stat-desc">{ d.change }</div>}
      </div> 
    ))}
  </div>
);
