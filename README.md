# JaDe

I wanted to try and build a simple desktop management system
using JavaScript - something fun that mimics the Windows
desktop.

The backend is written in __NodeJS__ and is using __express__
and __mongoose__ - we can create and store files, run basic
applications, etc.

It's fairly simple, only started the project yesterday so
a work in progress. This is a SPA, the server returns a single
index.html page - all other requests are via the API which 
receives & returns JSON.


## Prerequisites

You need a few things to get this running:

1. Node JS
2. A MongoDB server

## Clone the repo and install

First - clone the repo:

    git clone https://github.com/b0x3n/JaDe

Now `cd` to the JaDe directory and run `npm install`.

This will install the __express__ server as well as
__mongoose__.


## Running the server and connecting

Once the dependencies have installed you can run the
server:

    node JaDe.js

Now you can connect with your browser to `127.0.0.1:3412`
- if you need to configure the database connection see:

    JaDe/config/DatabaseConfig.js

If you want to set the server port, see:

    JaDe/config/ServerConfig.js


__Michael__
