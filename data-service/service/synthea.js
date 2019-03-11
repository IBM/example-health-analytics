/**
 * Service for converting generated synthea data into data lake data
 */

var allergyTypes = [
	{synthea: "Allergy to peanuts",
		analytics: "Peanut",
		type: "Food"},
	{synthea: "Allergy to nut",
		analytics: "Tree nut",
		type: "Food"},
	{synthea: "Allergy to fish",
		analytics: "Fish",
		type: "Food"},
	{synthea: "Shellfish allergy",
		analytics: "Shellfish",
		type: "Food"},
	{synthea: "Allergy to wheat",
		analytics: "Wheat",
		type: "Food"},
	{synthea: "Allergy to eggs",
		analytics: "Egg",
		type: "Food"},
	{synthea: "Allergy to soya",
		analytics: "Soy",
		type: "Food"},
	{synthea: "Allergy to dairy product",
		analytics: "Dairy",
		type: "Food"},
	{synthea: "Allergy to tree pollen",
		analytics: "Tree Pollen",
		type: "Outdoor"},
	{synthea: "Allergy to grass pollen",
		analytics: "Grass Pollen",
		type: "Outdoor"},
	{synthea: "Dander (animal) allergy",
		analytics: "Pet Dander",
		type: "Outdoor"},
	{synthea: "House dust mite allergy",
		analytics: "Dust Mite",
		type: "Outdoor"},
	{synthea: "Allergy to mould",
		analytics: "Mold",
		type: "Outdoor"},
	{synthea: "Allergy to bee venom",
		analytics: "Bee Sting",
		type: "Outdoor"},
	{synthea: "Latex allergy",
		analytics: "Latex",
		type: "Other"}
]

/**
 * Converts generated synthea data into data lake data
 * 
 * @param {Object} syntheaData 
 */
function generateFromSynthea(syntheaData) {
	var datalakeData = {
		population: syntheaData.patients.length,
		allergies: [],
		cities: []
	};

	for (var patient = 0; patient < syntheaData.patients.length; patient++) {
		var cityInData = false;
		for (var city = 0; city < datalakeData.cities.length; city++) {
			if (datalakeData.cities[city].city == syntheaData.patients[patient].CITY) {
				cityInData = true;
				break;
			}
		}

		if (!cityInData) {
			datalakeData.cities.push({
				city: syntheaData.patients[patient].CITY,
				state: syntheaData.patients[patient].STATE,
				population: 0,
				allergies: []
			})
		}

		datalakeData.cities[city].population = datalakeData.cities[city].population + 1;

		for (var allergy = 0; allergy < syntheaData.allergies.length; allergy++) {
			if (syntheaData.allergies[allergy].PATIENT == syntheaData.patients[patient].Id) {
				for (var allergyType = 0; allergyType < allergyTypes.length; allergyType++) {
					if (allergyTypes[allergyType].synthea == syntheaData.allergies[allergy].DESCRIPTION) {
						if (datalakeData.allergies.indexOf(allergyTypes[allergyType].analytics) == -1) {
							datalakeData.allergies.push(allergyTypes[allergyType].analytics);
						}

						var allergyInCity = false;

						for (var cityAllergy = 0; cityAllergy < datalakeData.cities[city].allergies.length; cityAllergy++) {
							if (datalakeData.cities[city].allergies[cityAllergy].allergy == allergyTypes[allergyType].analytics) {
								allergyInCity = true;
								break;
							}
						}

						if (!allergyInCity) {
							datalakeData.cities[city].allergies.push({
								allergy: allergyTypes[allergyType].analytics,
								type: allergyTypes[allergyType].type,
								developed: [],
								outgrown: []
							})
						}

						var developedDate = new Date(syntheaData.allergies[allergy].START);
						var today = new Date(Date.now());
						datalakeData.cities[city].allergies[cityAllergy].developed.push(today.getFullYear()-developedDate.getFullYear());

						if (syntheaData.allergies[allergy].STOP != "") {
							var outgrownDate = new Date(syntheaData.allergies[allergy].STOP);
							datalakeData.cities[city].allergies[cityAllergy].outgrown.push(today.getFullYear()-outgrownDate.getFullYear());
						}
					}
				}
			}
		}

	}

	return datalakeData;
}

module.exports.generateFromSynthea = generateFromSynthea;
