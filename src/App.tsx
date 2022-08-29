import React from 'react';

import { AutoComplete } from './components/AutoComplete';

function App() {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl font-bold text-center mt-16'>Norbert Matynia's AutoComplete</h1>
      <AutoComplete/>
    </div>
  );
}

export default App;
