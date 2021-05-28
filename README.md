<h1 align="center"> margv </h1>
<hr>
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

