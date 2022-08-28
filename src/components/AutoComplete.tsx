import React, { useEffect, useState } from 'react'
import axios from 'axios'

// https://docs.github.com/en/rest/search#search-users
// https://api.github.com/search/users

export const AutoComplete = () => {
  const [search, setSearch] = useState<string>('')
  const [fetchedData, setFetchedData] = useState<Array<any>>([])

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const fetch = (_search: string) => {
    setFetchedData([])

    if(_search.length < 2) return;

    Promise.all(
      [
        axios.get(`https://api.github.com/search/users?q=${_search}&per_page=50`).then(res => res.data.items),
        // axios.get(`https://api.github.com/search/repositories?q=${_search}&per_page=50`).then(res => res.data.items)
      ]
    ).then(responses => {
      for (const response of responses) {
        setFetchedData(fetchedData.concat(response))
      }
    })
  }

  useEffect(() => {
    fetch(search)
  }, [search])

  return (
    <div className="relative">
      <input
        type='text'
        className='w-[500px] h-9 border-2 pl-2 mt-16 outline-none rounded border-gray-400 focus-visible:border-gray-800'
        value={search}
        onChange={handleChangeSearch}
      />

      <div className='absolute w-full h-52 overflow-hidden overflow-y-scroll shadow-2xl rounded'>
        {fetchedData.map((results,idx)=>(
          <div key={idx} className='m-3 border-b-2 last:border-b-0 border-border-gray-400'>
            {results.login}
          </div>
        ))}
      </div>

    </div>
  )
}
