# Table3

Table tag for MDL/CE that allows you to work with tables.

Here'a a sort list of features we want to see:
- Sort
- Filter
- Column hide/unhide move via D&D
- CRUD
- Inline edit
- Multiple actions
- D&D
...
- And so on...

This tag is intended to work from mobile to big screens...

Let's stop dreaming, and beging to work! :)

Roadmap:

- Render data:
  - [x] [via JS](https://github.com/m3co/table3/commit/f0a18b015cd07f2f2d591e03971afaf42a42651e)
  - [ ] via HTML? does it have any sense?
- Manipulate info
  - [x] [Filter](https://github.com/m3co/table3/commit/0dfd8c3af7d994ad1ce157f6e701324c12de3acd)
  - [x] [Sort](https://github.com/m3co/table3/commit/12dc6d9733d089703026b410f31456a5c171c183)
- CRUD
  - [ ] Create via different methods like ```push```, ```splice```, ```length```...
  - [x] [Update](https://github.com/m3co/table3/commit/5f6a6ac37980e7f95ece31550780e41d19cb5f37)
  - [x] [Read](https://github.com/m3co/table3/commit/69de11704c3fe93eb5f2f9655b25a692ead1ab79)
  - [x] [Delete](https://github.com/m3co/table3/commit/69de11704c3fe93eb5f2f9655b25a692ead1ab79)

## How to use

The tag ```var table = <x-table></x-table>``` has the following properties:

* _data_ property:
```table.data = [ [x1, x2, x3...], [y1, y2, y3...] ...];```

Render a table with values

```
x1  x2  x3...
y1  y2  y3...
...
```

* _filter_ property:
```table.filter = "string";```

Hide these rows which don't contain the string in their text.

* _filtered_ property:
```table.filered;```

Read-only array. Expose only the filtered values where filter is given by ```table.filter = "string";```

* _sort_ property:
```
table.sort = "column1,-column2";
table.sort = ["column1", "-column2"];
var sort = new Set();
sort.add("column1");
sort.add("-column2");
table.sort = sort;
```

This property accepts different formats in comformance with [JSON API sorting](jsonapi.org/format/#fetching-sorting).

* _columns_ property:
```
table.columns = ['Column1', 'Column2', ... 'ColumnN'];
```

Notice that the _columns_ variable is a Set.

## Demo

[Table in CE](http://table3.m3c.space/demo/table-ce.html)
[Table in WC](http://table3.m3c.space/demo/table-wc.html)
