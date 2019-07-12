# npm package "@mesalva/b2b-api"

[![npm version](https://badge.fury.io/js/%40mesalva%2Fb2b-api.svg)](https://badge.fury.io/js/%40mesalva%2Fb2b-api)
[![Maintainability](https://api.codeclimate.com/v1/badges/9f6010a2794030533e41/maintainability)](https://codeclimate.com/repos/5cfbe591b7c889010b0011ef/maintainability)
[![Build Status](https://semaphoreci.com/api/v1/mesalva/js-b2b-api/branches/master/shields_badge.svg)](https://semaphoreci.com/mesalva/js-b2b-api)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9f6010a2794030533e41/test_coverage)](https://codeclimate.com/repos/5cfbe591b7c889010b0011ef/test_coverage)

## Introduction

This package is used by [Me Salva Engineering Team](https://mesalva.com) to make requests to Api,
using [HMAC authentication protocol](https://pt.wikipedia.org/wiki/HMAC) + [universal fetch](https://www.npmjs.com/package/universal-fetch) to make requests by
server side (we use [express](https://www.npmjs.com/package/express)) + 
[Json Api Serializer](https://www.npmjs.com/package/json-api-serializer) to parse the api [JSON API BASED](http://jsonapi.org)
to simple Javascript [Camel Case](https://en.wikipedia.org/wiki/Camel_case) Based objects

## Installation

### yarn way

```bash
yarn add @mesalva/b2b-api
```

### npm way

```bash
npm install --save @mesalva/b2b-api
```

## Configurations


You will need these configuration vars: 
```
MESALVA_HMAC, MESALVA_USER, MESALVA_PASSWORD, MESALVA_API, MESALVA_CLIENT
```


**ALERT!!!!** - NEVER commit or send this variables to any place that you do not trust in security.

## Usage

Creating a model

[./examples/ExampleModelA.js](https://github.com/mesalva/js-api-request/blob/doc/readme/examples/ExampleModelA.js)
```js
import MeSalva from '@mesalva/b2b-api'
const MeSalvaApi = new MeSalva({ MESALVA_HMAC, MESALVA_USER, MESALVA_PASSWORD, MESALVA_API, MESALVA_CLIENT })

MeSalvaApi.search("Any query")
MeSalvaApi.getContent("a-permalink/public/inside/mesalva")
MeSalvaApi.getMedium("a-permalink/permalink/of-a-lesson")//Will need authentication, fetch full content (with samba infos)
MeSalvaApi.getMedium("a-permalink/permalink/of-a-lesson", false)//Will need authentication, without samba infos
```
