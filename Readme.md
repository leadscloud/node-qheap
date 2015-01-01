qheap
=====

fast heap / priority queue / ordered list

qheap implements the classic array-mapped binary tree heap.  A heap is
partially ordered balanced binary tree with the property that the value at the
root comes before any value in either the left or right subtrees.  It supports
two operations, insert and remove, both O(log n) (and peek, O(1)).  The binary
tree can be efficiently mapped into an array; the root is at offset `[1]` and
each node at `[n]` has children left at `[2*n]` and right at `[2*n + 1]`.

Qheap was written to be fast and efficient; it is almost as fast as
[dequeue](https://www.npmjs.com/package/double-ended-queue) but also sorts the
data.  (This probably says more about nodejs than either qheap or dequeue).

        var Heap = require('qheap');
        var h = new Heap({compar: function(a, b) { return a < b ? -1 : 1; }});
        h.insert('c');
        h.insert('a');
        h.insert('b');
        h.remove();     // => 'a'


Installation
------------

        npm install qheap
        npm test qheap


Methods
-------

### new Heap( options )

create a new empty heap.

Options:

        compar  - comparison function to determine the item ordering.  The
                  function should return a value less than zero if the first
                  argument should be ordered before the second (compatible
                  with the function passed to `sort()`).
                  The default ordering is numerically increasing as determined
                  by subtraction:  `function(a,b){ return a - b }`

### insert( item )

insert the item into the heap and rebalance the tree.  Item can be anything,
only the `compar` function needs to know the actual type.

### remove( )

remove and return the item at the root of the heap (the next item in the
sequence), and rebalance the tree.

### peek( )

return the item at the root of the heap, but do not remove it.


Related Work
------------

[js-priority-queue](https://www.npmjs.com/package/js-priority-queue)
[dequeue](https://www.npmjs.com/package/double-ended-queue)
