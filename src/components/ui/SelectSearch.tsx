import coins from '@/samples/coins.json';
import useSWR from 'swr';
import { Coin } from '@/types/coin'
import Select from 'react-select';
import Fuse from 'fuse.js';
import { useState } from 'react';

const fetcher = (...args: [any]) => fetch(...args).then(res => res.json());

const getOptions = (data: Coin[], query: string): { label: string, value: string }[] => {
  const fuse = new Fuse(data, {
    keys: ['name', 'value'],
    threshold: 0.6
  });
  return fuse
    .search(query)
    .map(({ item }) => ({ value: item.id, label: item.name })) 
};

export const SelectSearch = () => {
  const { data } = useSWR<Coin[], unknown>('https://api.coingecko.com/api/v3/coins/list', fetcher, { fallbackData: coins });
  const [query, setQuery] = useState('');
  const options = getOptions(data!, query).slice(0, 100);
  return (
    <>
      <Select
        className="text-black bg-black"
        options={options}
        placeholder="Type a coin to search"
        onInputChange={e => setQuery(e)}
      />
    </>)
};
