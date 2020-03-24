# Purpose

I was challenged to make a database client within 24 hours for a client's project I was tasked to work on.

Since it was a 24 hour challenge, the entire project _lacks sufficient security for Production_

# Prerequisites

1. Node.js LTS
2. PostgresSQL LTS
3. Create "bamdb_dev" database via PSQL

# Steps

```
npm i || npm install
***SPIN UP PSQL SERVER***
npm start
***POPULATE DATABASE WITH MOCK RECORDS***
GET http://localhost:7777/api/seeder/seed?table={CHOOSE}&testName={CHOOSE}&entryCount={CHOOSE}'
```

### Example seed request

`http://localhost:7777/api/seeder/seed?table=User&testName=tilios&entryCount=3`
