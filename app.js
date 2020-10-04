let targetCurrency = "";
const select = document.getElementById("selectCurrency");

const getCurrencyList = async () => {
  try {
    return await axios.get(
      "http://api.nbp.pl/api/exchangerates/tables/a/?format=json"
    );
  } catch (error) {
    console.error(error);
  }
};

const getTodayCurrencyValue = async (codetoLowerCase) => {
  try {
    return await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/a/${codetoLowerCase}/today/`
    );
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

const getLastCurrencyValue = async (codetoLowerCase) => {
  try {
    return await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/a/${codetoLowerCase}/`
    );
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

const loadCurrencyCodeList = async () => {
  const currencies = await getCurrencyList();
  let codeArr = currencies.data[0]["rates"];
  codeArr.forEach((element) => {
    let select = document.getElementById("selectCurrency");
    let option = document.createElement("option");
    select.appendChild(option);
    option.innerText = element.code;
    option.value = element.code;
  });
};

const multiplyTodayValue = async (codetoLowerCase) => {
  const inputMoney = document.getElementById("money-value");
  const inputMoneyValue = inputMoney.value;
  const response = await getTodayCurrencyValue(codetoLowerCase);
  const para = document.getElementById("para-result");
  const div = document.querySelector(".para-container");
  if (response === "Request failed with status code 404") {
    para.innerText = `Kurs walut nie został dziś jeszcze opublikowany. Czy przeliczyć według ostatniego kursu?`;
    const acceptBtn = document.createElement("button");
    acceptBtn.id = "acceptBtn";
    acceptBtn.innerText = "Tak";
    acceptBtn.setAttribute("onclick", "onAcceptBtnClick()");
    div.appendChild(acceptBtn);
  } else {
    const currencyValue = response.data.rates[0]["mid"];
    const multiply = currencyValue * inputMoneyValue;

    const twoDecimals = multiply.toFixed(2);

    para.innerText = `to ${twoDecimals} PLN`;
  }
};

const multiplyLastValue = async (codetoLowerCase) => {
  const inputMoney = document.getElementById("money-value");
  const inputMoneyValue = inputMoney.value;
  const response = await getLastCurrencyValue(codetoLowerCase);

  const paraError = document.getElementById("para-result");

  const currencyValue = response.data.rates[0]["mid"];
  const multiply = currencyValue * inputMoneyValue;

  const twoDecimals = multiply.toFixed(2);

  paraError.innerText = `to ${twoDecimals} PLN`;
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
