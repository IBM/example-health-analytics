#!/bin/bash
##############################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
##############################################################################
population=100
state=California
url="http://localhost:3000"
while getopts p:s:u: option
	do
		case "${option}"
		in
			p) population=${OPTARG};;
			s) state=${OPTARG};;
			u) url=${OPTARG};;
			*) continue;;
		esac
done
git clone https://github.com/synthetichealth/synthea.git
cd synthea || exit 1
sed -e 's/^\(exporter.years_of_history =\).*/\1 0/' -e 's/^\(exporter.csv.export =\).*/\1 true/' src/main/resources/synthea.properties > src/main/resources/synthea.properties.new
mv src/main/resources/synthea.properties.new src/main/resources/synthea.properties
./run_synthea -s 32 -p "$population" "$state"
mv output/csv/allergies.csv ../allergies.csv
mv output/csv/patients.csv ../patients.csv
cd ..
rm -rf synthea
csvtojson allergies.csv > allergies.json
csvtojson patients.csv > patients.json
sed -e '1s/^/{"allergies":/' allergies.json > apidata.json
{
    echo ',"patients":'
    cat patients.json
    echo "}"
} >> apidata.json
rm -rf allergies.csv
rm -rf allergies.json
rm -rf patients.csv
rm -rf patients.json
curl "$url/api/v1/generate" -H "Content-Type: application/json" -X PUT -d "@apidata.json"
