# User Service Setup Guide

# Quick Start

1. Navigate to the `UserService` Directory in Terminal or Powershell

2. Build the Containers.

Command:

```
docker-compose build user-service user-service-database
```

3. Start the Containers.

Command:

```
docker-compose up user-service user-service-database
```

4. Using Postman or a likewise app, you can connect to `http://localhost:3002/users/` to send http (REST) queries.

## There are a few elements to take care of first:

1. Docker Network
2. MongoDB Container
3. User Service Server Container

## Set Up a Docker Network (Bridge)

Set up a Docker network using the following command, and ensure to use the same network name when starting the various services and databases later. (This step is important if you dont want to run via `docker-compose up` command)

Using Terminal, Run the following Command:

```
docker network create -d bridge user-service-network
```

This command is to be run only for the initially set up, and once the network is setup, this step does not need to be repeated

## MongoDB Container

Navigate into `UserService` Directory

First and foremost change the `databaseUrl` in the `config.js` file to `mongodb://127.0.0.1:27017/userData` or `mongodb://localhost:27017/userData`

Using Terminal, create a `UserServiceDatabase` Directory relative to `UserService` Directory and Navigate into it.

Start by running this container first, else User Service will not be able to connect to Database

Command:

```
docker run -d --rm -p 27017:27017 -v $(pwd):/data/db --name user-service-database --network user-service-network mongo:latest
```

### To access mongosh

Command:

```
docker exec -it user-service-database bash
```

The above will open a terminal window for the MongoDB Docker Container, where `mongosh` can be used.

## User Service Microservice

Navigate to the `UserService` Directory

Build the container by running the following command

Command:

```
docker build -t user-service .
```

Run this container by running the following command

Command:

```
docker run --rm -p 3002:3002 -v $(pwd):/app -it --network user-service-network user-service
```

Using an app like Postman, you can now utilize the User Service on `http://localhost:3002/users/` and send http (REST) queries.
