# activeviam-projet

## Description

This project will be used to get information and analyse query plans resulting of MDX requests.

## Deployment

This project is deployed on [this adress](https://activeviam-projet.vercel.app) using Vercel.

## Local deployment

### Requirements

- [Node.js](https://nodejs.org) version 20.
- [Yarn](https://yarnpkg.com) (latest version).

### Getting Started

First, install the dependencies:

```bash
yarn install:ci
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

### Submit a query

`./app/submit-query`

Submit a query and get a query plan, or submit directly a query plan

### Summary

`./app/summary`

Get general information and statistics about the query plan

### Timeline

`./app/timeline`

See the retrievals organized in the timeline

### Nodes

`./app/nodes`

Get different timings about the slowest nodes of the query plan

### Passes

`./app/passes`

Get the timings of the different passes of the query plan

## Authors

Thibault MULLER

Alexandre CORREIA

Timothée VARGENAU
