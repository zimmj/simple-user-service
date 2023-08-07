# Simple User service

This is a example project of an simple user service.
A user has following fields.

```yml
user:
  id: uuid
  name: string
  email: string
  password: string
```

As it a simple show of concept project, the password are saved in plain text.

The service consist of three layers:

- controllers
- services
- data layer

This service is written in type-script.
It uses express for it's server functionality.

The [open-api yaml definition](./config/openapi.yml) is used as main contract.
All the defined endpoints are linked to the corresponding function in the controller layer by the package: swagger-routes-express.
The routes are matched via the defined operation Id's.

Validation of the request and response is made with the package: express-openapi-validator.
This automatically validates all data coming in and going for there correctness as described in the open-api yaml.

With this, I can guarantee, that this contract is correctly implemented and other developer can use this yaml to generate the client.

In the data layer, I use drizzle as OMR to connect to the postgres database.
It's a full fletched OMR with migration and allows type safe queries.

## Run with docker

This repository is dockerized, therefore can be build and run with any container tools.

As there is a working compose file, the simplest is to run docker-compose up in the root directory.
It will build the docker container and run the application with a postgres server attached to it.

The postgres database is initialized with the [init.sql](./docker/init.sql).
The content of it is the migration of drizzle

The user service is exposed on the port: 3000.

A good entry point is the [swagger ui](http://localhost:3000/swagger) as you can use it, to call the different endpoints.

To run service run docker compose up in the root directory:

```bash
docker compose up
```

Another option to call the service is to use the provided [postman collection](./content/simple-user-service.postman_collection.json).

The flow of the service is as follows.

1. Create a user
2. Sign in with the user -> get JWT token

With the JWT token you can:

1. List all users
2. Display a user
3. Modify your user
4. Delete your user

## Run it locally

To run this service locally a postgres db need to run.
The database connection need to be given in the file: [.env.dev](./config/.env.dev).
Provide as well the name of the database which should be used.

```yaml
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DATABASE_NAME=simple_user_service
```

Before running the application, the migration need to be run.

```bash
yarn run:migration
```

This creates the needed tables in the database and the service can be started.

To run the application in developer mode:

```bash
yarn dev
```
