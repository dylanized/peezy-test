![Ledge Zeppelin](http://ledgezeppelin.com/img/lz-logo.svg)

Ledge Zeppelin service is a REST style search API for finding legislators by location and hierarchy. Legislator resources returned by the API have attached contact information including phone numbers, email address, and social networks.

The application architecture consists of these parts:

- LZ Service - the REST API, built in Node.js and Express
- LZ Admin aka [Sammy Hagar](http://github.com/revolution-messaging/sammy-hagar) - admin interface for managing legislator info
- MongoDB Database - for storing legislator and user info
- MySQL Database - for storing zip code data
- Archive Script - daily cron job for archiving legislators whose terms have expired

The devops consists of these parts:

- Build System - powered by Cake
- Deployment - managed via Heroku
- Tests - powered my Mocha and Suite-tooth
- Logging - ?? (TODO)
- Analytics - managed by New Relic (TODO - more details?)

## App Tiers

#### Dev

- URL: http://localhost:3005/

To launch the app locally, ssh into vagrant box and run `npm run dev`.

Then you can connect to the app via a tool like Paw or Curl, or launch and use the LZ Admin interface.

#### Staging

- URL: http://lz-service-staging.herokuapp.com 
- Server: https://dashboard.heroku.com/apps/lz-service-staging/
- Deploy: Push staging branch

#### Production

- URL: http://api.ledgezeppelin.com/
- Deploy: Ask Josh

## Tasks

#### App Tasks

- `npm install`
  - Runs during vagrant provisioning
  - Builds app, compiles CoffeeScript files, installs node module dependencies
- `npm start`
  - Starts server and master process
- `npm run app`
  - Builds app, compiles CoffeeScript files, installs node module dependencies
  - Runs a watch task on CoffeeScript files
- `npm run dev`
  - Drops Legislator MongoDB 
  - Created and seeds Legislator MongoDB collection
  - Executes `npm run app`
- `npm run build`
  - Runs `cake build`
- `npm run rebuild'
  - Runs `cake rebuild`
- `npm run clean`
  - removes compiled files
  
#### Testing Tasks  
  
- `npm test`
  - Runs active Mocha test files
  - Stops after first failure
  - Suppresses NPM error messages
- `npm run mocha`
  - Runs all Mocha test files
  - Does not bail after failures
  - Optionally add `-- --bail` or other arguments
  - Displays NPM error messages
- `npm run mocha test/1*.js`
  - Runs a subset of test files
- `npm run test-grep <term>`
  - Run tests that have a name that matches `<term>`
  - Optionally add `-- --bail` 
- `npm run env`
  - Print out NPM environment variables
- `npm run bin`
  - Show installed binaries
  
#### MongoDB Tasks  
  
- `npm run importDB <file>`
  - Imports `<file>` to Legislators MongoDB Collection
- `npm run seedDB`
  - Imports `config/db/mongo_seed.json` to Legislators MongoDB collection
- `npm run dropDB`
  - Drops Legislators MongoDB collection
- `npm run reloadDB`
  - Runs during Vagrant provisioning
  - Executes `npm run dropDB && npm run seedDB`
  
#### MySQL Tasks  

- `npm run createSQL`
  - Runs during Vagrant provisioning 
  - Creates Postal Code database    
- `npm run reloadSQL`
  - Runs during Vagrant provisioning 
  - Drops, creates, and seeds Postal Code database
  
#### Other Tasks

- `npm run archive`
  - runs `scripts/archive.js`
  - daily cron job for archiving legislators whose terms have expired

## Other Architecture Notes

- LZ Service is an an Express.js app written in CoffeeScript that resides in the `/src` folder
- there is also some clustering managed by the server.js and worker.js in the root folder
- all Legislator data is stored in the Mongo database; MySQL is never written to
- how are uploads handled? (TODO)
- some test files are written with [Suite-tooth](http://github.com/dylanized/suite-tooth) library, others in traditional Mocha style.

## API Documentation

LZ Service features 3 types of endpoints:

#### Legislator Collection Endpoints

| Name               | Path                                                      |
| ------------------ | --------------------------------------------------------- |
| State              | `/v1/state/{state}/{type}`                                |
| State + Level      | `/v1/state/{state}/{level}/{type}`                        |
| Zip                | `/v1/zip/{zipcode}/{type}`                                |
| Zip + Level        | `/v1/zip/{zipcode}/{level}/{type}`                        |
| Search by property | `/v1/search?{name}{state}{group}{level}{political_party}` |

**Parameters**

- zipcode (number, required) :: Valid 5-digit or 9-digit zipcode
- state (string, optional) :: Two letter state abbreviation
- type (string, required) :: Resource to return with legislator :: phones, networks
- level (string, required) :: Legislator level
- id (string, required) :: Document ID
- name (string, optional) :: Full or partial name
- group (string, optional) :: Legislator group :: state-lower, state-upper, state-wide, fed-lower, fed-upper
- political_party (string, optional) :: Legislator political party

**Response**

This endpoint returns a response body containing an array called `legislators`, which contains legislator objects like this:

```
{
    "_id": "51605391c592fa730e000021",
    "level": "state-lower",
    "name": "Jim Frazier",
    "state": "CA",
    "title": "Assemblyman",
    "phones": [
        {
            "number": "19163192011",
            "_id": "51605391c592fa730e000022",
            "date_modified": "2013-11-11T15:54:24.743Z",
            "date_added": "2013-11-11T15:54:24.743Z",
            "label": "capitol"
        }
    ],
    "emails": [],
    "networks": []
    "country": "us",
    "date_modified": "2013-11-11T15:54:24.741Z",
    "date_added": "2013-11-11T15:54:24.741Z",
    "district": "11",
    "audio_path": "http://api.ledgezeppelin.com/CA-H11.mp3",
    "filename": "CA-H11.mp3",
    "pronunciation": null
}
```

#### Single Legislator Endpoint

| Name | Path           |
| -----| -------------- |
| ID   | `/v1/leg/{id}` |

**Parameters**

- id (string, required) :: Document ID

**Response**

This endpoint returns a response body that *is* a single legislator object, similar to the one above.

#### Zipinfo Endpoints

| Name                    | Path                                      |
| ----------------------- | ----------------------------------------- |
| Zipinfo                 | `/v1/zipinfo/{zipcode}`                   |
| Zipinfo (all districts) | `/v1/zipinfo/zip_all_districts/{zipcode}` |

Are these real? They do not have tests. (TODO)

**Parameters**

- zipcode (number, required) :: Valid 5-digit or 9-digit zipcode

**Response**

These endpoints return a response body that *is* a zipinfo object, like this:

```
{
  "zip_code": "63116",
  "region": "MO",
  "country": "US",
  "state_lower_districts": [
    "081",
    "080",
    "082",
    "093"
  ],
  "state_upper_districts": [
    "005",
    "004"
  ],
  "federal_house_districts": [
    "01"
  ]
}
```

(TODO - is this correct?)

## API Authentication

API access is authenticated by 3scale for all application tiers. (TODO - more details?)

#### Resource Objects

Located inside legislator objects, sub-resources are objects for organizing pieces of data related to legislators.

**Email Resource**

- label (string, optional)
- address (string, required)

```
{
    "label": "District",
    "address: "representative@whitehouse.gov"
}
```

**Phone Resource**

- label (string, optional)
- number (string, required)

```
{
    "label": "District",
    "number: "(123) 456-7890"
}
```

**Network Resource**

- label (string, optional)
- url (string, required)

```
{
    "label": "Twitter",
    "address: "https://twitter.com/representative"
}
```

## Create Users

#### Create Dev or Staging User

- Send POST request to http://localhost:3005/admin/users/sign_up
- with the JSON listed below:

​`{ "username": "name@domain.com", "password": "123456" }` 

- Click on link in email

#### Create Production User

- Ask Josh

## Setup	
	
#### App Dependencies

- Node.js
- MySQL
- MongoDB
- Express.js
- CoffeeScript
- Multer
- 3scale
- New Relic

#### Dev Dependencies

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](http://www.vagrantup.com/downloads.html)
- [Suite-tooth](http://github.com/dylanized/suite-tooth)
- [Unit.js](http://unitjs.com)

#### Dev Install

**Provision Vagrant Box**

Create box with your first `vagrant up`.

#### Dev Routine

- `vagrant up`
- `vagrant ssh`
- `cd /vagrant`
- `npm start`

#### Staging Install

Staging is a Heroku instance with these resources:

- Deploy Hooks (for sending notifications to Slack)
- New Relic APM
- Heroku Scheduler (for running the archive cron)
- SSL

#### Production Install

(TODO)

## Credits

Main contributors:

- Revolution Messaging, LLC
- Josh Minnich
- Walker Hamilton
- Gabe Hammersmith
- Dylan Hassinger
- Alex Zielonko

(c) 2016 Revolution Messaging