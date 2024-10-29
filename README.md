# Project Data Platform

This is a work in progress.

We are currently attempting to build a website to address broken supply chains, such as occur during natural disasters.
This is an attempt to build a website that allows makers and manufacturers to match demand for necessary articles which
they can make.
This matching of demand to supply is a fundamental human problem that could allow lives to be saved and
distress relieved during the serial natuarl disaster that we face.

# Technology

At present, we are using Microsoft Azure to build a basic website.

Harry Pierson has explored an AI-based matching of tools and capabilities that are available to tools and capabilities
which are are needed to make needed articles.

# Volunteers Needed

We need volunteers. Although we can use a wide variety of skills we need:

1. Programmers who can build a website with Azure
2. Front-end programmers who, using Nuxt/Vue/Boostrap, can implement visual components.
   Apply here: https://helpful.directory/opportunity?id=Software-Developer---Typescript-446
3. AI programmers who can use vector-matching a LLMs to build a robust matching algorithm.

# Older Content (Obsolete below this point.)

TypeScript port of orginal [Project Data Python Code](https://github.com/helpfulengineering/project-data-platform)

# Current Website

The [current website](https://helpfulengineering.github.io/project-data-platform-ts/) is implemented with Github Pages.

# Steps to Start

### Back-End

1. Make sure local.settings.json file exists in packages/back-end folder.

- Copy from local.settings.json.template, change the name.

1.  In packages/back-end folder, run "az login", login to your account in separate window, and select the default DB. If multiple, select this one:

- You must have permissions on the Azure database. Contact admin to make sure you have the right permissions.

         No Subscription name Subscription ID Tenant

         ***

         --
         [1] \* Microsoft Azure Sponsorship 7bee972d-2535-4ab7-9fbc-db639e7225d2 Public Inventi
         on

1.  in the packages/back-end folder, run "npm run start" to begin the server

- Output should look like:

      [2024-10-29T22:44:06.199Z] Worker process started and initialized.

      Functions:

      getOKH: [GET,POST] http://localhost:7071/api/getOKH

      getOKHs: [GET,POST] http://localhost:7071/api/getOKHs

### Front-End

1. In packages/front-end folder, run "npm run dev" to begin the Nuxt server.
2. Go to localhost:3000 or localhost:3000/homepage
