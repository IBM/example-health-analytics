#!/bin/bash
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
		esac
done
git clone https://github.com/synthetichealth/synthea.git
sed -e 's/^\(exporter.years_of_history =\).*/\1 0/' -e 's/^\(exporter.csv.export =\).*/\1 true/' synthea/src/main/resources/synthea.properties > synthea/src/main/resources/synthea.properties.new
mv synthea/src/main/resources/synthea.properties.new synthea/src/main/resources/synthea.properties
cd synthea
./run_synthea -s 32 -p $population $state
mv output/csv/allergies.csv ../allergies.csv
mv output/csv/patients.csv ../patients.csv
cd ..
rm -rf synthea
csvtojson allergies.csv > allergies.json
csvtojson patients.csv > patients.json
sed -e '1s/^/{"allergies":/' allergies.json > apidata.json
echo ',"patients":' >> apidata.json
cat patients.json >> apidata.json
echo } >> apidata.json
rm -rf allergies.csv
rm -rf allergies.json
rm -rf patients.csv
rm -rf patients.json
curl "$url/api/v1/generate" -H "Content-Type: application/json" -X PUT -d "@apidata.json"
