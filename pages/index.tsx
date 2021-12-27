import { Option, SelectSearch } from '@/components/ui/SelectSearch'
import { useState } from 'react'
import IndexForm from '../src/components/form'

export default function Home() {
  const [inputValue, setInputValue] = useState<Option>({} as Option);
  const [submit, setSubmit] = useState(0);
  return (
    <div className="hero min-h-screen  bg-base-200">
      <div className="text-center min-w-[50%]	hero-content flex flex-col">
      <div className="w-full shadow-lg rounded-md">
        <SelectSearch
          value={inputValue}
          setValue={setInputValue}
          submit={submit}
          setSubmit={setSubmit}
          />
      </div>
        <div className="card col-span-1 row-span-3 w-full shadow-lg xl:col-span-2 bg-base-100">
          <div className="card-body">
            <h2 className="mt-4 mb-7 text-4xl font-bold card-title">Index Calculator</h2>
            <IndexForm coin={inputValue} submit={submit}/>
          </div>
        </div>
      </div>
    </div>
  )
}
