Now that we understand how to assign data types to variables as well as how to define our very own data types we can now move on to assigning types to our function arguments as well as the returned data types for our functions. 

Function Arguments

Just like how we would assign a data type to a typical variable in our code, we can also assign data types to function arguments. Take the following example. Take special note to the line where we define our function argument list. 
Javascript
const slugify = ( str : string ) => {
  return str.replace(' ', '-').toLowerCase()
}
const slug : string = slugify("Foo Bar")
console.log( slug )
// Output -> foo-bar
Function Return Types

With every function definition in TypeScript we can also assign a data type to the value we return in that function. The reason why we would want to do this is for better code quality. We can hold ourselves as programmers to a higher standard when defining functions, and enforcing a return value type which would lead to reduced errors at runtime. 

Assigning a data type to a function also helps other programmers to reverse engineer your code base. It makes it easier to understand what is expected back when calling a function. Take the following example and pay close attention to line number one at the end right after our argument list. We can assign a data type to a function by adding a colon ":" after the argument list in our function definition. 
Javascript
const slugify = ( str : string ) : string => {
  return str.replace(' ', '-').toLowerCase()
}
const slug : string = slugify("Foo Bar")
console.log( slug )
// Output -> foo-bar
Its a good practice to just go ahead and define a return type for every function even if you do not plan on returning anything at all. There is actually a primitive type for this specific use case. It is called "void" which tells TypeScript we intend on not returning any value at all. 
Javascript
const sayHello = () : void => {
  console.log("hello!"
}
sayHello()
Other Primitive Types

We also have a few other cool primitive return types we can use such as "none" or "any" even. We can also use the pipe character "|" to tell TypeScript that our data type could be multiple different data types. The pipe character is also referred to as a data type union, and it does not only apply to function return types. Unions can also be used on everyday data types. 
Javascript
function getValue(input: any): string | number | void {
  if (typeof input === "string") {
    return `You provided a string: ${input}`;
  } else if (typeof input === "number") {
    return input * 2;
  }
  // By default, TypeScript will infer this function can only return a string or number.
}
console.log(getValue("Hello")); 
// Output: You provided a string: Hello
console.log(getValue(10));      
// Output: 20