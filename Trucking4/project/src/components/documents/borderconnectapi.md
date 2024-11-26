ACE_TRIP API example to send to BorderConnect

{
	"data": "ACE_TRIP",
	"sendId": "001",
	"companyKey": "c-9000-2bcd8ae5954e0c48",
	"operation": "CREATE",
	"tripNumber": "AAAA123457A",
	"usPortOfArrival": "0101",
	"estimatedArrivalDateTime": "2014-07-31 04:45:00",
	"truck": {
		"number": "2013",
		"type": "TR",
		"vinNumber": "AG12XXXXXXXXXF",
		"licensePlate": {
			"number": "TEMP5",
			"stateProvince": "ON"
		}
	},
	"trailers": [
		{
			"number": "0456",
			"type": "TL",
			"licensePlate": {
				"number": "JV2012",
				"stateProvince": "ON"
			}
		}
	],
	"drivers": [
		{
			"driverNumber": "D004",
			"firstName": "Michael",
			"lastName": "Dorn",
			"gender": "M",
			"dateOfBirth": "1970-01-01",
			"citizenshipCountry": "CA",
			"fastCardNumber": "42705555555501"
		}
	],
	"shipments": [
		{
			"data": "ACE_SHIPMENT",
			"sendId": "001",
			"companyKey": "c-9000-2bcd8ae5954e0c48",
			"operation": "CREATE",
			"type": "PAPS",
			"shipmentControlNumber": "AAAAA754321",
			"provinceOfLoading": "NU",
			"shipper": {
				"name": "Art place",
				"address": {
					"addressLine": "1234 Vancity",
					"city": "Vancouver",
					"stateProvince": "BC",
					"postalCode": "V6H 3J9"
				}
			},
			"consignee": {
				"name": "Elk Corp of Texas",
				"address": {
					"addressLine": "401 Weavertown Rd",
					"city": "Myerstown",
					"stateProvince": "PA",
					"postalCode": "17067"
				}
			},
			"commodities": [
				{
					"loadedOn": {
						"type": "TRAILER",
						"number": "0456"
					},
					"description": "Books",
					"quantity": 35,
					"packagingUnit": "BOX",
					"weight": 1500,
					"weightUnit": "L"
				}
			]
		}
	],
	"autoSend": false
}

Return message from BorderConnect
Example ACE Send Request JSON Data:

{
	"data": "ACE_SEND_REQUEST",
	"sendId": "1302213",
	"companyKey": "c-9000-2bcd8ae5954e0c48",
	"type": "COMPLETE_TRIP_AND_SHIPMENTS",
	"tripNumber": "AAAA123457A"
}

ACE Response Message Map
When ACE eManifest data uploaded via API is transmitted to CBP, the CBP responses to those transmissions will be returned via the API. These responses may include a direct response, such as an accept or reject of the transmission, or an update on the status of the manifest.

Example ACE Response JSON Data:

{
	"data": "ACE_RESPONSE",
	"dateTime": "2014-12-08 05:36:27",
	"cbpDateTime": "2014-12-08 05:35:52",
	"sendRequest": {
		"type": "COMPLETE_TRIP_AND_SHIPMENTS",
		"tripNumber": "AAAA123457A"
	},
	"processingResponse": {
		"shipmentsRejected": 0,
		"shipmentsAccepted": 1
	}
}

ACI_SHIPMENT API example to send to BorderConnect

{
	"data": "ACI_TRIP",
	"sendId": "001",
	"companyKey": "c-9000-2bcd8ae5954e0c48",
	"operation": "CREATE",
	"tripNumber": "1234923ASDF",
	"portOfEntry": "0440",
	"estimatedArrivalDateTime": "2014-12-08 05:45:00",
	"truck": {
		"number": "10",
		"type": "TR",
		"vinNumber": "23XXXXXX54XX7",
		"dotNumber": "000001",
		"insurancePolicy": {
			"insuranceCompanyName": "ABC Insurance",
			"policyNumber": "123456789",
			"issuedDate": "2010-10-20",
			"policyAmount": 1000000
		},
		"licensePlate": {
			"number": "TRK1NG",
			"stateProvince": "ON"
		}
	},
	"trailers": [
		{
			"number": "23411",
			"type": "TL",
			"licensePlate": {
				"number": "OKATE1",
				"stateProvince": "MI"
			}
		}
	],
	"drivers": [
		{
			"driverNumber": "JD",
			"firstName": "John",
			"lastName": "Doe",
			"gender": "M",
			"dateOfBirth": "1980-07-14",
			"citizenshipCountry": "US",
			"travelDocuments": [
				{
					"number": "23423562",
					"type": "5K",
					"stateProvince": "MI"
				},
				{
					"number": "23423562",
					"type": "6W",
					"stateProvince": "MI"
				}
			]
		}
	],
	"shipments": [
		{
			"data": "ACI_SHIPMENT",
			"sendId": "001",
			"companyKey": "c-9000-2bcd8ae5954e0c48",
			"operation": "CREATE",
			"shipmentType": "PARS",
			"loadedOn": {
				"type": "TRAILER",
				"number": "23411"
			},
			"cargoControlNumber": "1234PARS34213341",
			"referenceOnlyShipment": false,
			"portOfEntry": "0440",
			"releaseOffice": "0440",
			"estimatedArrivalDate": "2014-12-08 05:45:00",
			"cityOfLoading": {
				"cityName": "New York",
				"stateProvince": "NY"
			},
			"consolidatedFreight": false,
			"shipper": {
				"name": "Hazmat Wholesale",
				"address": {
					"addressLine": "1234 New York ave",
					"city": "New York",
					"stateProvince": "NY",
					"postalCode": "12345"
				}
			},
			"consignee": {
				"name": "Canadian Lava Co.",
				"address": {
					"addressLine": "15 North Town Line Unit 68B",
					"city": "River Canard",
					"stateProvince": "ON",
					"postalCode": "N9J2W2"
				}
			},
			"commodities": [
				{
					"description": "Plywood",
					"quantity": 900,
					"packagingUnit": "PCE",
					"weight": "35005",
					"weightUnit": "LBR"
				}
			]
		}
	],
	"autoSend": false
}

ACI Send Request Message Map
An ACI Send Request allows for previously uploaded eManifest data to be transmitted to the Canada Border Services Agency (CBSA). Although it's possible to have the data automatically transmitted on upload using the ACI eManifest Message Map's "autoSend" flag, this map allows the user the freedom to transmit eManifest data at a time of their choosing. It also allows more advanced options, such as cancelling or amending eManifest data.

Example ACI Send Request JSON Data:

{
	"data": "ACE_SEND_REQUEST",
	"sendId": "1302213",
	"companyKey": "c-9000-2bcd8ae5954e0c48",
	"tripNumber": "1234923ASDF",
	"type": "ORIGINAL",
	"bundleTripAndShipments": true
}

ACI Response Message Map
When ACI eManifest data uploaded via API is transmitted to CBSA, the CBSA responses to those transmissions will be returned via the API. The responses in this map will either be an accept or reject of the eManifest data transmitted. Please note that status updates will for ACI eManifest data will use the ACI Notice Message Map instead.

Example ACI Response JSON Data:

{
	"data": "ACI_RESPONSE",
	"sendRequest": {
		"tripNumber": "1234923ASDF",
		"type": "ORIGINAL",
		"bundleTripAndShipments": true
	},
	"dateTime": "2014-12-08 03:50:36",
	"cbsaDateTime": "2014-11-20 03:45:00",
	"type": "ACCEPT",
	"tripNumber": "1234923ASDF"
}