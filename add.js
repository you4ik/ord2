const fs = require('fs');

// Функция для добавления новой записи в файл orders.json
function addOrder(date, orders) {
    // Чтение и парсинг файла orders.json
    let ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

    // Проверяем, есть ли записи для указанной даты, если нет - создаем новый массив
    if (!ordersData[date]) {
        ordersData[date] = [];
    }

    // Добавляем новые записи в массив заказов для указанной даты
    orders.forEach(order => {
        ordersData[date].push(order);
    });

    // Записываем обновленные данные обратно в файл orders.json
    fs.writeFileSync('orders.json', JSON.stringify(ordersData, null, 4));

    console.log(`Orders added successfully for ${date}:`, orders);
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: node addOrder.js <date> <orders>');
    console.error('Example: node addOrder.js 06.07 "1 1000,3 1000"');
    process.exit(1);
}

const date = args[0];
const ordersInput = args[1];

// Преобразуем строку с заказами в массив объектов
const orders = ordersInput.split(',').map(orderStr => {
    const [kol, sum] = orderStr.split(' ').map(Number);
    return { kol, sum, stop: 300 }; // stop default to 300
});

// Добавляем заказы
addOrder(date, orders);
