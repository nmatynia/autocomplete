# Github API AutoComplete 👨🏽‍💻 - [link](https://nmatynia.github.io/autocomplete/)
![y5NKF1iJap](https://user-images.githubusercontent.com/84076941/187423923-03a581f2-d831-47bd-8dc1-1656350acc0f.gif)


## Setup
- Install all packages and run `yarn start` if you want to load the app
- Tests can be run using `yarn e2e:run`

## Please read this before usage 🙋🏻‍♂️
- The github API has a very low limit of 10 request per minute. I didn't authenticate my account for the safety reasons (my token would be exposed to public). Sadly unables me to use all API's power which is 50 request per minute. To prevent reaching the limit while in middle of searched phrase I used debounce hook to lower amount of requests.  
- Usually I would decouple my code more, a great example is `fetch` function which I would throw in separate file.  
- I decided to use E2E Cypress test for this project. Why? Because I noticed at your company's notebook that you are using Cypress on a daily basis.  

- The description of the problem that you gave me lacked few details on how you want this to work. So I made my own assumptions.  
One of which is that this component autocompletes only after searched phrase === searched phrase can't be in the middle, only at the beginning. If that is not a intended behaviour, please have a look at this [commit](https://github.com/nmatynia/autocomplete/commit/087a7ac72e75abebdebfec9f7cf9a90d59e9de8c). This is how it looked in practice
![app before alphabetic change](https://user-images.githubusercontent.com/84076941/187422708-d2f2f693-b683-4de0-8018-7a0d3a477f66.gif)

## Tech
- React (CRA)
- TypeScript
- TailwindCSS
- Cypress
- Axios
- useDebounce
-----------------
I would gladly present this project to you, so you better understand my decision-making and problem-solving.  
Please contact me : norbert.matyniaa@gmail.com or call me. 

