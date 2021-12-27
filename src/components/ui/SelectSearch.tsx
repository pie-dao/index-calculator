import coins from '@/samples/coins.json';
import useSWR from 'swr';
import { Coin } from '@/types/coin'
import Select, { components, InputProps, MultiValue, SingleValue } from 'react-select';
import Fuse from 'fuse.js';
import { useState, useRef } from 'react';

export type Option = { label: string, value: string };

const fetcher = (...args: [any]) => fetch(...args).then(res => res.json());

const getOptions = (data: Coin[], query: string): Option[] => {
  const fuse = new Fuse(data, {
    keys: ['name', 'value'],
    threshold: 0.6
  });
  return fuse
    .search(query)
    .map(({ item }) => ({ value: item.id, label: item.name })) 
};

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

export const SelectSearch = (props: {
    value: Option, setValue: (val: Option) => void,
    submit: number, setSubmit: (num: number) => void,
  }) => {
  const { data } = useSWR<Coin[], unknown>('https://api.coingecko.com/api/v3/coins/list', fetcher, { fallbackData: coins });
  const { value, setValue } = props;
  const [inputValue, setInputValue] = useState('');
  const options = getOptions(data!, inputValue).slice(0, 30);
  const selectRef = useRef();
  
    const onInputChange = (inputValue: string, { action }: { action : string }) => {
      if (action === "input-change") {
        setInputValue(inputValue);
      }
    };
  
    const onChange = (option: Option | any) => {
      if (option) {
        setValue(option);
        props.setSubmit(props.submit + 1);
      }
      setInputValue(option ? option.label : "");
    };

    return (
        <Select
          className="text-black min-w-full bg-black text-left"
          ref={selectRef as any}
          options={options}
          isClearable={true}
          placeholder="Search and add coin from the Coingecko API"
          value={value}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onChange={o => onChange(o)}
          controlShouldRenderValue={false}
          components={{ Input }}
        />
    );
  }
  