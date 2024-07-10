// Данные о транзакциях
const orders = {

    "06.07": [
        { kol: 6, sum: 3000, stop: 300 },
        { kol: 6, sum: 0, stop: 300 },
        { kol: 1, sum: 1000, stop: 300 },
        { kol: 8, sum: 3500, stop: 0 },
        { kol: 2, sum: 1600, stop: 300 },
        { kol: 1, sum: 600, stop: 300 },
        { kol: 1, sum: 1000, stop: 300 },
        { kol: 1, sum: 1000, stop: 300 }
    ],
    "07.07": [
        { kol: 3, sum: 2400, stop: 300 },
        { kol: 15, sum: 0, stop: 300 },
        { kol: 1, sum: 1000, stop: 300 }
    ],
    "08.07": [
        { kol: 7, sum: 3000, stop: 0 },
        { kol: 1, sum: 250, stop: 0, desc: 'HABIBI' }
    ],
    "09.07": [
        { kol: 1, sum: 800, stop: 300 },
        { kol: 1, sum: 1000, stop: 300 },
        { kol: 5, sum: 700, stop: 300 }
    ]
};



// Форматирование заказов для вывода
function formatOrders(orders) {
    let formatted = "";
    orders.forEach(order => {
        formatted += `- ${order.kol} @ ${order.sum}, STOP: ${order.stop}\n`;
    });
    return formatted.trim();
}

// Вычисление общего количества позиций (AMOUNT)
function totalItems(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.kol;
        });
    }
    return total;
}

// Вычисление общей суммы (SUMMA) всех транзакций
function totalSum(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.sum;
        });
    }
    return total;
}

// Вычисление общей суммы стопов (STOP)
function totalStop(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.stop;
        });
    }
    return total;
}

// Собираем сообщение
const message = `


**06.07 orders:**
APPLE (48.2 Gram)
${formatOrders(orders["06.07"])}

**07.07 orders:**
${formatOrders(orders["07.07"])}

**08.07 orders:**
${formatOrders(orders["08.07"])}

**09.07 orders:**
${formatOrders(orders["09.07"])}

**TOTAL:**
- AMOUNT: ${totalItems(orders)}
- SUMMA: ${totalSum(orders)},
- STOP: ${totalStop(orders)},
- KASSA BALANCE: **${totalSum(orders) - totalStop(orders) - 200} + 270 EUR**
`;

// Выводим сообщение
console.log(message);
