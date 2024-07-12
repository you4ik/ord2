const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process'); // Import exec from child_process


// Замените на ваш токен Telegram-бота
const token = '7446815124:AAH3UirI0n-kFJtaHI4_gndjyB9IkGnODoI';
console.log(`Using bot token: ${token}`);
const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});
// Обработка команды /restart
bot.onText(/\/restart/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Restarting bot...');
    // Перезапуск бота с помощью pm2
    exec('pm2 restart or', (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error restarting bot: ${error.message}`);
            return;
        }
        bot.sendMessage(chatId, 'Bot restarted successfully!');
    });
});
// Чтение файла orders.json
const getOrders = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Функция для фильтрации заказов по диапазону дат
function filterOrdersByDateRange(orders, startDate, endDate) {
    let filteredOrders = {};
    for (let date in orders) {
        if (date >= startDate && date <= endDate) {
            filteredOrders[date] = orders[date];
        }
    }
    return filteredOrders;
}

// Функция для форматирования заказов для вывода
function formatOrders(orders) {
    let formatted = "";
    for (const date in orders) {
        if (Array.isArray(orders[date])) {
            formatted += `**${date} orders:**\n`;
            orders[date].forEach(order => {
                formatted += `- ${order.kol} @ ${order.sum}, STOP: ${order.stop}, ${order.desc || ''}\n`;
            });
            formatted += "\n"; // Добавляем пустую строку между датами
        } else {
            console.error(`Orders for ${date} is not an array:`, orders[date]);
        }
    }
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

// Функция для добавления заказа
function addOrder(date, ordersInput) {
    let orders = parseOrdersInput(ordersInput);
    if (!getOrders[date]) {
        getOrders[date] = [];
    }
    orders.forEach(order => {
        getOrders[date].push(order);
    });
    fs.writeFileSync('orders.json', JSON.stringify(getOrders, null, 4));
    return `Orders added successfully for ${date}: ${JSON.stringify(orders)}`;
}

// Функция для парсинга заказа
function parseOrdersInput(input) {
    return input.split(',').map(orderStr => {
        const [kol, sum] = orderStr.split(' ').map(Number);
        return { kol, sum, stop: 300 };
    });
}
let isRestarting = false;

// Обработка входящих сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const parts = text.split(' ');
    const command = parts[0].toLowerCase();

    if (command === 'add' && parts.length >= 3) {
        const date = parts[1];
        const ordersInput = parts.slice(2).join(' ');
        try {
            const response = addOrder(date, ordersInput);
            bot.sendMessage(chatId, response);
        } catch (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
        }
    } else if (command === 'list') {
        const startDate = parts[1] || '11.07';
        const endDate = parts[2] || '28.07';
        const orders = filterOrdersByDateRange(getOrders, startDate, endDate);
        const message = `
APPLE (49.5 Gram)
${formatOrders(orders)}

**TOTAL:**
- AMOUNT: ${totalItems(orders)}
- SUMMA: ${totalSum(orders)},
- STOP: ${totalStop(orders)},
- KASSA BALANCE: **${totalSum(orders) - totalStop(orders) + 500}SEK + 350 EUR + 80 USDT**
        `;
        fs.writeFileSync('message.txt', message);
        bot.sendMessage(chatId, message);
    } // Обработка команды /restart
    
    
    
    else {
        bot.sendMessage(chatId, '3434p343434m:\n- To add orders: add <date> <orders>\nExample: add 06.07 "1 1000,3 1000"\n- To list orders: list <start_date> <end_date> (defaults to 07.07 08.07)\n- To restart bot: /restart');
    }
});

