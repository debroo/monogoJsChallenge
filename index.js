const https = require('https');

const minimumPrice = 200;
const buildingNumberOfMonogo = 14;
const companyName = 'Monogo';

https.get('https://www.monogo.pl/competition/input.txt', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    data = JSON.parse(data);
    const filteredData = filterData(data);
    const calculatedValue = getValue(filteredData);
    const summedPairs = sumPairs(calculatedValue);
    console.log(calculateResult(summedPairs, calculatedValue));
  });

}).on('error', (err) => {
  console.log('Error: ' + err?.message);
});

function filterData(data) {
  let { selectedFilters, products, colors, sizes } = data;
  return products.map(product => ({
    ...product,
    color: colors.find(color => color.id === product.id).value,
    size: sizes.find(size => +size.id === product.id).value
  })).filter(product => {
    let { color, size } = product;
    return selectedFilters.colors.includes(color) && selectedFilters.sizes.includes(size);
  }).filter(({ price }) => price > minimumPrice);
}

function getValue(filteredProducts) {
  const sorted = filteredProducts.sort((a, b) => a.price - b.price);
  return Math.round(sorted[0].price*sorted[sorted.length -1].price);
}

function sumPairs(value) {
  const valuesArr = String(value).split('').map(Number);
  let arr = [];
  for (let i = 0; i < valuesArr.length; i += 2) {
    arr.push(valuesArr[i] + valuesArr[i + 1]);
  }
  return arr;
}


function calculateResult(valuesArr, calculatedValue) {
  const indexOfBuildingNumber = valuesArr.findIndex( val => val === buildingNumberOfMonogo);
  const companyNameLength = companyName.length;
  return indexOfBuildingNumber * calculatedValue * companyNameLength;
}
