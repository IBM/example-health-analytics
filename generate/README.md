# Generate Synthea Data

## About

This is an alternative to populate Summit Health Analytics with patient and allergy data as opposed to getting data from a Z system. The bash script works by cloning [Synthea](https://github.com/synthetichealth/synthea), running Synthea to generate data, converting the Synthea data output to a JSON file, and sending the `apidata.json` JSON file to the data service of Summit Health Analytics where it is processed and stored in the datalake.

## Prerequisites

* NPM
    * Install [here](https://www.npmjs.com/get-npm)
* CsvToJson
    * ```bash 
        npm i -g csvtojson
    ```
* Java 1.8 or above
    * Install [here](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

## Running

```bash
./generate.sh -p [population] -s [state] -u [url]
```

**Flags**:
* p
    * The population of the generated Synthea data. If flag is not used, defaults to 100.
* s
    * The state for where the Synthea data will be generated. If flag is not used, defaults to California.
* u
    * The API url for the data service of Summit Health Analytics. If flag is not used, defaults to http://localhost:3000
