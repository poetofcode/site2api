# site2api

This small server written in NodeJS allows you to easily create your own APIs based on data taken from third-party sources. For example, such sources could be:

- websites
- other APIs
- just static data


# Setup and launch (via Docker)

```
git clone https://github.com/poetofcode/site2api.git
cd site2api
npm install
docker compose up
```

If the launch is successful, the terminal will display something like this:

```
Server running: http://127.0.0.1:3000/console
```

In fact, 3000 is the internal port on which the server is running in the docker container. For the true port on which the server listens for connections from outside, see the `docker-compose.yaml` file:

```
...
   api:
     build: .
     ports:
       - 80:3000
...
```

- default is 80.

Thus, you can access the console by opening in your browser:

http://127.0.0.1/console

You will see an authorization window. Default login details:

username: `admin`
password: `admin`

You can always change them on the general settings editing page:

http://127.0.0.1/console/edit?entity=config&id=0&action=edit


## Setting up without Docker

Almost everything will be similar to the previous point, with the exception of Docker-related commands and the port. You will also need to install [MongoDB](https://www.mongodb.com/docs/v7.0/administration/install-community/).

```
git clone https://github.com/poetofcode/site2api.git
cd site2api
npm install
npm run dev
```

If everything goes well, you will be able to access the console at:

http://127.0.0.1:3000/console

Port 3000 in this case depends on the configuration in the file: `config.json`:

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

This is a list of configurations that will depend on the value of the environment variable: `SITE2API_ENV`
As can be seen from the config above, it can have the following values: `dev | prod`.

## Other docker commands

Show running containers:

```
docker ps -a
```

Show console log of containers: 

```
docker logs <container id>
```

Bring up docker when updating code. Saves cache, but not for code:

```
docker compose up --build --abort-on-container-exit --remove-orphans
```

Delete everything, including the cache:

```
docker system prune -a
```

## Documentation for creating snippets

Example snippet (weather parsing from the Gismeteo website):

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

Example of a POST request with redirect disabled:

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

QUERY and POST parameters to endpoints are available in the snippet parameter: `input`.
For example:

```
const foo = input.query.foo;
const bar = input.query.bar;

const id = input.params.id;
```

`input` also contains a helper for generating errors:

```
const err = input.makeError('Something went wrong', 'MY_ERROR_CODE');
throw err;
```

And also `input` contains settings-parameters common to the project. They are configured via the console when creating/editing a project:

```
{
     "name": "Weather",
     "baseUrl": "gismeteo",
     "params": {
         "baseURL": "https://www.gismeteo.ru/"
     }
}
```

And getting them in the snippet code:

```
console.log(input.project.params);
```