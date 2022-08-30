import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { AxiosResponse } from 'axios';
import { useDebounce } from 'use-debounce';

//TODO
// - Minimal chars number to initialize search: 3. - DONE

// - Result items are combined and displayed alphabetically using repository and profile name as ordering keys. - DONE

// - Number of result items should be limited to 50 per request. - DONE

// - The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error. - DONE

// - The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page). -DONE

// - The solution should also display a meaningful snippet of your ability to test the code.

//NOTES
// E2E tests

export const AutoComplete = () => {

  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce<string>(search,400)
  const [fetchedData, setFetchedData] = useState<Array<any>>([])

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); 
    setCursor(-1)
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(fetchedData.length > 0 || loading || !!error);
  const handleClickInput = () => setOpen(true);

  //Click out of the component closes the dropdown
  const clickOutsideRef = useRef<any>();

  useEffect(() => {
    const closeDropdown = (e: any) => {
      if (!clickOutsideRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.body.addEventListener('mousedown', closeDropdown);

    return () => document.body.removeEventListener('mousedown', closeDropdown)
  }, [])
  //

  //Arrows, enter, backspace actions 
  const [cursor, setCursor] = useState<number>(-1);
  const [deviceMode, setDeviceMode] = useState<boolean>(true); // True means that we are using mouse, false that we switched to keyboard control

  const handleOnMouseMove = () => setDeviceMode(true);
  const handleOnMouseEnter = (idx: number) => {
    if(deviceMode) return () => setCursor(idx);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {

    setDeviceMode(false)

    if (e.key === 'ArrowUp' && cursor > 0) {
      setCursor(prevCursor => prevCursor - 1)
    } 
    else if (e.key === 'ArrowDown' && cursor < fetchedData.length - 1) {
      setCursor(prevCursor => prevCursor + 1)
    }
    else if (e.key === 'Enter') {
      window.open(fetchedData[cursor].html_url, '_blank');
    }
    else if (e.key === 'Backspace') {
      if (cursor === -1) return;
      setSearch(fetchedData[cursor].login ?? fetchedData[cursor].name)
      setCursor(-1)
    }

    document.getElementById('item-' + cursor)?.scrollIntoView({ block: "center" });
  }
  //

  const boldString = (item:string) => item.replace(RegExp(search, 'gi'), `<b>$&</b>`);

  // Function passed into sort() so the object can be sorted alphabetically
  const compare = (a: any, b: any) => {
    const _a = ((a.login ?? a.name) as string).toLowerCase()
    const _b = ((b.login ?? b.name) as string).toLowerCase()

    if (_a < _b) {
      return -1;
    }
    if (_a > _b) {
      return 1;
    }
    return 0;
  }
  //

  //Filter results so only the starting one will display
  const filterStartingWithSearch = (items: Array<any>) =>{
    const regex: RegExp = new RegExp('^' + search)
    return items.filter(item => item.login ? !!(item.login.match(regex)) : !!(item.name.match(regex)))
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
    console.log([...users.data.items, ...repos.data.items])
    setFetchedData(filterStartingWithSearch([...users.data.items, ...repos.data.items]).sort(compare))
    console.log(fetchedData)
  }
  //

  useEffect(() => {
    fetch(search)
  }, [debouncedSearch])


  return (
    <div className="relative" id='autocomplete' ref={clickOutsideRef}>
      <input
        type='text'
        placeholder='Search for Github users &#38; repos'
        className='w-[80vw] max-w-[500px] h-9 border-[1px] pl-2 mt-16 outline-none rounded border-gray-400 focus-visible:border-gray-800'
        value={cursor !== -1 ? (fetchedData[cursor].login ?? fetchedData[cursor].name) : search}
        onKeyDown={handleKeyDown}
        onChange={handleChangeSearch}
        onClick={handleClickInput}
      />

      {open &&
        <div 
          onMouseMove={handleOnMouseMove}
          id='dropdown'
          className={`absolute ${(loading || error) ? 'flex justify-center items-center' : 'overflow-y-scroll '} w-full h-auto max-h-52 overflow-hidden shadow-2xl rounded border-[1px] border-gray-200`}
        >
          {loading && <LoadingIcon />}
          {!loading && error && <div className='mx-3 py-3'> {error} </div>}
          {!loading && !error &&
            fetchedData.map((results, idx) => (
              <div
                key={idx}
                id={'item-' + idx}
                className={`p-3 border-b-[1px] last:border-b-0 border-border-gray-400 ${cursor === idx ? 'bg-blue-100' : ''}`}
                onMouseEnter={handleOnMouseEnter(idx)}
              >
                <a
                  href={results.html_url}
                  target='_blank' rel='noopener noreferrer'
                  className='w-full flex items-center focus-visible:outline-none'
                >
                  {results.login ?
                    <>
                      <img src={results.avatar_url} alt="avatar" className='h-8 mr-4' />
                      <p dangerouslySetInnerHTML={{__html: boldString(results.login)}}></p>
                    </>
                    :
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6 m-1 mr-4 fill-gray-500'>
                        <path fillRule="evenodd" d="M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z"></path><path d="M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z"></path>
                      </svg>
                      <p dangerouslySetInnerHTML={{__html: boldString(results.name)}}></p>
                    </>
                  }
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

