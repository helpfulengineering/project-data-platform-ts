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
