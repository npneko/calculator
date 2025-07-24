const BUTTON_VALUES = [
    "AC", "+/-", "%", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    null, "0", ".", "="
];

const OPERATOR_BUTTONS = ["÷", "×", "-", "+", "="];
const FUNCTION_BUTTONS = ["AC", "+/-", "%"];

const COLORS = {
    OPERATOR: "#FF9500",
    OPERATOR_TEXT: "#FFFFFF",
    FUNCTION: "#D4D4D2",
    FUNCTION_TEXT: "#1C1C1C"
};

let firstOperand = null;
let currentOperator = null;
let waitingForOperand = false;

const displayElement = document.getElementById("display");

function resetCalculator() {
    firstOperand = null;
    currentOperator = null;
    waitingForOperand = false;
    displayElement.value = "0";
}

function updateDisplay(value) {
    const stringValue = String(value);

    if (stringValue == "Infinity" || stringValue === "-Infinity" || stringValue === "NaN") {
        displayElement.value = "Error";
        return;
    }

    displayElement.value = stringValue;
}

function isValidNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function calculate(firstNum, secondNum, operator) {
    switch (operator) {
        case "+":
            return firstNum + secondNum;
        case "-":
            return firstNum - secondNum;
        case "×":
            return firstNum * secondNum;
        case "÷":
            if (secondNum == 0) {
                return "Error";
            }
            return firstNum / secondNum;
        default:
            return secondNum;
    }
}

function handleEqualsOperation() {
    const currentDisplayValue = displayElement.value;

    if (firstOperand == null || currentOperator == null || !isValidNumber(currentDisplayValue)) {
        return;
    }

    const secondOperand = parseFloat(currentDisplayValue);
    const result = calculate(firstOperand, secondOperand, currentOperator);

    updateDisplay(result);

    firstOperand = null;
    currentOperator = null;
    waitingForOperand = true;
}

function handleOperatorInput(operator) {
    const currentDisplayValue = displayElement.value;

    if (firstOperand == null && isValidNumber(currentDisplayValue)) {
        firstOperand = parseFloat(currentDisplayValue);
    }
    else if (currentOperator && !waitingForOperand) {
        const secondOperand = parseFloat(currentDisplayValue);
        const result = calculate(firstOperand, secondOperand, currentOperator);

        updateDisplay(result);
        firstOperand = result;
    }

    currentOperator = operator;
    waitingForOperand = true;
}

function handleNumberInput(digit) {
    const currentDisplayValue = displayElement.value;

    if (waitingForOperand) {
        updateDisplay(digit);
        waitingForOperand = false;
    }
    else if (currentDisplayValue == "0") {
        updateDisplay(digit);
    }
    else {
        updateDisplay(currentDisplayValue + digit);
    }
}

function handleDecimalInput() {
    const currentDisplayValue = displayElement.value;

    if (waitingForOperand) {
        updateDisplay("0.");
        waitingForOperand = false;
    }
    else if (currentDisplayValue.indexOf(".") == -1) {
        updateDisplay(currentDisplayValue + ".");
    }
}

function handleSignToggle() {
    const currentDisplayValue = displayElement.value;

    if (currentDisplayValue == "0" || currentDisplayValue == "" || !isValidNumber(currentDisplayValue)) {
        return;
    }

    if (currentDisplayValue.startsWith("-")) {
        updateDisplay(currentDisplayValue.slice(1));
    } else {
        updateDisplay("-" + currentDisplayValue);
    }
}

function handlePercentage() {
    const currentDisplayValue = displayElement.value;

    if (isValidNumber(currentDisplayValue)) {
        const result = parseFloat(currentDisplayValue) / 100;
        updateDisplay(result);
    }
}

function styleButton(button, value) {
    if (OPERATOR_BUTTONS.includes(value)) {
        button.style.backgroundColor = COLORS.OPERATOR;
        button.style.color = COLORS.OPERATOR_TEXT;
    } else if (FUNCTION_BUTTONS.includes(value)) {
        button.style.backgroundColor = COLORS.FUNCTION;
        button.style.color = COLORS.FUNCTION_TEXT;
    }
}

function createButtonClickHandler(value) {
    return function() {
        if (value === "=") {
            handleEqualsOperation();
        } else if (OPERATOR_BUTTONS.includes(value)) {
            handleOperatorInput(value);
        } else if (value === "AC") {
            resetCalculator();
        } else if (value === "+/-") {
            handleSignToggle();
        } else if (value === "%") {
            handlePercentage();
        } else if (value === ".") {
            handleDecimalInput();
        } else {
            handleNumberInput(value);
        }
    };
}

function createButton(value) {
    const button = document.createElement("button");

    if (value == null) {
        button.style.visibility = "hidden";
        button.setAttribute("aria-hidden", "true");
    } else {
        button.innerText = value;
        button.setAttribute("aria-label", `Button ${value}`);

        styleButton(button, value);

        button.addEventListener("click", createButtonClickHandler(value));
    }

    return button;
}

function initializeCalculator() {
    const buttonsContainer = document.getElementById("buttons");

    if (!buttonsContainer) {
        console.error("Buttons container not found!");
        return;
    }
    
    BUTTON_VALUES.forEach(value => {
        const button = createButton(value);
        buttonsContainer.appendChild(button);
    });

    updateDisplay("0");
}

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", initializeCalculator);
} else {
    initializeCalculator();
}