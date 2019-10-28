### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `Project overview`
- The goal for this project is to create an Interest Rates calculator feature using the Heroku API which provides the monthly EMI rate and Interest rate. 
- Users should be able to enter the amount and duration of the loan in the Input field.
- Users should be able to select the amount and duration using the slider provided below the Input field.
- The amount and duration provide must be between $500 to $5000 for amount and 6 to 24 for duration.
- Upon getting both the value in the expected format a call to Heroku API should happen and it must give the interest rate and Monthly EMI rate.
- After successful API call, display the Interest rate, cache the search data for later use which will be available in the sidebar.

### `Structure overview`
Frontend Stack: React JS
- Since it is a single page and no scroll application all the code related to the project is in the App.js file and it is been imported in the index.js file (Which is the entry file)
- All styling related to the project is in the App.css file

### `State management`
- We have two key data to be stored - Amount and Duration. Rest other state data will change depending on this data, so that will be handled using component state.
- As the requirement is to store the key data in local storage and the project is a single page application, the application level state management(like Redux...) is not need.
- Whenever a new valid search happens, the data(Amount and duration) is stored in local storage.

### `Libraries and packages`
- jQuery - Javscript library.
- Bootstrap - CSS Framework
- rc-slider - Node package for slider function.

### `Functonality flow`
FLow 1 : Valid Amount and valid Duration(Entered using slider, Input field) -> API call -> Display output tab and result -> Store data in local storage.
Flow 2 : Amount and Duration picked from recent search list -> API call -> Display output tab and result.
Flow 3 : Invalid Amount and Duation -> Invalid error message -> Hide output tab.
Flow 4 : Upon correcting the valid input data -> Display output tab and result -> Store data in local storage.

### `Deployment`
1. Heroku login
2. Setup Heroku remote 
3. git add .
4. git commit -m "commit message"
5. git push heroku master

