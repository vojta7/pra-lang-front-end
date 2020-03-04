import React from 'react';

export default function Examples(props: {className?: string, setCode: (arg1: string) => void}) {
    let classNames="examples";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    return (
        <div className={classNames}>
            <button onClick={()=>props.setCode(fibonacciCode)}>Fibonacci</button>
            <button onClick={()=>props.setCode(fizzBuzzCode)}>FizzBuzz</button>
            <button onClick={()=>props.setCode(factorialCode)}>Factorial</button>
            <button onClick={()=>props.setCode(pascalTriangle)}>Pascal triangle</button>
        </div>
    )
}

export const fizzBuzzCode = `// https://en.wikipedia.org/wiki/Fizz_buzz
// print fizz buzz for given number
fn print_fizzbuzz(n: i32) {
    mod3 = n % 3 == 0;
    mod5 = n % 5 == 0;
    if mod3 && mod5 {
        print("Fizz Buzz\\n")
    } else if mod3 {
        print("Fizz\\n")
    } else if mod5 {
        print("Buzz\\n")
    } else {
        print(n,"\\n")
    }
}

// print fizz buzz from current to stop
fn fizzbuzz(current: i32, stop: i32) {
    if current <= stop {
        print_fizzbuzz(current);
        fizzbuzz(current+1, stop)
    }
}

fn main() {
    fizzbuzz(1, 100)
}
`;

export const fibonacciCode = `// https://en.wikipedia.org/wiki/Fibonacci_number
// return fibonacci number n
fn fib(n: i32) {
    res = 1;
    s = 0;
    if ( n > 2 ) {
        res = fib( n - 1 );
        s = fib( n - 2 );
        0
    };
    res + s
}

// print fibonacci numbers from 1 to n
fn print_fibs_up_to_n(n: i32) {
    if n > 1 {
        print_fibs_up_to_n( n - 1 );
        0
    };
    print( n, ": ", fib( n ), "\\n" )
}

fn main() {
    print_fibs_up_to_n( 15 )
}
`;

export const factorialCode = `// return factorial
fn fact(n: i32) {
    if n < 2 {
        1
    } else {
        n * fact(n-1)
    }
}

fn main() {
    print(
        fact(5)
    )
}
`;

export const pascalTriangle = `// https://en.wikipedia.org/wiki/Pascal%27s_triangle
// return factorial
fn fact(n: i32) {
    if n < 2 {
        1
    } else {
        n * fact(n-1)
    }
}

// return binomial coefficient
fn n_over_k(n: i32, k: i32) {
   fact(n) / (fact(k) * fact(n-k))
}

// print pascal number
fn print_pascal_number(row: i32, column: i32) {
  print(n_over_k(row,column));
  if column < row {
    print(" ")
  } else {
    print("\\n")
  }
}

// helper function
fn print_pascal_row_inner(row: i32, column: i32) {
  if column <= row {
    print_pascal_number(row, column);
    print_pascal_row_inner(row, column + 1)
  }
}

// print one row of pascal triangle
fn print_pascal_row(row: i32) {
  print_pascal_row_inner(row, 0)
}

// print pascal triangle
fn print_pascal_triangle(from: i32, to: i32) {
  if from < to {
    print_pascal_row(from);
    print_pascal_triangle(from +1, to)
  }
}

fn main() {
  print_pascal_triangle(0, 8)
}
`;
