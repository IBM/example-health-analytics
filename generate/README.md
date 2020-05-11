# Generate Synthea Data

## About

This is an alternative to populate Example Health Analytics with patient and allergy data as opposed to getting data from a data source. The bash script works by cloning [Synthea](https://github.com/synthetichealth/synthea), running Synthea to generate data, converting the Synthea data output to a JSON file, and sending the `apidata.json` JSON file to the data service of Example Health Analytics where it is processed and stored in the datalake.

## Prerequisites

* NPM: Install [here](https://www.npmjs.com/get-npm)
* Install dependencies:

```bash
npm install
```

* Java 1.8 or above: Install [here](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

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
    * The API url for the data service of Example Health Analytics. If flag is not used, defaults to http://localhost:3000

# License

This code pattern is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)