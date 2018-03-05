# Refactoring-Functional-Style-Code
## Set up 
 To load the dependencies run `npm install`

 We have put our code under `src/src/`. 

-`src/src/refactor.js`: This is our main component. It does all refactoring steps for a single js file. 
			This main file refactors the functional style patterns to imperative code and also calculates their cyclomatic complexity, sloc and time taken to execute the codes.

-It takes the given files with functional programs from `in/` and refactors them to `out/`.
   

Our refactoring tool refactors basic functional methods but might give some errors for libraries like minimist, rimraf and so on. However, this does not imply that our tool does not work. The reason is that we have not considered those complex criterias.
