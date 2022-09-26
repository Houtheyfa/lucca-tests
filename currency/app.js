const fs = require("fs");

const path = process.argv[2];

try {
  const data = fs.readFileSync(path, "utf-8");
  const [from, amount, to, currencyList] = parseFile(data);
  convert(currencyList, from, to, +amount);
} catch (err) {
  console.log(err);
}

/**
 *
 * parse the file data
 * @param {String} data
 * @returns
 */
function parseFile(data) {
  const lines = data.split(/\r\n|\r|\n/g); // split file data per line

  const inputs = lines[0].split(";");
  const length = lines[1];
  const map = new Map();

  // build the currency exchange rate list
  for (let line of lines.splice(2)) {
    const elements = line.split(";");

    if (map.has(elements[0])) {
      map.get(elements[0]).push({ to: elements[1], rate: elements[2] });
    } else {
      map.set(elements[0], [{ to: elements[1], rate: elements[2] }]);
    }

    if (map.has(elements[1])) {
      map.get(elements[1]).push({ to: elements[0], rate: elements[2] });
    } else {
      map.set(elements[1], [
        { to: elements[0], rate: (1 / elements[2]).toFixed(4) },
      ]);
    }
  }

  return [...inputs, map, length];
}

/**
 *
 *
 * @param {Map<string, Array>} list - exchange rates list
 * @param {string} from - initial currency
 * @param {number} amount - amount of money to convert
 * @param {string} to - target currency
 * @returns
 */
function convert(list, from, to, amount) {
  if (!amount || !list.size || !from || !to) {
    console.log("#ERR: invalid inputs!");
    return;
  }

  if (from === to) {
    console.log(amount);
    return;
  }

  const rate = searchRate(list, from, to);
  if (rate) {
    console.log(Math.round(rate * amount), amount * rate);
    return;
  }

  console.error("#ERR: Cannot convert, no match found!");
}

/**
 *
 * lookup for the target currency exchange rate following the shortest path
 *
 * @param {*} map - exchange rates list
 * @param {*} initial - initial currency
 * @param {*} target - target currency
 * @returns {number} - exchange rate
 *
 * based on the Breadth-first search algorithm
 */
function searchRate(map, initial, target) {
  const pool = [];
  const rates = [];
  const checked = [];

  pool.push({ to: initial });
  checked[initial] = true;
  rates[initial] = 1;

  while (pool.length) {
    // check the first currency in the pool
    const currency = pool.shift();

    if (currency.to === target) {
      return rates[target]; // if currency matches the target return its computed rate
    }

    // loop over the adjacent currencies
    for (let adj of map.get(currency.to)) {
      // if adjacent currency is not checkd yet
      if (!checked[adj.to]) {
        checked[adj.to] = true; // mark it as checked
        pool.push(adj); // push it to the pool to be checked later
        rates[adj.to] = (rates[currency.to] * adj.rate).toFixed(4); // compute its exchange rate
      }
    }
  }

  return NaN;
}
