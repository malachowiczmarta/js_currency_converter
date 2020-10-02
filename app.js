// const service = axios.create({
//   baseURL: "http://api.nbp.pl/api/exchangerates/tables/a/?format=json",
//   method: "get",
// });
let targetCurrency = "";
console.log(targetCurrency);
const select = document.getElementById("selectCurrency");

window.onload = () => {
  loadCurrencyList();
};

function loadCurrencyList() {
  const getCurrencyList = async () => {
    try {
      return await axios.get(
        "http://api.nbp.pl/api/exchangerates/tables/a/?format=json"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const currencyList = async () => {
    const currencies = await getCurrencyList();
    console.log(currencies.data[0]["rates"]);
    let codeArr = currencies.data[0]["rates"];
    codeArr.forEach((element) => {
      let select = document.getElementById("selectCurrency");
      let option = document.createElement("option");
      select.appendChild(option);
      option.innerText = element.code;
      option.value = element.code;
    });
  };
  currencyList();
}

function onCountBtnClick() {
  console.log(targetCurrency);
  let codetoLowerCase = targetCurrency.toLocaleLowerCase();
  console.log(codetoLowerCase);
  const getCurrencyValue = async () => {
    try {
      return await axios.get(
        `http://api.nbp.pl/api/exchangerates/rates/a/${codetoLowerCase}/?format=json`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const multiplyValue = async () => {
    const inputMoney = document.getElementById("money-value");
    const inputMoneyValue = inputMoney.value;
    const response = await getCurrencyValue();
    console.log(response.data.rates[0]["mid"]);
    const currencyValue = response.data.rates[0]["mid"];
    const multiply = currencyValue * inputMoneyValue;

    const twoDecimals = multiply.toFixed(2);

    const para = document.getElementById("para-result");
    para.innerText = `to ${twoDecimals} PLN`;
  };

  multiplyValue();
}
select.addEventListener("change", (event) => {
  targetCurrency = event.target.value;
});
