# Project Data Web Backend

At present this is a nascent backend, written as azure functions. At
present, it is not actually using the Azure backend.

# Running

In the pdweb-backend directory, run:
> npm start

This will start a process that uses tcp port 7071. If the frontend
is properly configured to reach this backend, it will be able
to read sample data from this.