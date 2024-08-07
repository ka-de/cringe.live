---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: true
title: "lua"
summary: "Lua is a lightweight, high-level, multi-paradigm programming language designed primarily for embedded use in applications."
---

<!--markdownlint-disable MD025 -->

# lua

---

## Introduction

---

**Lua** is a powerful, efficient, lightweight, embeddable scripting language. It supports procedural programming, object-oriented programming, functional programming, data-driven programming, and data description. Lua is designed to be a simple language with extensible semantics as a primary goal. It's a cross-platform language that has a simple syntax with powerful data description constructs.

Lua is widely used in game development. Many popular games like Warframe, World of Warcraft, and Angry Birds were developed using Lua. It's also used in web applications, network programs, and industrial programs like Adobe Lightroom and MySQL Workbench. Lua's speed, portability, simplicity, and flexibility make it a popular choice for such diverse applications.

## Hello World

---

Here is a simple "Hello World" program in Lua:

```lua
print("Hello World!")
```

## Factorial Function Example

---

And here is a slightly more complex example, a function to compute the factorial of a given number:

```lua
-- defines a factorial function
function fact (n)
    if n == 0 then
        return 1
    else
        return n * fact(n-1)
    end
end

print("enter a number:")
a = io.read("*number")  -- read a number
print(fact(a))
```

This program asks the user for a number and prints its factorial. As you can see, Lua's syntax is quite straightforward and easy to understand. This simplicity, along with its power and flexibility, is part of what makes Lua such a popular choice for a wide range of applications.

## Lua Data Structures

---

### Tables

Lua also supports table data structures, which can be used to create arrays, dictionaries, sets, and other data structures. Here's an example of how to use tables in Lua:

```lua
-- create a table
t = {}

-- add elements to the table
t["Hello"] = "World"
t[1] = 100

-- print the elements
print(t["Hello"])  -- prints "World"
print(t[1])  -- prints 100
```

In this example, `t` is a table that can store different types of data. The keys of the table can be strings or numbers. This flexibility makes tables a powerful tool for organizing and managing data in Lua.

### Metatables and Metamethods

Lua provides metatables and metamethods for customizing the behavior of tables.

```lua
local mt = {
    __add = function(a, b)
        return a.value + b.value
    end
}

local t1 = {value = 10}
local t2 = {value = 20}
setmetatable(t1, mt)
setmetatable(t2, mt)

print(t1 + t2)  -- prints 30
```

### Object-Oriented Programming in Lua

Lua doesn't have built-in class support, but you can implement OOP using tables and metatables.

```lua
local Rectangle = {}
Rectangle.__index = Rectangle

function Rectangle.new(width, height)
    local self = setmetatable({}, Rectangle)
    self.width = width
    self.height = height
    return self
end

function Rectangle:area()
    return self.width * self.height
end

local rect = Rectangle.new(5, 10)
print(rect:area())  -- prints 50
```

### First-class Functions

Lua also supports first-class functions, which means that functions can be stored in variables, passed as arguments to other functions, and returned as results from other functions. Here's an example of how to use first-class functions in Lua:

```lua
-- define a function
function add(x, y)
    return x + y
end

-- store the function in a variable
f = add

-- call the function through the variable
print(f(10, 20))  -- prints 30
```

In this example, the function `add` is stored in the variable `f`, and then called through `f`. This feature allows for powerful programming techniques, such as callbacks and closures.

## Popular Lua Libraries

---

### Luarocks

Luarocks is the package manager for Lua. It allows you to easily install and manage Lua modules.

### Lapis (Web Framework)

Lapis is a web framework for Lua that runs on OpenResty.

Installation:

```bash
luarocks install lapis
```

Example usage:

```luaC
local lapis = require("lapis")
local app = lapis.Application()

app:get("/", function()
  return "Welcome to Lapis!"
end)

lapis.serve(app)
```

### Penlight

Penlight is a set of pure Lua libraries focusing on input data handling, functional programming, and OS path management.

Installation:

```bash
luarocks install penlight
```

Example usage:

```lua
local pl = require 'pl'

-- Using Penlight's path module
local path = pl.path
print(path.isfile("example.txt"))

-- Using Penlight's functional module
local func = pl.func
local numbers = {1, 2, 3, 4, 5}
local doubled = func.map(function(x) return x * 2 end, numbers)
pl.pretty.dump(doubled)
```

### LuaSocket

LuaSocket is a networking support library for Lua, providing easy-to-use TCP, UDP, DNS, HTTP, and SMTP support.

Installation:

```bash
luarocks install luasocket
```

Example usage:

```lua
local socket = require("socket")

local host, port = "example.com", 80
local tcp = assert(socket.tcp())
tcp:connect(host, port)
tcp:send("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
local response = tcp:receive("*all")
print(response)
tcp:close()
```

## Lua Development Tools

---

### Stylua

[StyLua](https://github.com/JohnnyMorganz/StyLua) is an opinionated code formatter for Lua 5.1, 5.2, 5.3, 5.4, and Luau. It's built using full-moon and is inspired by the likes of prettier. StyLua parses your Lua codebase and prints it back out from scratch, enforcing a consistent code style. It mainly follows the Roblox Lua Style Guide, with a few deviations.

There are multiple ways to install StyLua:

1. **GitHub Releases**: Pre-built binaries are available on the GitHub Releases [Page](https://github.com/JohnnyMorganz/StyLua/releases). By default, these are built with all syntax variants enabled (Lua 5.2, 5.3, 5.4, and Luau) to cover all possible codebases.

2. **Crates.io**: If you have Rust installed, you can install StyLua using cargo. By default, this builds for just Lua 5.1. You can pass the `--features <flag>` argument to build for Lua 5.2 (`lua52`), Lua 5.3 (`lua53`), Lua 5.4 (`lua54`), or Luau (`luau`).

3. **npm**: StyLua is available as a binary published to npm as `@johnnymorganz/stylua-bin`. This is a thin wrapper which installs the binary and allows it to be run through npm.

4. **Docker**: StyLua is available on the Docker Hub. If you are using Docker, the easiest way to install StyLua is: `COPY  --from=JohnnyMorganz/StyLua:0.20.0 /stylua /usr/bin/stylua`.

5. **Homebrew**: StyLua is available on macOS via the Homebrew package manager.

Once installed, you can use StyLua to format your Lua code. Pass the files to format to the CLI like so: `stylua src/ foo.lua bar.lua`. This command will format the `foo.lua` and `bar.lua` files, and search down the `src` directory to format any files within it.

### Busted (Testing Framework)

Busted is a unit testing framework for Lua with a focus on being easy to use.

Installation:

```bash
luarocks install busted
```

Example usage:

```lua
describe("Factorial", function()
  it("calculates the factorial correctly", function()
    assert.are.equal(120, fact(5))
    assert.are.equal(1, fact(0))
  end)
end)
```

Run tests with:

```bash
busted test_file.lua
```
