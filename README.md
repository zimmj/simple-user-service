# Express Web API skeleton

This Repository consist of an skeleton for a simple web api with a basic layer architecture:

- controller Layer
- service Layer
- data access Layer

THe routes from Controller to the express server are created by the open-api yml contract.
All the defined endpoints need to be implemented with the correct tag name to create a connection.
If one of the routes is missing, the build should fail.

The contract is used to create an automatic validation, this validation need to know all used data-types.
Otherwise the calls will fail.
It is possible to add custom types and exclude special types from validation.
See [Wiki Formats](https://github.com/cdimascio/express-openapi-validator/wiki/Documentation#%EF%B8%8F-formats-optional)

The open-api contract is as well presented under /swagger, where a user can explore the different endpoints.

This skeleton was created with the help of an medium blog post [medium article](https://losikov.medium.com/backend-api-server-development-with-node-js-from-scratch-to-production-fe3d3b860003)

### Development on WSL [See description](https://www.cybertec-postgresql.com/en/postgresql-on-wsl2-for-windows-install-and-setup/)

Install PostgresDB on wsl

```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql postgresql-contrib

psql --version
sudo service postgresql status

sudo service postgresql start
```
