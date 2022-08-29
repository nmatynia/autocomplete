import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AxiosResponse } from 'axios';

// https://docs.github.com/en/rest/search#search-users
// https://api.github.com/search/users

//TODO
// - Minimal chars number to initialize search: 3. - DONE

// - Result items are combined and displayed alphabetically using repository and profile name as ordering keys. - DONE

// - Number of result items should be limited to 50 per request. - DONE

// - The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error.

// - The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page).

// - The solution should also display a meaningful snippet of your ability to test the code.

//NOTES
// 403 is bugging the app try doing something with it - DONE
// Make repos alphabetically higher (delete ../.. from repos name (?))
// Make using arrow a thing
// Loading icon - DONE
// Add user photo? Repos / Info ?
// Change 'a' tag placement and its style on hover, focus
// Clicking outside is closing the dropdown
// Make hrefs open another tab with the repo/user - DONE

export const AutoComplete = () => {

  const [search, setSearch] = useState<string>('')
  const [fetchedData, setFetchedData] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null)
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  //Fetching data
  const fetch = async (_search: string, pageLimit: number = 50) => {

    if (_search.length < 3) {
      setError(null)
      setFetchedData([]); 
      return;
    };

    setLoading(true)

    const [users, repos] = await Promise.all([
      axios.get(`https://api.github.com/search/users?q=${_search}&per_page=${pageLimit}`).catch(x => x.response as AxiosResponse),
      axios.get(`https://api.github.com/search/repositories?q=${_search}&per_page=${pageLimit}`).catch(x => x.response as AxiosResponse)
    ]);

    setLoading(false)

    if(users.status === 403 || repos.status === 403){
      setError('API rate limit exceeded')
      return
    }
    else if(users.status !== 200 || repos.status !== 200){
      setError('Error fetching the data')
      return
    }

    setError(null)
    setFetchedData([...users.data.items, ...repos.data.items].sort())
  }
  //

  useEffect(() => {
    fetch(search)
  }, [search])


  return (
    <div className="relative">
      <input
        type='text'
        placeholder='Search for Github users &#38; repos'
        className='w-[500px] h-9 border-[1px] pl-2 mt-16 outline-none rounded border-gray-400 focus-visible:border-gray-800'
        value={search}
        onChange={handleChangeSearch}
      />

      { (fetchedData.length > 0 || loading || error) && 
        <div className={`absolute ${(loading || error) ? 'flex justify-center items-center' : 'overflow-y-scroll '} w-full h-auto max-h-52 overflow-hidden shadow-2xl rounded border-[1px] border-gray-200`}>
          {loading && <LoadingIcon/>}
          {!loading && error && <div className='mx-3 py-3'> {error} </div>}
          {!loading && !error && 
            fetchedData.map((results, idx) => (
              <div key={idx} className='mx-3 py-3 border-b-2 last:border-b-0 border-border-gray-400 hover:text-gray-400'>
                <a href={results.html_url}  target='_blank' rel="noopener noreferrer" className="w-full">
                  {results.login ?? results.full_name}
                </a>
              </div>
            ))
          }
        </div>
      }

    </div>
  )
}

export const LoadingIcon = () => {
  return (
    <div className='w-8 h-8 m-2 border-4 border-t-gray-700 rounded-full animate-spin'></div>
  )
}

