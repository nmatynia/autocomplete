import React from 'react';

import { AutoComplete } from './components/AutoComplete';

function App() {
  return (
    <div className='flex flex-col items-center mt-16'>
      <h1 className='text-4xl font-bold text-center'>Norbert Matynia's AutoComplete</h1>
      <AutoComplete/>
    </div>
  );
}

export default App;
