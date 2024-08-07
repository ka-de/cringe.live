---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: true
title: "Haxe"
summary: "Haxe is a high-level, strictly-typed programming language and compiler that can produce applications and source code for many different platforms from a single code-base."
---

<!--markdownlint-disable MD025 -->

# Haxe

---

## Introduction

---

Haxe is a versatile, high-level programming language that offers developers a unique advantage in cross-platform development. Created by Nicolas Cannasse and first released in 2005, Haxe combines the best features of object-oriented and functional programming paradigms. Its most notable characteristic is its ability to compile to multiple target languages and platforms, including JavaScript, C++, Java, C#, Python, PHP, and even its own virtual machine called HashLink.

One of Haxe's key strengths lies in its strong typing system and powerful macro system, which allow for robust code generation and compile-time optimizations. This makes Haxe particularly well-suited for game development, web applications, and desktop software. The language's syntax is familiar to developers who have experience with languages like ActionScript, Java, or ECMAScript, making it relatively easy to learn for many programmers.

```hx
class Character {
    public var name:String;
    public var health:Int;
    public var level:Int;

    public function new(name:String) {
        this.name = name;
        this.health = 100;
        this.level = 1;
    }

    public function levelUp() {
        level++;
        health += 10;
        trace('$name leveled up! New level: $level, Health: $health');
    }

    public function takeDamage(damage:Int) {
        health -= damage;
        if (health <= 0) {
            trace('$name has been defeated!');
        } else {
            trace('$name took $damage damage. Remaining health: $health');
        }
    }
}

class Main {
    static function main() {
        var hero = new Character("Hero");
        hero.levelUp();
        hero.takeDamage(15);
        hero.levelUp();
        hero.takeDamage(200);
    }
}
```

The code example above demonstrates some of Haxe's features in action. It defines a `Character` class with properties like `name`, `health`, and `level`, along with methods for leveling up and taking damage. The `Main` class shows how to create an instance of the `Character` class and interact with it. This example showcases Haxe's object-oriented capabilities, strong typing (with type annotations like `:String` and `:Int`), and its `trace` function for debugging output. When compiled and run, this code would produce output showing the character leveling up, taking damage, and eventually being defeated.

Haxe's ecosystem includes a package manager called Haxelib, which provides access to a wide range of libraries and frameworks. Popular Haxe frameworks include OpenFL for cross-platform game development framework, Heaps for high-performance game development, and haxe.web for server-side web development. The language's ability to target multiple platforms from a single codebase makes it an attractive choice for developers looking to maximize code reuse and minimize platform-specific development efforts.

## Features

---

Haxe is known for its powerful features that facilitate robust and efficient cross-platform development. Some of these features include:

### Abstract Types

Abstract types allow you to create new types that are represented by an underlying type at runtime, but treated as a distinct type by the compiler.

```hx
abstract Dollars(Float) from Float to Float {
    public function new(value:Float) {
        this = value;
    }

    @:op(A + B)
    public function add(other:Dollars):Dollars {
        return new Dollars(this + other);
    }
}
```

This code defines an abstract type `Dollars` that is represented by a `Float` at runtime. It allows implicit conversion from and to `Float`, and defines a custom addition operator. This demonstrates how abstract types can add type safety and custom behavior to existing types.

### Generics

Generics allow you to write code that works with different types without specifying the exact type in advance.

```hx
class Box<T> {
    public var content:T;
    public function new(content:T) {
        this.content = content;
    }
}
```

`The Box<T>` class can hold any type of content. This demonstrates how generics provide type-safe flexibility, allowing the same class to be used with different types.

### Pattern Matching

Pattern matching allows you to match complex data structures and bind variables in a single operation.

```hx
enum Color {
    Red;
    Green;
    Blue;
    RGB(r:Int, g:Int, b:Int);
}

function describeColor(c:Color):String {
    return switch(c) {
        case Red: "It's red!";
        case Green: "It's green!";
        case Blue: "It's blue!";
        case RGB(r, g, b): 'It\'s RGB($r,$g,$b)';
    }
}
```

This code demonstrates pattern matching on an `enum`. It shows how different cases can be handled, including extracting values from the `RGB` constructor.

### Inlined Calls

Inlining is an optimization technique where the compiler replaces a function call with the function's body, potentially improving performance.

```hx
inline function add(a:Int, b:Int):Int {
    return a + b;
}

function main() {
    var result = add(5, 3); // This call will be inlined
    trace(result);
}
```

The `inline` keyword suggests to the compiler that it should replace calls to `add` with its actual body, potentially reducing function call overhead.

### Conditional Compilation

Allows different code to be compiled based on compilation flags or target platforms.

```hx
class Main {
    public static function main() {
        var dollars = new Dollars(10) + new Dollars(20);
        trace('Total: $dollars');

        var box = new Box<String>("Haxe");
        trace('Box contains: ${box.content}');

        var color = Color.RGB(255, 0, 0);
        trace(describeColor(color));

        #if js
        js.Browser.console.log("This code only compiles for JavaScript");
        #elseif cpp
        Sys.println("This code only compiles for C++");
        #else
        trace("This code compiles for other targets");
        #end
    }
}
```

This code demonstrates how different blocks can be compiled based on the target platform (JavaScript, C++, or others), allowing for platform-specific code within a single codebase.

### Type Inference

Allows the compiler to automatically deduce the type of an expression without explicit type annotations.

```hx
function main() {
    var x = 10; // x is inferred to be Int
    var y = "Hello"; // y is inferred to be String
    var z = [1, 2, 3]; // z is inferred to be Array<Int>
    
    trace(x, y, z);
}
```

This code demonstrates how Haxe can infer the types of `x`, `y`, and `z` without explicit type annotations, based on their initial values.

### Macro System

Haxe also has a robust macro system that allows for powerful metaprogramming. Macros in Haxe are functions that are executed at compile-time, enabling code generation, compile-time checks, and DSL creation.

```hx
import haxe.macro.Expr;
import haxe.macro.Context;

class AutoProps {
    macro public static function build():Array<Field> {
        var fields = Context.getBuildFields();
        for (field in fields) {
            if (field.access.indexOf(AStatic) > -1) continue;
            switch (field.kind) {
                case FVar(t, e):
                    var name = field.name;
                    var capName = name.charAt(0).toUpperCase() + name.substr(1);
                    
                    // Getter
                    fields.push({
                        name: 'get$capName',
                        access: [APublic, AInline],
                        kind: FFun({
                            args: [],
                            expr: macro return this.$name,
                            ret: t
                        }),
                        pos: field.pos
                    });

                    // Setter
                    fields.push({
                        name: 'set$capName',
                        access: [APublic, AInline],
                        kind: FFun({
                            args: [{name: "value", type: t}],
                            expr: macro return this.$name = value,
                            ret: t
                        }),
                        pos: field.pos
                    });

                    field.access.push(APrivate);
                default:
            }
        }
        return fields;
    }
}

@:build(AutoProps.build())
class Person {
    var name:String;
    var age:Int;
}

class Main {
    static function main() {
        var person = new Person();
        person.setName("Alice");
        person.setAge(30);
        trace('${person.getName()} is ${person.getAge()} years old');
    }
}
```

This macro automatically generates getter and setter methods for class fields, demonstrating how Haxe's macro system can be used to reduce boilerplate code.
Haxe's ability to target multiple platforms makes it particularly useful for game development. Frameworks like OpenFL and Heaps allow developers to write games once and deploy them to multiple platforms. Haxe is also used in web development, both on the client-side (compiling to JavaScript) and server-side (using frameworks like tink_web or haxe.web).

## Creating a Haxe Project

---

```bash
# 1. Create a new directory for your project
mkdir my-haxe-project
cd my-haxe-project

# 2. Initialize the project with lix
npm install -g lix  # If you haven't installed lix globally yet
lix init

# 3. Choose a Haxe version for your project
lix use haxe 4.2.5

# 4. Create a src directory for your Haxe source files
mkdir src

# 5. Create a main Haxe file
touch src/Main.hx

# 6. Create a build configuration file
touch build.hxml

# 7. Install any necessary dependencies (example: installing tink_core)
lix install tink_core

# 8. Compile and run your project
lix haxe build.hxml
```

Now, let's add some content to the `Main.hx`:

```hx
package;

class Main {
    public static function main() {
        trace("Hello, Haxe!");
    }
}
```

And the `build.hxml` file:

```markdown
-cp src
-main Main
-js bin/main.js
```

This build configuration tells Haxe to:

- Look for source files in the src directory
- Use Main as the entry point
- Compile to JavaScript and output to bin/main.js

To compile and run your project:

```bash
lix haxe build.hxml
node bin/main.js
```

This will compile your Haxe code to JavaScript and then run it with Node.js.

### Additional Tips for Creating a Haxe Project

#### Version Control

Initialize a git repository in your project directory:

```bash
git init .
```

### .gitignore

Create a .gitignore file to exclude unnecessary files from version control:

```markdown
bin/
.haxelib/
```

### README

Create a `README.md` file to describe your project and how to set it up.

### Testing

Consider setting up a testing framework like utest:

```bash
lix install utest
```

### IDE Support

Many IDEs support Haxe development. Visual Studio Code with the Haxe Extension Pack is a popular choice.

## lix

---

### Introduction to lix

[Lix](https://github.com/lix-pm/lix.client) is a package manager for Haxe that aims to solve some of the issues with the traditional Haxelib package manager. It's designed to provide better dependency management and project isolation, similar to npm for JavaScript or Cargo for Rust.

Key features of lix include:

- Project-local dependency management
- Version locking
- Ability to use different Haxe versions per project
- Support for git dependencies
- Easy sharing of project setups

### Usage Example

Let's go through some example code and commands to demonstrate how to use lix:

```bash
# Install lix globally
npm install -g lix

# Initialize a new Haxe project with lix
mkdir my-haxe-project
cd my-haxe-project
lix init

# Install a Haxe library
lix install haxe-extras

# Install a specific version of a library
lix install haxe-extras 1.2.0

# Install a library from a Git repository
lix install gh:HaxeFoundation/hxnodejs

# Switch Haxe version for the project
lix use haxe 4.2.5

# Install all dependencies defined in haxe_libraries/*.hxml
lix download

# Run a Haxe command using the project-specific Haxe version
lix haxe --main Main --interp

# Create a new hxml file with lix scope
lix scope create development.hxml

# Add a dependency to a specific scope
lix install tink_core --scope development
```

When you use `lix`, it creates a `haxe_libraries` directory in your project. Each library gets its own `.hxml` file in this directory, which specifies the exact version and source of the library.

Lix's approach to dependency management helps ensure that your project remains consistent across different development environments and makes it easier to reproduce builds. It's particularly useful for team projects and when you need to maintain multiple Haxe projects with different dependency requirements.

<!-- Doesn't build
https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#haxe_language_server
## haxe-language-server

[haxe-language-server](https://github.com/vshaxe/haxe-language-server)

-->
