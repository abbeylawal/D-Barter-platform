// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library CounterLib {
    struct Counter {
        uint256 _value; // default: 0
    }

    // Returns the current value of the counter
    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    // Increments the counter by 1
    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    // Decrements the counter by 1 with an underflow check
    function decrement(Counter storage counter) internal {
        require(counter._value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value -= 1;
        }
    }

    // Resets the counter to 0
    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
