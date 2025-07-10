# Installation Notes

As of Oct. 18th, this code is making a full round-trip reading from
the Azure blob storage. However, installing it and using it
is fragile.

The basic command for funning the back end sot aht the front end
can try to use it is:

> npm run start

However, you will probably also need to sign into Azure using:

> az login

This also means that as a developer, you need to contact us and
have an Azure account which has been given permission on our blob storage.

Note: Sometimes your login may time out---this can create a confusing
situaiton.


## Environment Variables

Create a `.env` file in the `packages/back-end` directory with the following required variables:

### PostgreSQL

PGHOST=your_postgres_host
PGUSER=your_db_username
PGPASSWORD=your_db_password
PGDATABASE=your_database_name
PGPORT=5432

## Database Configuration

The application uses a PostgreSQL connection pool configured via the above environment variables. SSL is enabled with `rejectUnauthorized: false` (only disable certificate verification for self-signed certs). Ensure your database allows connections from this application before starting the server.
