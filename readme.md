# REST API for ERP application

This is a bare-bones example of a Sinatra application providing a REST
API to a DataMapper-backed model.

The entire application is contained within the `app.rb` file.

`config.ru` is a minimal Rack configuration for unicorn.

`run-tests.sh` runs a simplistic test and generates the API
documentation below.

It uses `run-curl-tests.rb` which runs each command defined in
`commands.yml`.

## Install

    npm install

## Run the app

    <-> Development
    npm run build:dev
    npm run build:dev:start

    <-> Production
    npm run build:prod
    npm run build:prod:start

## Run the tests

    npm run test

# REST API

The REST API to the ERP-API is described in src/api/v2/documents/\*.

## HealthCheck

### Request

`GET /health/`

    curl -i -H 'Accept: application/json' http://localhost:8000/health

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    // 20230810214507
    // http://localhost:8000/health

    {
        "message": "Success",
        "data": {
            "uptime": 53.131220583,
            "message": "Ok",
            "date": "2023-08-10T14:45:07.647Z"
        }
    }
