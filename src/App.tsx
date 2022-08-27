import React from 'react';

import { AutoComplete } from './components/AutoComplete';

//TODO
// - Minimal chars number to initialize search: 3.

// - Result items are combined and displayed alphabetically using repository and profile name as ordering keys.

// - Number of result items should be limited to 50 per request.

// - The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error.

// - The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page).

// - The solution should also display a meaningful snippet of your ability to test the code.

function App() {
  return (
    <div className="flex flex-col items-center mt-16">
      <h1 className="text-4xl font-bold">Norbert Matynia's AutoComplete</h1>
      <AutoComplete/>
    </div>
  );
}

export default App;
