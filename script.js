/**
 * Calculator App Logic
 * Modularized and separated from HTML
 */

const App = {
    init: function () {
        this.setupTabs();
        this.setupEventListeners();
    },

    setupTabs: function () {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const sections = document.querySelectorAll('.calc-section');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');

                // Update tab buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update sections
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.classList.add('hidden');
                });

                const activeSection = document.getElementById(targetId);
                if (activeSection) {
                    activeSection.classList.remove('hidden');
                    activeSection.classList.add('active');
                }
            });
        });
    },

    setupEventListeners: function () {
        // Mini Calc Buttons
        const miniCalcBtns = document.querySelectorAll('#mini-calc button');
        miniCalcBtns.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (action) {
                btn.addEventListener('click', () => {
                    if (action === 'clear') {
                        MiniCalc.clear();
                    } else {
                        MiniCalc.calculate(action);
                    }
                });
            }
        });

        // Factorial Button
        const factorialBtn = document.getElementById('fc-submit');
        if (factorialBtn) {
            factorialBtn.addEventListener('click', () => {
                FactorialCalc.calculate();
            });
        }

        // Mass Converter Button
        const convertBtn = document.getElementById('msc-convert-btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                MassConverter.convert();
            });
        }

        // Average Calculator
        const avgCalcBtn = document.getElementById('avg-calc-btn');
        const avgClearBtn = document.getElementById('avg-clear-btn');
        if (avgCalcBtn) {
            avgCalcBtn.addEventListener('click', () => AverageCalc.calculate());
        }
        if (avgClearBtn) {
            avgClearBtn.addEventListener('click', () => AverageCalc.clear());
        }

        // Number Sorter
        const sortBtn = document.getElementById('sort-btn');
        const sortClearBtn = document.getElementById('sort-clear-btn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => NumberSorter.sort());
        }
        if (sortClearBtn) {
            sortClearBtn.addEventListener('click', () => NumberSorter.clear());
        }

        // Biggest Number
        const bigBtn = document.getElementById('big-btn');
        if (bigBtn) {
            bigBtn.addEventListener('click', () => BiggestNumber.find());
        }
    }
};

const MiniCalc = {
    getValues: function () {
        return {
            n1: parseFloat(document.getElementById('mc-num1').value),
            n2: parseFloat(document.getElementById('mc-num2').value)
        };
    },
    display: function (val) {
        // Format result if it's a number and has many decimals
        if (typeof val === 'number' && !Number.isInteger(val)) {
            document.getElementById('mc-result').value = parseFloat(val.toFixed(4));
        } else {
            document.getElementById('mc-result').value = val;
        }
    },
    calculate: function (op) {
        const { n1, n2 } = this.getValues();

        if (isNaN(n1) || isNaN(n2)) {
            this.display('Invalid Input');
            return;
        }

        let result;
        switch (op) {
            case 'add': result = n1 + n2; break;
            case 'sub': result = n1 - n2; break;
            case 'mul': result = n1 * n2; break;
            case 'div':
                if (n2 === 0) {
                    this.display('Cannot divide by zero');
                    return;
                }
                result = n1 / n2;
                break;
            default: return;
        }
        this.display(result);
    },
    clear: function () {
        document.getElementById('mc-num1').value = '';
        document.getElementById('mc-num2').value = '';
        document.getElementById('mc-result').value = '';
    }
};

const FactorialCalc = {
    calculate: function () {
        const numInput = document.getElementById('fc-num');
        const num = parseInt(numInput.value);
        const resultOutput = document.getElementById('fc-result');

        if (isNaN(num)) {
            resultOutput.value = "Enter a number";
            return;
        }

        if (num < 0) {
            resultOutput.value = "Invalid number";
            return;
        }

        // Prevent browser crash on massive numbers
        if (num > 170) {
            resultOutput.value = "Infinity (Too large)";
            return;
        }

        resultOutput.value = this.computeFactorial(num);
    },
    computeFactorial: function (n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
};

const MassConverter = {
    convert: function () {
        const amount = parseFloat(document.getElementById('msc-amount').value);
        const fromInput = document.getElementById('msc-from');
        const toInput = document.getElementById('msc-to');

        const fromVal = parseFloat(fromInput.value);
        const toVal = parseFloat(toInput.value);

        if (isNaN(amount)) {
            document.getElementById('msc-result').value = "Enter Amount";
            return;
        }

        // Logic: Convert to base unit (kg) then to target unit
        // HTML values options are mostly factors relative to something, let's verify logic from original.
        // Original logic: amount * (toVal / fromVal)
        // Let's assume the values in HTML are conversion rates relative to a base unit (likely kg, but inverted or straight?).
        // In original HTML:
        // kg = 1
        // Gram = 1000 (meaning 1kg = 1000g ? No, usually conversion factors are used differently).
        // If I have 1 Gram (value 1000) and want Kg (value 1).
        // 1 * (1 / 1000) = 0.001 kg. Correct.
        // If I have 1 Kg (value 1) and want Gram (value 1000).
        // 1 * (1000 / 1) = 1000 g. Correct.
        // It seems the values represent "How many of this unit are in the base unit" OR "How much of the base unit is one of this unit".
        // Actually, if Kg=1 and Gram=1000.
        // Mass = Amount * (To_Rate / From_Rate)
        // 1 kg -> g : 1 * (1000/1) = 1000. Correct.

        const finalResult = amount * (toVal / fromVal);

        // Clean up floating point errors
        document.getElementById('msc-result').value = parseFloat(finalResult.toFixed(6));
    }
};

const AverageCalc = {
    calculate: function () {
        const n1 = parseFloat(document.getElementById("avg-num1").value);
        const n2 = parseFloat(document.getElementById("avg-num2").value);
        const n3 = parseFloat(document.getElementById("avg-num3").value);
        const n4 = parseFloat(document.getElementById("avg-num4").value);

        if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4)) {
            document.getElementById("avg-result").value = "Enter all numbers";
            return;
        }

        const sum = n1 + n2 + n3 + n4;
        const ave = sum / 4;
        document.getElementById("avg-result").value = parseFloat(ave.toFixed(4));
    },
    clear: function () {
        document.getElementById("avg-num1").value = "";
        document.getElementById("avg-num2").value = "";
        document.getElementById("avg-num3").value = "";
        document.getElementById("avg-num4").value = "";
        document.getElementById("avg-result").value = "";
    }
};

const NumberSorter = {
    sort: function () {
        const n1 = parseFloat(document.getElementById("sort-num1").value);
        const n2 = parseFloat(document.getElementById("sort-num2").value);
        const n3 = parseFloat(document.getElementById("sort-num3").value);
        const order = document.getElementById("sort-order").value;

        if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
            document.getElementById("sort-result").value = "Enter all numbers";
            return;
        }

        let numbers = [n1, n2, n3];
        if (order === "asc") {
            numbers.sort((a, b) => a - b);
        } else {
            numbers.sort((a, b) => b - a);
        }
        document.getElementById("sort-result").value = numbers.join(", ");
    },
    clear: function () {
        document.getElementById("sort-num1").value = "";
        document.getElementById("sort-num2").value = "";
        document.getElementById("sort-num3").value = "";
        document.getElementById("sort-result").value = "";
    }
};

const BiggestNumber = {
    find: function () {
        const a = parseFloat(document.getElementById("big-num1").value);
        const b = parseFloat(document.getElementById("big-num2").value);
        const c = parseFloat(document.getElementById("big-num3").value);
        let result = "";

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            result = "Enter all numbers";
        } else if (a == b && b == c) {
            result = `All equal to ${a}`;
        } else if (a === b && a > c) {
            result = `a & b equal (${a}) > c`;
        } else if (b === c && b > a) {
            result = `b & c equal (${b}) > a`;
        } else if (c === a && a > b) {
            result = `c & a equal (${c}) > b`;
        } else if (a > b && a > c) {
            result = `a (${a}) is biggest`;
        } else if (c > a && c > b) {
            result = `c (${c}) is biggest`;
        } else if (b > c && b > a) {
            result = `b (${b}) is biggest`;
        }

        document.getElementById("big-result").value = result;
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
