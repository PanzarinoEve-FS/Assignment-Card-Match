So in ES6 we can use the practice of casting a variable from one type to another. For example we can turn a string of "1.293" into a number by calling "Number()" on it. This is refereed to type casting in most programming languages. In TypeScript type assertions work in the same way, but with some extra features. 

Using type assertions in TypeScript are easy. All we need to do in order to cast one data type to another type is to use the "as" keyword to do the casting. It is important to note that the value of the variable you are asserting must fit the new data type, and must implement the same properties as the type being asserted to. 

Take the following example where we first define a variable with "any" type and immediately we assign a value of a string to it. Then the next line we assert the type of the variable as a string instead of "any". 
Javascript
let someValue: any = "This is a string";
// Type assertion: asserting that 'someValue' is a string
let strLength: number = (someValue as string).length;
console.log(strLength);  // Output: 16