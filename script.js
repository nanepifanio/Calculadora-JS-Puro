// Elements
const inpt = document.querySelector("#numero");
const miniOp = document.querySelector("#show-operations");
const oper = document.querySelectorAll(".operations");
const floatPoint = document.querySelector(".period");
const negate = document.querySelector(".negative");

// Mutable Data
const numbersArray = [];
const operationArray = [];
let resetAfterOp = false;

// Functions Area

const clearArrays = () => {
  numbersArray.length = 0;
  operationArray.length = 0;
};

const showOpOnScreen = (nArr, opArr) => {
  const showInPlaceholder = (result) => {
    if (+result) {
      inpt.placeholder = (+result).toLocaleString("pt-br", {
        style: "decimal",
        minimumIntegerDigits: 1,
      });
    } else {
      inpt.placeholder = result;
    }
  };

  const showMiniOperations = (exp) => (miniOp.innerText = exp);

  inpt.value = "";

  if (nArr.length === 1 && opArr.length === 1) {
    showInPlaceholder(nArr[0]);
    showMiniOperations(`${nArr[0]} ${opArr[0]}`);
    console.log(numbersArray, operationArray);
  } else {
    if (opArr[1] === "=") {
      showInPlaceholder(nArr[2]);
      showMiniOperations(`${nArr[0]} ${opArr[0]} ${nArr[1]} ${opArr[1]}`);
      nArr.splice(0, 1);
      nArr.reverse();
      resetAfterOp = true;
    } else {
      showInPlaceholder(nArr[2]);
      if (nArr[2] === "Impossível" || nArr[2] === "Indeterminado") {
        showMiniOperations(`${nArr[0]} ${opArr[0]} ${nArr[1]}`);
        nArr.splice(0, 2);
        opArr.shift();
        resetAfterOp = true;
      } else {
        opArr.shift();
        showMiniOperations(`${nArr[2]} ${opArr[0]}`);
        nArr.splice(0, 2);
        resetAfterOp = true;
      }
    }
  }
};

const sum = (nArr) =>
  numbersArray.push(nArr.reduce((acu, cur) => +acu + +cur).toString());

const subtr = (nArr) =>
  numbersArray.push(nArr.reduce((acu, cur) => +acu - +cur).toString());

const mult = (nArr) =>
  numbersArray.push(nArr.reduce((acu, cur) => +acu * +cur).toString());

const div = (nArr) => {
  const disableOp = () => {
    oper.forEach((op) => op.setAttribute("disabled", ""));
    floatPoint.setAttribute("disabled", "");
    negate.setAttribute("disabled", "");
  };

  const zeroQuotient = () => {
    disableOp();
    return "Impossível";
  };

  const zeroDivZero = () => {
    disableOp();
    return "Indeterminado";
  };

  numbersArray.push(
    nArr.reduce((acu, cur) => {
      if (+acu && !+cur) return zeroQuotient();
      if (!+acu && !+cur) return zeroDivZero();
      if (Number.isInteger(+acu / +cur)) return String(+acu / +cur);
      return String((+acu / +cur).toFixed(2));
    })
  );
};

const operations = (nArr, op) => {
  switch (op) {
    case "+":
      sum(nArr);
      break;
    case "-":
      subtr(nArr);
      break;
    case "x":
      mult(nArr);
      break;
    case "/":
      div(nArr);
      break;
  }
};

const handleOperation = (el) => {
  const fillNumbersArray = (inp = "0") => numbersArray.push(inp);

  const fillOpArray = (opVal) => operationArray.push(opVal);

  resetAfterOp = false;

  if (el.dataset.value) {
    if (!numbersArray.length && !operationArray.length && inpt.value) {
      fillNumbersArray(inpt.value);
      fillOpArray(el.dataset.value);
      showOpOnScreen(numbersArray, operationArray);
    } else {
      if (
        el.dataset.value.match(/[-+x/=]/) &&
        numbersArray.length === 1 &&
        operationArray.length === 1 &&
        !inpt.value
      ) {
        operationArray.length = 0;
        fillOpArray(el.dataset.value);
        showOpOnScreen(numbersArray, operationArray);
      } else {
        if (!inpt.value && !numbersArray.length) {
          fillNumbersArray();
          fillOpArray(el.dataset.value);
        } else if (!inpt.value) {
          if (operationArray.includes("=")) {
            if (el.dataset.value === "=") {
              operations(numbersArray, operationArray[0]);
              showOpOnScreen(numbersArray, operationArray);
            } else {
              operationArray.pop();
              numbersArray.pop();
              operationArray[0] = el.dataset.value;
              showOpOnScreen(numbersArray, operationArray);
            }
          }
        } else {
          if (operationArray[0] === "=") {
            numbersArray[0] = inpt.value;
            showOpOnScreen(numbersArray, operationArray);
          } else {
            fillNumbersArray(inpt.value);
            fillOpArray(el.dataset.value);
            operations(numbersArray, operationArray[0]);
            showOpOnScreen(numbersArray, operationArray);
          }
        }
      }
    }
  }
};

const checkIfOpIsDisabled = () => {
  const removeDisabled = () => {
    oper.forEach((op) => op.removeAttribute("disabled"));
    floatPoint.removeAttribute("disabled");
    negate.removeAttribute("disabled");
  };

  const isDisabled = () => {
    return (
      Array.prototype.some.call(oper, (op) => op.hasAttribute("disabled")) &&
      floatPoint.hasAttribute("disabled") &&
      negate.hasAttribute("disabled")
    );
  };

  if (isDisabled()) removeDisabled();
};

const clearAll = () => {
  inpt.value = "";
  inpt.placeholder = "0";
  miniOp.innerText = "";
  clearArrays();
  resetAfterOp = false;
  checkIfOpIsDisabled();
};

const setFloatPoint = () => {
  if (!inpt.value) {
    if (operationArray[1] === "=") {
      clearAll();
      inpt.value = "0.";
    } else {
      inpt.value = "0.";
    }
  } else {
    if (!inpt.value.includes(".")) {
      inpt.value += ".";
    }
  }
};

const showNumbersOnScreen = (val) => {
  if (inpt.value === "0" && val === "0") {
    inpt.value = "0";
  } else if (inpt.value === "0" && val !== "0") {
    inpt.value = val;
  } else {
    if (
      (resetAfterOp && operationArray[1]) ||
      numbersArray[0] === "Impossível" ||
      numbersArray[0] === "Indeterminado"
    ) {
      clearAll();
      inpt.value = val;
    } else {
      inpt.value += val;
    }
  }
};

const handleNumber = (el) => {
  checkIfOpIsDisabled();
  el.dataset.value === "0" && !inpt.value.length && !resetAfterOp
    ? (inpt.value = "0")
    : showNumbersOnScreen(el.dataset.value);
};

// Event Listener
document.querySelector("#calc-body").addEventListener("click", ({ target }) => {
  const containClass = (cls) => target.classList.contains(cls);
  if (containClass("numbers")) handleNumber(target);
  if (containClass("operations")) handleOperation(target);
  if (containClass("clear")) clearAll();
  if (containClass("period")) setFloatPoint();
  // if (containClass("negative")) negateNumber();
});
