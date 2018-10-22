const Json2csvParser = require('json2csv').Parser;
const Json2csvTransform = require('json2csv').Transform;

const fields = ['car.make', 'car.model', 'price', 'color'];
const myCars = [
  {
    "car": {
      "make": "Audi",
      "model": "A3"
    },
    "price": 40000,
    "color": "blue"
  },
  {
    "car": {
      "make": "BMW",
      "model": "F20"
    },
    "price": 35000,
    "color": "black"
  },
  {
    "car": {
      "make": "Porsche",
      "model": "9PA AF1"
    },
    "price": 60000,
    "color": "green"
  }
];

// const json2csvParser = new Json2csvParser({ fields });
// const csv = json2csvParser.parse(myCars);
// console.log(csv);

const opts = {fields};
const transformOpts = {highWaterMark: 16384, encoding: 'utf-8'};

const json2csv = new Json2csvTransform(opts, transformOpts);

const Readable = require('stream').Readable;
const input = new Readable({objectMode: true});
input._read = () => {
};

const fs = require('fs');
const wstream = fs.createWriteStream('myOutput.csv');

input.pipe(json2csv).pipe(wstream);
// input.push('hello 1');
// input.push('hello 2');
// input.push('hello 3');
input.push(JSON.stringify(myCars[0]));
input.push(JSON.stringify(myCars[1]));
input.push(JSON.stringify(myCars[2]));

//
// const opts = {};
// const transformOpts = { objectMode: true };
//
// const json2csv = new Json2csvTransform(opts, transformOpts);
// const processor = input.pipe(json2csv).pipe(process.stdout);
//
// input.push('your text here');
input.push(null);