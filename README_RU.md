# site2api

Этот небольшой сервер написанный на NodeJS позволяет легко создавать собственные API на основе данных, взятых из сторонних источников. Например, такими источниками могут быть:

- сайты
- другие API
- просто статические данные


# Настройка и запуск (через Docker)

```
git clone https://github.com/poetofcode/site2api.git
cd site2api
npm install
docker compose up
```

Если запуск пройдёт успешно, то в терминале будет такое:

```
Server running: http://127.0.0.1:3000/console
```

На самом деле 3000 - это внутренний порт, на котором запущен сервер в docker-контейнере. Истинный порт, на котором ожидает подключения сервер извне смотрите в файле `docker-compose.yaml`:

```
...
  api:
    build: .
    ports:
      - 80:3000
...
``` 

- по умолчанию равен 80.

Таким образом, вы сможете получить доступ к консоли открыв в браузере:

http://127.0.0.1/console

Вы увидите окно авторизации. По умолчанию данные для входа:

username: `admin`
password: `admin`

Изменить их вы всегда можете на странице редактирования общих настроек:

http://127.0.0.1/console/edit?entity=config&id=0&action=edit


## Настройка без Docker'а

Почти всё будет аналогично предыдущему пункту за исключением команд связанных с Docker'ом и порта. Также потребуется установить [MongoDB](https://www.mongodb.com/docs/v7.0/administration/install-community/).

```
git clone https://github.com/poetofcode/site2api.git
cd site2api
npm install
npm run dev
```

Если всё пройдет успешно, то вы сможете получить доступ к консоли по адресу:

http://127.0.0.1:3000/console

Порт 3000 в данном случае зависит от конфигурации в файле: `config.json`:

```
{
  "dev": {
    "port": 3000,
    "db": {
      "url": "mongodb://127.0.0.1:27017/",
      "name": "site2api"
    }
  },
  "prod": {
    "port": 3000,
    "db": {
      "url": "mongodb://mongo_db:27017/",
      "name": "site2api"
    }
  }
}
```

Это список конфигураций, которые будут зависеть от значения переменной среды: `SITE2API_ENV`
Как видно из конфига выше, она может иметь значения: `dev | prod`.

## Другие команды docker'а

Поднять докер при обновлении кода. Сохраняет кэш, но не для кода:

```
docker compose up --build --abort-on-container-exit --remove-orphans
```

Удалить всё, в том числе кэш:

```
docker system prune -a
```

## Документация по созданию сниппетов

Пример сниппета (парсинг погоды с сайта Gismeteo):

```
async function process(input) {
    let res = (await axios({
          method: 'get',
          url: `https://www.gismeteo.ru/weather-moscow-4368/now/`,
          // data: data,
          maxRedirects: 0
        })).data;
        
    const $ = cheerio.load(res);

    const temp = $(".now-weather .unit_temperature_c").text().trim();
    const humidity = $("div.humidity:nth-child(1) > div:nth-child(2)").text().trim();
    const pressure = $('.unit_pressure_mm_hg').text().trim();

  return { 
      result: "Ok", 
      temperature: temp, 
      humidity: `${humidity}%`,
      pressure: pressure
  };
}
```

Пример POST запроса с отключенным редиректом: 

```
const data = {
        "redirect" : "https://example.org/index.php",
        "login_username": "qwerty",
        "login_password": "qwerty",
      };

const res = (await axios({
      method: 'post',
      url: 'https://example.org/login.php',
      data: data,
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        // "Accept-Charset": "UTF-8",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Accept-Language": "ru,ru-RU,en-US;q=0.8,en;q=0.6",
        "Content-type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36"
      },
      maxRedirects: 0
    }));

```

QUERY- и POST-парметры к эндпоинтам доступны в параметре сниппета: `input`. 
Например:

```
const foo = input.query.foo;
const bar = input.query.bar;

const id = input.params.id;
```

Также в `input` содержитеся хелпер для генерации ошибок:

```
const err = input.makeError('Something went wrong', 'MY_ERROR_CODE');
throw err;
```

А также `input` содержит настройки-параметры общие для проекта. Они настраиваются через консоль при создании/редактировании проекта:

```
{
    "name": "Погода",
    "baseUrl": "gismeteo",
    "params": {
        "baseURL": "https://www.gismeteo.ru/"
    }
}
```

И получение их в коде сниппета:

```
console.log(input.project.params);
```

