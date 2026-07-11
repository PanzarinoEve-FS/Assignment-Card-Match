Great job making it past week one. In this lesson, we'll explore TypeScript, a superset of JavaScript that brings optional static typing and a host of other features to enhance the development process. By the end of this lesson, students will understand what TypeScript is, why it's used, and how to set it up in a NodeJS project environment.

So What Is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript, adding static types. Created by Microsoft, TypeScript aims to make writing large, complex JavaScript applications more manageable and reliable by catching potential errors at compile time rather than runtime. TypeScript files use the .ts extension and must be compiled into regular JavaScript to be executed in a browser or NodeJS.

Superset of JavaScript: TypeScript includes all JavaScript features but extends it with types, interfaces, enums, and more.
Type Checking: TypeScript introduces type annotations, which allow you to declare variables with specific data types. This helps prevent type-related bugs that often go unnoticed in JavaScript.
Compile-time Checking: TypeScript checks code for errors before it runs, meaning developers catch bugs early in development.
Enhanced IDE Support: Many code editors provide better autocomplete, refactoring tools, and error-checking capabilities when working with TypeScript.
Why Use TypeScript?

Improved Code Quality: The addition of static types makes your code more predictable and less prone to bugs. Errors are detected during the development phase, leading to fewer runtime issues.
Self-documenting Code: Type annotations serve as documentation, making it easier for developers to understand what kind of data is expected in various parts of your application.
Easier Refactoring: Strong typing and the ability to track type changes make refactoring easier and safer.
Interoperability with JavaScript: Since TypeScript is a superset of JavaScript, you can gradually migrate your JavaScript codebase to TypeScript without rewriting everything.
Widespread Adoption: Many popular frameworks (like Angular) and libraries support TypeScript, making it an essential tool for modern web development.
Getting TypeScript Installed

Now that you understand the basics of TypeScript, let’s go through the steps to set it up in a Node.js project.

Step 1: Initialize a new NodeJS project (using npm)

First we need to setup a new NodeJS project using Node Package Manager (npm). Npm comes with a nice little feature for setting up a new project with some boilerplate code. You simply change directory into whatever folder you want your new project to be located inside, then run the following commands (replace <project-name> with whatever name you would like to name your project). Make sure your project name does not have any spaces in it (put hyphens where you want a space).
Bash
cd <directory you want your new project to live>
mkdir <project-name>
cd <project-name>
npm init -y
Step 2: Install TypeScript

Now that you have your new project setup you should notice there is a newly created file inside called "package.json"

Now what you need to do is install TypeScript as an NPM package using the following command.  
Bash
npm install --save-dev typescript
Step 3: Create Your TypeScript Config File

Now you will need to create a new file inside your project and call it "tsconfig.json".

After creating your tsconfig.json file copy/paste the following JSON code inside and save it. 
Javascript
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
Now if you look through the code we copy/pasted above (specifically lines 6 and 7) you will notice references to two different directories. The first being src and the other one dist. TypeScript can be considered a "compiled" language. Which means it takes source code, and it compiles it to a build source. 

src/ - This directory is where all of your code will live. 
dist/ - This is where all of your compiled code will live. You will need to run the final compiled NodeJS files that get saved to this folder using the "node" command. 
But before we can get started we just need to create these two folders in our project first. 
Bash
mkdir src
mkdir dist
touch src/index.ts
Now that's it! You have successfully setup TypeScript on your new project. We could take this setup a lot further by using Nodemon, however all we need to do at this point is to run the TypeScript compiler command "tsc" and it will automatically load in your settings from tsconfig.json file in order to compile your project to your dist folder. 