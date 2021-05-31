<h1 align="center"> margv </h1>
<p align="center">
  <b >margv is a simple (about 2KB ~ 0.8KB gzip) node.js library for parsing process.argv</b>
</p>

## Description
Margv helps you build interactive command line tools, by parsing arguments and generating an elegant cli user interface.

## Installation

```bash
npm i margv
```

## Features

* opt --no-opt -param --param -param=value --param=[1,2] and other formats
* Supports array, object, Map, Set
* Very simple small library
* About 2KB min code
* Focus on usability and performance

```
mocha [spec..]
Run tests with Mocha
```

```bash
$ npm run test
```

## Usage

### Simple Example

```bash
$ touch index.js
```

```javascript
// index.js
const margv = require('margv');
console.log(margv());
```

```bash
$ node ./index.js --opt=4 --width=22
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        '--opt=4',
        '--width=22'
    ],
    '$0': '/var/margv/index.js',
    _: [],
    opt: '4',
    width: '22'
}
```

### String and Numbers

```bash
$ node ./index.js --opt=4 --width=+22 -height +33
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        '--opt=4',
        '--width=+22',
        '-height',
        '+33'
    ],
    '$0': '/var/margv/index.js',
    _: [],
    opt: '4',
    width: 22,
    height: 33

}
```

### Array

```bash
$ node ./index.js --opt=4 --opt=5 --opt=6 arr=[1,2,3,+4]
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        '--opt=4',
        '--opt=5',
        '--opt=6',
        'arr=[1,2,3,+4]'
    ],
    '$0': '/var/margv/index.js',
    _: [],
    opt: [ '4', '5', '6' ],
    arr: [ '1', '2', '3', 4 ]
}
```

### Object

```bash
$ node ./index.js --opt.price=4 --opt.name=test --opt.filter=6 --opt.filter=7 --obj={p:1,v:2}
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        '--opt.price=4',
        '--opt.name=test',
        '--opt.filter=6',
        '--opt.filter=7',
        '--obj={p:1,v:2}'

    ],
    '$0': '/var/margv/index.js',
    _: [],
    opt: { price: '4', name: 'test', filter: [ '6', '7' ] },
    obj: { p: '1', v: '2' }
}
```

### Types and no parse

```bash
$ node ./index.js key --opt=null --value=undefined --test=Infinity --no-param -- no parse
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        'key',
        '--opt=null',
        '--value=undefined',
        '--test=Infinity',
        '--no-param',
        '--',
        'no',
        'parse'

    ],
    '$0': '/var/margv/index.js',
    _: [ 'no', 'parse' ],
    key: true,
    opt: null,
    value: undefined,
    test: Infinity,
    param: false

}
```

### Set and Map

```bash
$ node ./index.js --set Set([1,2,3,4]) --map Map([[test,1]]) 
```
```
{
    '$': [
        '/usr/bin/node',
        '/var/margv/index.js',
        '--set',
        'Set([1,2,3,4])',
        '--map',
        'Map([[test,1]])'
    ],
    '$0': '/var/margv/index.js',
    _: [ 'no', 'parse' ],
    set: Set(4) { '1', '2', '3', '4' },
    map: Map(1) { 'test' => '1' }
}
```