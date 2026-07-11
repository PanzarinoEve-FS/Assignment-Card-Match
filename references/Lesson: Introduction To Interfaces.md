In TypeScript, an interface is a way to define the shape or structure of an object. It acts as a contract that ensures any object adhering to the interface will have certain properties and methods. Interfaces are used to enforce consistency within your code by specifying what properties and types an object must have, without providing implementation details. This makes them a powerful tool for type-checking, helping catch errors early in development by ensuring that objects behave as expected.

An interface can include properties, methods, and optional properties that may or may not exist on an object. In the example below we have a fairly large example, but I just want you to pay attention to the overall data structure and how an interface relates to a class, but differs from a "type." 
Javascript
type BankAccount = {
  name: string;
  account: number;
  routing: number;
  primary: boolean;
}
interface WorksForMoney {
  salary?: number;
  rate?: number;
  banks?: Array<BankAccount>;
  hourlyRate() : number;
}
class Employee implements WorksForMoney {
  name: string
  age: number
  salary?: number
  rate?: number
  banks?: Array<BankAccount>
  constructor({ name, age, salary, rate, banks }) {
    this.name = name
    this.age = age
    this.salary = salary
    this.rate = rate
    this.banks = banks
  }
  hourlyRate(): number {
    if (this.salary > 0.00) {
      return (this.salary / 52) / 40;
    }
    return this.rate
  }
  primaryBankAccount(): BankAccount {
    // return this.banks.find( (bank) => bank.primary )
    for(let i = 0; i < this.banks.length; i++) {
      if (this.banks[i].primary) {
        return this.banks[i]
      }
    }
    return this.banks[0]
  }
}
const employee : Employee = new Employee({
  salary: 100000,
  name: "Foo Bar",
  age: 39,
  rate: 0.00,
  banks: [{
    primary: true,
    account: 420193829137,
    routing: 111000038,
  }]
})
console.log( employee.hourlyRate() )
// Output -> 48.07692307692308
console.log( employee.primaryBankAccount() )
// Output -> { primary: true, account: 420193829137, routing: 111000038 }
I know the above example is quite a lot to take in, but lets break it down. We have a class called Employee. This class will represent any person who is considered an employee to a company. It has a couple of properties and methods. Use the table below to see what each property and method represents.

Class Properties

Name 
Type	Description
age	number	This simple class property is used to hold the age of the employee.
name	string	This property is used to hold the employee's name. 
salary	number	This property is used to hold the employee's salary contract amount (represented as total earned per year).
rate	number	This property is used to hold the employee's hourly contract rate (represented as the total earned per hour). Note that if salary is not set then this hourly rate will be used in its place. 
banks	Array<BankAccount>	This property is used to hold an array collection of ACH  Bank Accounts that belong to the employee and that can be used to pay them with using direct deposit. 
Class Methods

Name
Return Type	Description
hourlyRate	number	This class method checks to see weather or not the salary property is defined and is greater than zero. If so it performs a quick calculation based on 52 weeks worked per year times 40 hours per week to equal the average hourly rate of a salary employee. Otherwise if the rate was set then it simply returns that. 
                                                           primaryBankAccount                                                                                                                                                                                                                                                                                                         	BankAccount	
This method loops through all of the employee's ACH bank accounts and returns the one marked as "primary" in order to use as payment method. 


 
Using Interfaces As Traits

Not only do interfaces allow us to enforce a kind of "contract" for a class to implement, but we can also use an interface to describe a data type when passing arguments through functions. I want you to think of interfaces as a continent way to "tag" a class. For instance we are going to create three different classes to represent three different animals (Fish, Bird, and Duck). All three of these animals have different capabilities. They can either have the capability to swim, fly, walk, or all three. 
Javascript
// Define interfaces for abilities
interface CanFly {
  fly(): void;
}
interface CanSwim {
  swim(): void;
}
interface CanWalk {
  walk(): void;
}
// Define classes that implement these interfaces
class Bird implements CanFly {
  fly() {
    console.log("The bird is flying high in the sky!");
  }
  walk() {
    console.log("The bird is walking low on the ground");
  }
}
class Fish implements CanSwim {
  swim() {
    console.log("The fish is swimming deep in the ocean!");
  }
}
class Duck implements CanFly, CanSwim {
  fly() {
    console.log("The duck is flying short distances.");
  }
  swim() {
    console.log("The duck is swimming calmly on the lake.");
  }
  walk() {
    console.log("The duck is walking low on the ground");
  }
}
// A function that tags characters with abilities and groups them
function activateFlyingAbility(animal: CanFly) {
  animal.fly();
}
function activateSwimmingAbility(animal: CanSwim) {
  animal.swim();
}
function activateWalkingAbility(animal: CanWalk) {
  animal.walk();
}
// Now let's tag our characters and use their abilities
const bird = new Bird();
const fish = new Fish();
const duck = new Duck();
activateFlyingAbility(bird);  
// Output -> The bird is flying high in the sky!
activateWalkingAbility(bird);  
// Output -> The bird is walking low on the ground
activateSwimmingAbility(fish);  
// Output -> The fish is swimming deep in the ocean!
activateFlyingAbility(duck);  
// Output -> The duck is flying short distances.
activateSwimmingAbility(duck);  
// Output -> The duck is swimming calmly on the lake.
activateWalkingAbility(duck);  
// Output -> The duck is walking low on the ground