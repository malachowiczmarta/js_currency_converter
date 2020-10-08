let targetCurrency = "";
const select = document.getElementById("selectCurrency");

const loadCurrencyCodeList = async () => {
  try {
    const response = await axios.get(
      "http://api.nbp.pl/api/exchangerates/tables/a/?format=json"
    );

    let codeArr = response.data[0]["rates"];
    codeArr.forEach((element) => {
      let select = document.getElementById("selectCurrency");
      let option = document.createElement("option");
      select.appendChild(option);
      option.innerText = element.code;
      option.value = element.code;
    });
  } catch (error) {
    console.error(error);
  }
};

const multiplyValue = (response, inputMoneyValue) => {
  const currencyValue = response.data.rates[0]["mid"];
  const multiply = currencyValue * inputMoneyValue;

  const twoDecimals = multiply.toFixed(2);
  return `to ${twoDecimals} PLN`;
};

const multiplyTodayValue = async (codetoLowerCase) => {
  const paragraph = document.getElementById("para-result");
  const div = document.querySelector(".para-container");
  const inputMoney = document.getElementById("money-value");
  const inputMoneyValue = inputMoney.value;

  try {
    const response = await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/a/${codetoLowerCase}/today/`
    );

    paragraph.innerText = multiplyValue(response, inputMoneyValue);
  } catch (error) {
    paragraph.innerText = `Kurs walut nie został dziś jeszcze opublikowany. Czy przeliczyć według ostatniego kursu?`;

    const acceptBtn = document.createElement("button");
    acceptBtn.id = "acceptBtn";
    acceptBtn.innerText = "Tak";
    acceptBtn.setAttribute("onclick", "onAcceptBtnClick()");
    div.appendChild(acceptBtn);
  }
};

const multiplyLastValue = async (codetoLowerCase) => {
  const paragraph = document.getElementById("para-result");
  const inputMoney = document.getElementById("money-value");
  const inputMoneyValue = inputMoney.value;
  try {
    const response = await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/a/${codetoLowerCase}/`
    );
    paragraph.innerText = multiplyValue(response, inputMoneyValue);
  } catch (error) {
    console.error(error);
  }
};

window.onload = () => {
  loadCurrencyCodeList();
};

function onCountBtnClick() {
  let codetoLowerCase = targetCurrency.toLowerCase();
  multiplyTodayValue(codetoLowerCase);
}

function onAcceptBtnClick() {
  let codetoLowerCase = targetCurrency.toLowerCase();
  const yesBtn = document.getElementById("acceptBtn");
  yesBtn.remove();
  multiplyLastValue(codetoLowerCase);
}

select.addEventListener("change", (event) => {
  targetCurrency = event.target.value;
});
