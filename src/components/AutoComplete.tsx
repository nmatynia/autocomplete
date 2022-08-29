import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AxiosResponse } from 'axios';

// https://docs.github.com/en/rest/search#search-users
// https://api.github.com/search/users

//TODO
// - Minimal chars number to initialize search: 3. - DONE

// - Result items are combined and displayed alphabetically using repository and profile name as ordering keys. - DONE

// - Number of result items should be limited to 50 per request. - DONE

// - The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error. - DONE

// - The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page).

// - The solution should also display a meaningful snippet of your ability to test the code.

//NOTES
// 403 is bugging the app try doing something with it - DONE
// Repair sort() - DONE
// Make using arrow a thing
// Loading icon - DONE
// Add user photo? Repos / Info ? - DONE
// Change 'a' tag placement and its style on hover, focus
// Clicking outside is closing the dropdown
// Make hrefs open another tab with the repo/user - DONE
// Stroke on searched phrase ? 

export const AutoComplete = () => {

  const [search, setSearch] = useState<string>('')
  const [fetchedData, setFetchedData] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null)
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  // Function passed into sort() so the object can be sorted alphabetically
  const compare = (a:any, b:any) => {
    const _a = ((a.login ?? a.name) as string).toLowerCase()
    const _b = ((b.login ?? b.name) as string).toLowerCase()
    
    if ( _a < _b ){
      return -1;
    }
    if ( _a > _b ){
      return 1;
    }
    return 0;
  }
  //

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

    if (users.status === 403 || repos.status === 403) {
      setError('API rate limit exceeded')
      return
    }
    else if (users.status !== 200 || repos.status !== 200) {
      setError('Error fetching the data')
      return
    }
    else if ([...users.data.items, ...repos.data.items].length === 0) {
      setError('No user or repository exists')
      return
    }

    setError(null)
    setFetchedData([...users.data.items, ...repos.data.items].sort(compare))
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

      {(fetchedData.length > 0 || loading || error) &&
        <div className={`absolute ${(loading || error) ? 'flex justify-center items-center' : 'overflow-y-scroll '} w-full h-auto max-h-52 overflow-hidden shadow-2xl rounded border-[1px] border-gray-200`}>
          {loading && <LoadingIcon />}
          {!loading && error && <div className='mx-3 py-3'> {error} </div>}
          {!loading && !error &&
            fetchedData.map((results, idx) => (
              <div key={idx} className='mx-3 py-3 border-b-2 last:border-b-0 border-border-gray-400 hover:text-gray-400'>
                {results.login ?
                  <a href={results.html_url} target='_blank' rel='noopener noreferrer' className='w-full flex items-center'>
                    <img src={results.avatar_url} alt="avatar" className='h-8 mr-4' />
                    <p>{results.login}</p>
                    
                  </a>
                  :
                  <a href={results.html_url} target='_blank' rel='noopener noreferrer' className="w-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className='w-8 mr-4 fill-gray-500'>
                      <path fillRule="evenodd" d="M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z"></path><path d="M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z"></path>
                    </svg>
                    <p>{results.name}</p>
                  </a>
                }
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

