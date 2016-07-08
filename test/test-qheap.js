/**
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

var assert = require('assert');

var Heap = require('../index.js');

module.exports = {
    setUp: function(done) {
        this.cut = new Heap();
        done();
    },

    'package.json should parse': function(t) {
        t.expect(1);
        var json = require('../package.json');
        t.ok(json.main);
        t.done();
    },

    'should expose insert/remove methods': function(t) {
        this.cut.insert(1);
        t.equal(this.cut.remove(), 1);
        t.done();
    },

    'should expose push/shift methods': function(t) {
        this.cut.push(1);
        t.equal(this.cut.shift(), 1);
        t.done();
    },

    'empty heap should return undefined': function(t) {
        assert(this.cut.remove() === undefined);
        t.done();
    },

    'peek should return the first item or undefined': function(t) {
        this.cut.insert(2);
        t.equal(2, this.cut.peek());
        this.cut.insert(1);
        t.equal(1, this.cut.peek());
        this.cut.remove();
        t.equal(2, this.cut.peek());
        this.cut.remove();
        assert(this.cut.peek() === undefined);
        t.done();
    },

    'should update length on insert and remove': function(t) {
        t.equal(0, this.cut.length);
        this.cut.insert(1);
        t.equal(1, this.cut.length);
        this.cut.remove();
        t.equal(0, this.cut.length);
        t.done();
    },

    'heap should return lesser of two': function(t) {
        this.cut.insert(2);
        this.cut.insert(1);
        assert.equal(this.cut.remove(), 1);
        this.cut.insert(3);
        assert.equal(this.cut.remove(), 2);
        assert.equal(this.cut.remove(), 3);
        assert(this.cut.remove() === undefined);
        t.done();
    },

    'heap should use user-provided compar': function(t) {
        var h = new Heap({compar: function(a,b) { return a < b ? 1 : -1 }});
        h.insert(1);
        h.insert(2);
        assert.equal(h.remove(), 2);
        t.done();
    },

    'heap should use user-provided comparBefore': function(t) {
        var h = new Heap({comparBefore: function(a,b) { return b < a }});
        h.insert(1);
        h.insert(2);
        assert.equal(h.remove(), 2);
        t.done();
    },

    'should remove sorted elements in order': function(t) {
        var i, data = [ 1420347223875, 1420347223878, 1420347223879, 1420347223880, 1420347223918 ];
        this.cut.length = data.length;
        for (i=0; i<data.length; i++) this.cut._list[i+1] = data[i];
        for (i=0; i<data.length; i++) t.equal(this.cut.remove(), data[i]);
        t.done();
    },

    'should sort 3 items': function(t) {
        var datasets = [ [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ];
        for (var i=0; i<datasets.length; i++) {
            var data = datasets[i];
            var q = new Heap({size: 4});
            for (var j=0; j<3; j++) q.insert(data[j]);
            t.equal(q.remove(), 1);
            t.equal(q.remove(), 2);
            t.equal(q.remove(), 3);
        }
        t.done();
    },

    'should sort the data': function(t) {
        var i, data = [580, 253, 610, 176];
        var nitems = 100000;
        for (i=0; i<nitems; i++) {
            data[i] = Math.random() * 1000 | 0;
            this.cut.insert(data[i]);
        }
        var ok = this.cut._check();
        t.ok(ok);
        t.equal(this.cut.length, data.length);
        // FIXME: this loop does not detect incorrect orderings...
        var item = this.cut.remove();
        for (i=1; i<nitems; i++) {
            var x = this.cut.remove();
            //assert(x >= item, i + ": " + x + " should be >= " + item);
            assert(x >= item);
            item = x;
        }
        t.equal(this.cut.remove(), undefined);
        t.equal(this.cut.length, 0);
        t.done();
    },

    'fuzz test': function(t) {
        for (var nitems=2; nitems<8; nitems++) {
            for (var loop=0; loop<20000; loop++) {
                var cut = new Heap({size: 4});
                for (var i=0; i<nitems; i++) {
                    // bubbles up new value into correct position after insert
                    cut.insert((Math.random() * 1000 + 1) >> 0);
                    t.ok(cut._check());
                    t.ok(cut.length, i+1);
                }
                for (var i=0; i<nitems; i++) {
                    // bubbles down last element into correct position after remove
                    cut.remove();
                    t.ok(cut._check(), "removing item #" + (i+1) + " with nitems " + nitems);
                }
            }
        }
        t.done();
    },
};
