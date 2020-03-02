import React from 'react';

export default function Examples(props: {className?: string, setCode: (arg1: string) => void}) {
    let classNames="examples";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    return (
        <footer className={classNames}>
            <div className="bottom-menu">
                <button onClick={()=>props.setCode(fizzBuzzCode)}>FizzBuzz</button>
                <button onClick={()=>props.setCode(fibonacciCode)}>Fibonacci</button>
                <button onClick={()=>props.setCode(factorialCode)}>Factorial</button>
                <button onClick={()=>props.setCode(factorialCode)}>Factorial2</button>
                <button onClick={()=>props.setCode(factorialCode)}>Factorial3</button>
            </div>
        </footer>
    )
}

export const fizzBuzzCode = `// print fizz buzz for given number
fn print_fizzbuzz(n: i32) {
    mod3 = n % 3 == 0;
    mod5 = n % 5 == 0;
    if mod3 && mod5 {
        print("Fizz Buzz")
    } else if mod3 {
        print("Fizz")
    } else if mod5 {
        print("Buzz")
    } else {
        print(n)
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

export const fibonacciCode = `// print fibonacci numbers
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

fn print_fibs_up_to_n(n: i32) {
    if n > 1 {
        print_fibs_up_to_n( n - 1 );
        0
    };
    print( n, ": ", fib( n ) )
}

fn main() {
    print_fibs_up_to_n( 15 );
    0
}
`;

export const factorialCode = `// print factorial
fn fact(n: i32) {
    if n < 2 {
        1
    } else {
        next = fact(n-1);
        n * next
    }
}

fn main() {
    print(
        fact(5)
    )
}
`;
