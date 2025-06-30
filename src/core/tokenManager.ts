const socket = new WebSocket('wss://ya-praktikum.tech/ws/chats/<USER_ID>/<CHAT_ID>/<TOKEN_VALUE>');

socket.addEventListener('open', () => {
    console.log('Соединение установлено');

    socket.send(JSON.stringify({
        content: 'Моё первое сообщение миру!',
        type: 'message',
    }));
});

socket.addEventListener('close', event => {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения');
    }

    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
});

socket.addEventListener('message', event => {
    console.log('Получены данные', event.data);
});

socket.addEventListener('error', event => {
    console.log('Ошибка', event.message);
});