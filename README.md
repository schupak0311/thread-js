# BSA 2019 JS - mini-project Thread

## Технологии

Здесь перечислены основные фреймворки и библиотеки, используемые в проекте. Полный список используемых технологий для каждой части проекта находится в файлах package.json в папках client и server.

#### Common
1. ES2018
2. [Git](https://git-scm.com/book/ru/v1/%D0%92%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5-%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D1%8B-Git "Git")
3. [REST API](https://www.restapitutorial.com/lessons/restquicktips.html "REST API")
4. [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token "JWT")
5. [Socket.IO](https://socket.io/docs/ "Socket.IO")
6. [npm](https://en.wikipedia.org/wiki/Npm_(software))
7. [ESLint](https://eslint.org/docs/user-guide/getting-started "ESLint")

#### Frontend
1. [React](https://reactjs.org/docs/getting-started.html "React")
2. [React Redux](https://redux.js.org/introduction/getting-started "React Redux")
3. [React Semantic UI](https://react.semantic-ui.com/ "React Semantic UI")
4. [Moment.js](https://momentjs.com/ "Moment.js")
5. [validator.js](https://www.npmjs.com/package/validator "validator.js")
6. [history](https://www.npmjs.com/package/history "history")

#### Backend
1. [Node.js](https://nodejs.org/en/ "Node.js")
2. [Express](https://expressjs.com/ru/guide/routing.html "Express")
3. [Passport.js](http://www.passportjs.org/docs/ "Passport.js")
4. [Sequelize](http://docs.sequelizejs.com/ "Sequelize")
5. [axios](https://www.npmjs.com/package/axios "axios")
6. [bcrypt](https://www.npmjs.com/package/bcrypt "bcrypt")
7. [Babel](https://babeljs.io/docs/en/index.html "Babel")
8. [nodemon](https://www.npmjs.com/package/nodemon "nodemon")
9. [dotenv](https://www.npmjs.com/package/dotenv "dotenv")
10. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken "jsonwebtoken")

#### Database
1. [PostgreSQL](https://www.postgresql.org/download/ "PostgreSQL")

## Установка

1. Установить последнюю стабильную версию [Node.js](https://nodejs.org/en/ "Node.js") (LTS). **Note:** npm будет установлен автоматически. Проверьте корректность установки: для этого выполните в командной строке (терминале):

    ```
   node -v  // для проверки версии Node.js
   npm -v // для проверки версии npm
    ```
    
2. Установить последнюю стабильную версию [PostgreSQL](https://www.postgresql.org/download/ "PostgreSQL") для вашей OS. Проверьте корректность работы - попробуйте создать базу, таблицу, - для этого можете использовать [pgAdmin](https://www.pgadmin.org/ "pgAdmin") или другой удобный способ, который найдете.

3. Создайте в PostgreSQL **пустую** базу данных для проекта. Например, *thread*.

4. Установите Git.

5. Склонировать [репозиторий](https://github.com/BinaryStudioAcademy/thread-js) проекта:

    ```
    git clone git@github.com:BinaryStudioAcademy/thread-js.git
    ```
    
#### Backend

1. В командной строке (терминале) зайдите в папку server:

    ```
    cd /* путь к папке server */
    ```

2. Установите все необходимы пакеты из package.json командой:

    ```
    npm install
    ```

3.  В папке server создайте файл **.env** и скопируйте в него содержимое из файла **.env.example**.

	**Note**: файл **.env** содержит реальные ключи проекта и не должен сохраняться в репозиторий.

	Замените в файле **.env** значения ключей на действительные.
	Для того, чтобы указать ключи для Imgur Storage, необходимо зарегистрироваться на сайте [Imgur](https://imgur.com/register "Imgur") и [зарегистрировать приложение](https://api.imgur.com/oauth2/addclient) указав *Anonymous usage without user authorization*. Затем в настройках профиля найдете ключи для Storage.

4. Выполните [миграции](http://docs.sequelizejs.com/manual/migrations.html#running-migrations "миграции") и сиды для того, чтобы заполнить базу данных демо-данными. Для этого в командной строке (терминале) в папке server выполните:

    ```
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```
    
	Проверьте базу данных на наличие демо-данных.

5. Для запуска сервера в командной строке (терминале) в папке сервера выполните:

    ```
    npm start
    ```

#### Frontend

1. В командной строке (терминале) зайдите в папку client:

    ```
    cd /* путь к папке client */
    ```

2. Установите все необходимы пакеты из package.json командой:

    ```
    npm install
    ```

3.  В папке client создайте файл **.env** и скопируйте в него содержимое из файла **.env.example**.

	**Note**: файл **.env** содержит реальные ключи проекта и не должен сохраняться в репозиторий.

	Замените в файле **.env** значения ключей на действительные.
    
4. Для запуска клиента в командной строке (терминале) в папке клиента выполните:

    ```
    npm start
    ```
