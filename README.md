# QA Automation Technical Challenge
The repo contains the interview challenge solution using Cypress with Javascript

## Getting Started
* Clone this repository
* Navigate to the cloned folder
* Install node and npm using brew install node
* Install the dependencies with respect to this project by `npm install`

## To execute the tests
Define the scripts in package.json as follows :
```
"scripts": {
    "test": "npx cypress run"
  }
```
Finally execute the tests with `npm test`

## Sample Feature file
```
Scenario: Create new advertisement
  Given I navigate to the advertisements page
  When I create new advertisement
  Then I see the advertisement displayed
 ```
 ## Multiple Browser
 Multiple browser is supported by cypress by default. In order to run the tests against any specific browser, try below command
 `npm run -- --browser <Browser name or path eg., chrome, firefox>`
 
 ## Retries
 By default this project is specified to have retry count with 0.
 This can be changed by modifying the environment variable `"RETRIES": 2`, in cypress.json file. 
 If in case you wish to have multiple retries for a specific testcase, you can add the following within the testcases,
 ```
 Cypress.currentTest.retries(RETRY COUNT HERE)
  ```
 ## Reports
 Cucumber Html Reporter.
 
 Run the command `node cucumber-html-reporter.js` after running the tests
 
 Snapshot of HTML report.
 ![image](https://user-images.githubusercontent.com/35001674/177042910-0f4609e6-c902-49e0-b295-cef3f760e923.png)

  
 ## Author
* Aviet Lobo
 

