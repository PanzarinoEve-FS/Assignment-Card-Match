Next up on the TypeScript chopping block are my favorite ingredient: Enums.

An Enum (short for enumeration) is a special data structure that allows you to define a set of named constraints. These constraints represent a fixed collection of values, making your code more readable and easier to maintain. Enums help you group related values under a single type and are particularly useful when you have multiple values or options that can be expressed by clear, descriptive names rather than using arbitrary values like numbers or strings.

TypeScript supports two types of Enums: numeric and string. Numeric enums are the default and automatically assign a unique numeric value to each constraint, starting from 0 by default. For example, if you define an enum Direction with the constraints: Up, Down, Left, and Right. TypeScript will automatically assign Up to 0, Down to 1, and so on. In the code example below you will see how to define a new enum by using the keyword "enum" in TypeScript followed by the name Direction. 
Javascript
enum Direction {
  Up,
  Down,
  Left,
  Right
}
console.log( Direction.Down )
// Output -> 1
String Enumerations



String enums, on the other hand, map each member to a string value. This can be helpful when you want the enum values to be more descriptive and human-readable, like mapping Up to "north" and Down to "south".

Enums in TypeScript allow for safer and more self-documenting code, since you can use these named constants instead of magic values. Additionally, you can use enums as types, so functions can accept and return specific enum members, which provides better type-checking and reduces errors. Enums are a key feature when working with a limited set of options, making code more understandable and robust.
Javascript
enum Direction {
  Up = "north",
  Down = "south",
  Left = "west",
  Right = "east"
}
console.log( Direction.Down )
// Output -> "south"
Enumerations As Data Types

Just as we can define custom data types using the "type" keyword, we can also use enumerations (enums) as data types when defining variables, types, or interfaces (which we'll cover in the next lesson). In the example below, we define three different enums: MapDirection, MapThemeStyle, and MapZoomScale.

We then create a custom data type called Map, which has four properties: center, theme, zoom, and direction. The last three properties are constrained to the corresponding enum values. If we try to assign a value that isn’t part of the specified enum, TypeScript will throw an error.
Javascript
enum MapDirection {
  NORTH,
  SOUTH, 
  EAST,
  WEST
}
enum MapThemeStyle {
  DARK, 
  LIGHT,
  MINIMAL
}
enum MapZoomScale {
  SPACE = 0,
  EARTH = 1,
  CONTINENT = 2,
  COUNTRY_LARGE = 3,
  COUNTRY_MEDIUM = 4,
  COUNTRY_SMALL = 5,
  PROVENCE = 6,
  REGION = 7,
  COUNTY = 8,
  CITY = 9,