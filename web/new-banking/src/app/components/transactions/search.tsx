import { Input } from '@/components/ui/input';
import React, { SetStateAction, useState } from 'react';

type SearchProps = {
  filter: string;
  setFilter: React.Dispatch<SetStateAction<string>>;
};

function Search({ filter, setFilter }: SearchProps) {
  return (
    <input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder='search..'
    />
  );
}

export default Search;
