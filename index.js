/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill');
var axios = require('axios');
var parseString = require('node_modules/xml2js').parseString;
const ACCESS_TOKEN = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0NTU2MTQwMjIifQ.eyJjb25jdXIuc2NvcGVzIjpbIm9wZW5pZCIsIlRSVlJFUSIsIlRSVlBUUyIsIlVOVVRYIiwiTUVESUMiLCJUTUNTUCIsIlRTQUkiLCJFTUVSRyIsIkNPTVBEIiwiUEFTU1YiLCJUQVhJTlYiLCJTVVBTVkMiLCJUUlZQUkYiLCJUV1MiLCJSQ1RJTUciLCJQQVlCQVQiLCJOT1RJRiIsIk1UTkciLCJMSVNUIiwiSk9CTE9HIiwiSVRJTkVSIiwiSU5WVkVOIiwiSU5WVFYiLCJJTlZQTyIsIklOVlBNVCIsIklOU0dIVCIsIklNQUdFIiwiR0hPU1QiLCJGT1AiLCJGSVNWQyIsIkVYVFJDVCIsIkJBTksiLCJDQ0FSRCIsIkVYUFJQVCIsIkVWUyIsIkVSRUNQVCIsIkNPTlJFUSIsIkNPTkZJRyIsIkFUVEVORCIsInVzZXJfcmVhZCIsIm1pbGVhZ2UucmF0ZS53cml0ZW9ubHkiLCJtaWxlYWdlLnJhdGUucmVhZCIsIm1pbGVhZ2UudmVoaWNsZS53cml0ZW9ubHkiLCJtaWxlYWdlLnZlaGljbGUucmVhZCIsIm1pbGVhZ2Uuam91cm5leS53cml0ZW9ubHkiLCJtaWxlYWdlLmpvdXJuZXkucmVhZCIsInRyYXZlbHJlcXVlc3Qud3JpdGUiLCJjcmVkaXRjYXJkYWNjb3VudC5yZWFkIiwiY29tcGFueS53cml0ZSIsImNvbXBhbnkucmVhZCIsInVzZXIud3JpdGUiLCJ1c2VyLnJlYWQiLCJyZWNlaXB0cy53cml0ZSIsInJlY2VpcHRzLndyaXRlb25seSIsIlVTRVIiLCJUUklQSVQiLCJDT01QQU5ZIiwicmVjZWlwdHMucmVhZCJdLCJhdWQiOiIqIiwiY29uY3VyLmFwcElkIjoiYzM3ZDk5MzctMTdhYi00ZDc4LWIwZjktYTNiZmMyODQ5YjZlIiwic3ViIjoiMWQyM2M4NDEtMzEzZC00MmNjLWFmNmYtMWE1MDY2OGZlOGIzIiwiaXNzIjoiaHR0cHM6Ly91cy5hcGkuY29uY3Vyc29sdXRpb25zLmNvbSIsImNvbmN1ci5wcm9maWxlIjoiaHR0cHM6Ly91cy5hcGkuY29uY3Vyc29sdXRpb25zLmNvbS9wcm9maWxlL3YxL3ByaW5jaXBhbHMvMWQyM2M4NDEtMzEzZC00MmNjLWFmNmYtMWE1MDY2OGZlOGIzIiwiZXhwIjoxNTA5MDI3OTg4LCJjb25jdXIudmVyc2lvbiI6MiwiY29uY3VyLnR5cGUiOiJ1c2VyIiwiY29uY3VyLmFwcCI6Imh0dHBzOi8vdXMuYXBpLmNvbmN1cnNvbHV0aW9ucy5jb20vcHJvZmlsZS92MS9hcHBzL2MzN2Q5OTM3LTE3YWItNGQ3OC1iMGY5LWEzYmZjMjg0OWI2ZSIsIm5iZiI6MTUwOTAyNDM4OCwiaWF0IjoxNTA5MDI0Mzg4fQ.H5KCMe10vPN9V-NRUeRUdXg_Xm7VANhGASBvLUkVJiHI1Jqwa1uIxXmZ-iQ2AE71esYmD5tuK2B3mbYMCuQJJw4PTQLovN8FmTnG0ZAR9YPrPLFnUWvLXan6BQZ4U4m60aGjEAqhw5vGKX_CVbORvDdhEQMAm34dQI-zZUg4rlE6CoYJSu8JRAkmB6uF8DpKy91Cldm-Y6PHRaggzYq5goVDN3-Dc4g82B7rteYW_M1ASA0mEgi3R5kXUah0HihbZETEREE35uvFc0NuI9zrb2FETItgm_CuhOj_GQrHASo2Ja06R_HRUWys2Slvcypf341sRXUyu5iU7UC16DDLgg";

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the How To Helper. You can ask a question like, what's the recipe for a chest? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "DeleteTrip": function (intent, session, response) {
        var tripName = intent.slots.Item.value;
        console.log(tripName);
        response.tell("Okay! your trip to " + tripName + " has been canceled.");
        // convertTripNameToId(tripName)
        // .then(function(tripId) {
        //     console.log("Trip has been found:" 
        //     + tripId);
        //     if (tripId === null) {
        //         response.tell("Sorry, there is no trip by that name.");
        //     }
        //     return cancelTrip(tripId)

        // })
        // .then(function(d) {
        //     console.log(d.data);
        //     parseString(d.data, function (err, result) {
        //         console.log(result);
        //         if (result.Error) {
        //             response.tell("YEEEEE YOU GOT AN ERROR TO FIX YALL")
        //         } else {
        //             response.tell("Your trip has been banned to the void of hell");
        //         }
        //     }, this);
        // }).catch(function(err){
        //     console.log(err)
        //     response.tell("caught in the undertoe")
        // });
    },

    "GetTripSummary": function (intent, session, response) {
        getAllTrips().then(function (res) {
            var trips = res.data;
            var tripNames = [];
            var speechOutput = "Sorry there was an error."

            for (let i = 0; i < trips.length; i++) {
                tripNames.push(trips[i].TripName);
            }
            if (tripNames) {
                var tripsJoin = tripNames.join(',');

                speechOutput = "This is your trip summary.";
                speechOutput += " You have a trip to: " + tripsJoin;

            } else {
                speechOutput = "You currently do not have any trips planned.";
            }
            response.tell(speechOutput);
        }).catch(function (err) {
            // catch errors
            let errorMsg = "Sorry, there was an error getting your trips.";
            response.tell(errorMsg);
        });
    },

    "GetTripDetail": function (intent, session, response) {
        var tripName = intent.slots.Item.value;
        var speechOutput = "Sorry there was an error.";
        convertTripNameToId(tripName)
            .then(function (tripId) {
                if (tripId === null) {
                    response.tell("Sorry, there is no trip by that name.");
                }
                return getTripDetails(tripId)

            })
            .then(function (d) {
                parseString(d.data, function (err, res) {
                    let startDate = res.Itinerary.StartDateLocal[0];
                    let date = humanizeDate(startDate.slice(0, 10));
                    console.log(date);
                    speechOutput = "Your trip to " + res.Itinerary.TripName[0] + " is on " + date;
                    response.tell(speechOutput);
                }, this);
            })
            .catch(function (err) {
                let errorMsg = "Sorry, there was an error getting your trip details.";
                response.tell(errorMsg);
            });
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what's the recipe, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the recipe, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};


function convertTripNameToId(tripName) {
    return getAllTrips().then(function (res) {
        tripName = tripName.toLowerCase();
        res = res.data;
        for (var i = 0; i < res.length; i++) {
            var currentTripName = res[i].TripName.toLowerCase();
            console.log("Checking if " + tripName + " equals " + currentTripName);
            if (currentTripName == tripName) {
                console.log("FOUND IT!");
                return res[i].TripId;
            }
        }
        return null;
    })
}

function getAllTrips() {
    return axios.get("https://www.concursolutions.com/api/travel/trip/v1.1/", {
        headers: {
            "Accept": "application/json",
            "Authorization": ACCESS_TOKEN
        }
    });
}

function getTripDetails(tripId) {
    return axios.get("https://www.concursolutions.com/api/travel/trip/v1.1/" + tripId, {
        headers: {
            "Accept": "application/json",
            "Authorization": ACCESS_TOKEN
        }
    })
}

function cancelTrip(tripId) {
    return axios.post("https://www.concursolutions.com/api/travel/trip/v1.1/cancel?tripid=" + tripId, {
        headers: {
            "Accept": "application/xml",
            "Authorization": ACCESS_TOKEN
        }
    })
}

function humanizeDate(date_str) {
    var month = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date_arr = date_str.split('-');
    return month[Number(date_arr[1]) - 1] + " " + date_arr[2] + ", " + date_arr[0]
}