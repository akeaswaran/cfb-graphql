const pgp = require('pg-promise')();
var http = require('http');
var moment = require('moment');

const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/');

var teamNames = {
  'air_force': 'AFA',
  'akron': 'AKR',
  'alabama': 'ALA',
  'appalachian_st': 'APP',
  'arizona': 'ARIZ',
  'arizona_st': 'ASU',
  'arkansas': 'ARK',
  'arkansas_st': 'ARST',
  'army': 'ARMY',
  'auburn': 'AUB',
  'ball_st': 'BALL',
  'baylor': 'BAY',
  'boise_st': 'BSU',
  'boston_college': 'BC',
  'bowling_green': 'BGSU',
  'buffalo': 'BUFF',
  'byu': 'BYU',
  'california': 'CAL',
  'cincinnati': 'CIN',
  'clemson': 'CLEM',
  'colorado': 'COLO',
  'colorado_st': 'CSU',
  'connecticut': 'CONN',
  'c_michigan': 'CMU',
  'duke': 'DUKE',
  'east_carolina': 'ECU',
  'e_michigan': 'EMU',
  'florida': 'FLA',
  'florida_intl': 'FIU',
  'florida_st': 'FSU',
  'fl_atlantic': 'FAU',
  'fresno_st': 'FRES',
  'ga_southern': 'GASO',
  'georgia': 'UGA',
  'georgia_st': 'GAST',
  'georgia_tech': 'GT',
  'hawaii': 'HAW',
  'houston': 'HOU',
  'idaho': 'IDHO',
  'illinois': 'ILL',
  'indiana': 'IND',
  'iowa': 'IOWA',
  'iowa_st': 'ISU',
  'kansas': 'KU',
  'kansas_st': 'KSU',
  'kent': 'KENT',
  'kentucky': 'UK',
  'louisiana_tech': 'LT',
  'louisville': 'LOU',
  'lsu': 'LSU',
  'marshall': 'MRSH',
  'maryland': 'UMD',
  'massachusetts': 'UMASS',
  'memphis': 'MEM',
  'miami_fl': 'MIA',
  'miami_oh': 'M-(OH)',
  'michigan': 'MICH',
  'michigan_st': 'MSU',
  'minnesota': 'MINN',
  'mississippi': 'MISS',
  'mississippi_st': 'MSST',
  'missouri': 'MIZZ',
  'mtsu': 'MTSU',
  'navy': 'NAVY',
  'nc_state': 'NCST',
  'nebraska': 'NEB',
  'nevada': 'NEV',
  'new_mexico': 'UNM',
  'new_mexico_st': 'NMSU',
  'northwestern': 'NW',
  'north_carolina': 'UNC',
  'north_texas': 'UNT',
  'notre_dame': 'ND',
  'n_illinois': 'NIU',
  'ohio': 'OHIO',
  'ohio_st': 'OSU',
  'oklahoma': 'OU',
  'oklahoma_st': 'OKST',
  'old_dominion': 'ODU',
  'oregon': 'ORE',
  'oregon_st': 'ORST',
  'penn_st': 'PSU',
  'pittsburgh': 'PITT',
  'purdue': 'PUR',
  'rice': 'RICE',
  'rutgers': 'RUTG',
  'san_diego_st': 'SDSU',
  'san_jose_st': 'SJSU',
  'smu': 'SMU',
  'southern_miss': 'USM',
  'south_alabama': 'USA',
  'south_carolina': 'SCAR',
  'south_florida': 'USF',
  'stanford': 'STAN',
  'syracuse': 'SYR',
  'tcu': 'TCU',
  'temple': 'TEM',
  'tennessee': 'TENN',
  'texas': 'TEX',
  'texas_am': 'TAMU',
  'texas_st': 'TXST',
  'texas_tech': 'TTU',
  'toledo': 'TOL',
  'troy': 'TROY',
  'tulane': 'TULN',
  'tulsa': 'TLSA',
  'uab': 'UAB',
  'ucf': 'UCF',
  'ucla': 'UCLA',
  'ull': 'ULL',
  'ulm': 'ULM',
  'unlv': 'UNLV',
  'usc': 'USC',
  'utah': 'UTAH',
  'utah_st': 'USU',
  'utep': 'UTEP',
  'ut_san_antonio': 'UTSA',
  'vanderbilt': 'VAN',
  'virginia': 'UVA',
  'virginia_tech': 'VT',
  'wake_forest': 'WAKE',
  'washington': 'UW',
  'washington_st': 'WSU',
  'west_virginia': 'WVU',
  'wisconsin': 'WIS',
  'wyoming': 'WYO',
  'w_kentucky': 'WKU',
  'w_michigan': 'WMU'
};

//Utility Functions
function getConferenceId(conferenceAbbr) {
    if (conferenceAbbr === 'acc') {
       return '1';
    } else if (conferenceAbbr === 'big_10') {
      return '4';
    } else if (conferenceAbbr === 'big_12') {
      return '5';
    } else if (conferenceAbbr === 'sec') {
      return '8';
    } else if (conferenceAbbr === 'pac_12') {
      return '9';
    } else if (conferenceAbbr === 'c_usa') {
      return '12';
    } else if (conferenceAbbr === 'mac') {
      return '15';
    } else if (conferenceAbbr === 'mwc') {
      return '17';
    } else if (conferenceAbbr === 'sun_belt') {
      return '37';
    } else if (conferenceAbbr === 'aac') {
      return '151';
    } else {
      return '369';
    }
}

function getConference(conferenceId) {
  if (conferenceId === '1') {
    return {'abbreviation' : 'ACC', 'name' : 'Atlantic Coast Conference'};
  } else if (conferenceId === '4') {
    return {'abbreviation' : 'Big 12', 'name' : 'Big 12 Conference'};
  } else if (conferenceId === '5') {
    return {'abbreviation' : 'B1G', 'name' : 'Big Ten Conference'};
  } else if (conferenceId === '8') {
    return {'abbreviation' : 'SEC', 'name' : 'Southeastern Conference'};
  } else if (conferenceId === '9') {
    return {'abbreviation' : 'PAC12', 'name' : 'Pacific 12 Conference'};
  } else if (conferenceId === '12') {
    return {'abbreviation' : 'CUSA', 'name' : 'Conference USA'};
  } else if (conferenceId === '15') {
    return {'abbreviation' : 'MAC', 'name' : 'Mid-American Conference'};
  } else if (conferenceId === '17') {
    return {'abbreviation' : 'MWC', 'name' : 'Mountain West Conference'};
  } else if (conferenceId === '37') {
    return {'abbreviation' : 'Sun Belt', 'name' : 'Sun Belt Conference'};
  } else if (conferenceId === '151') {
    return {'abbreviation' : 'AAC', 'name' : 'American Athletic Conference'};
  } else {
    return {'abbreviation' : 'Independent', 'name' : 'FBS Independents'};
  }
}

function getTeamId(teamAbbrev) {
  Object.prototype.getKeyByValue = function(value) {
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
             if (this[prop] === value)
                 return prop;
        }
    }
  }

  return teamNames.getKeyByValue(teamAbbrev);
}

function createESPNGame(gameEvent) {
    var game = {};
    game.espn_id = gameEvent.id;
    game.season = gameEvent.season.year;
    game.date = gameEvent.date;
    game.attendance = gameEvent.competitions[0].attendance;

    game.venue = {};
    game.venue.name = gameEvent.competitions[0].venue.fullName;
    game.venue.city = gameEvent.competitions[0].venue.address.city;
    game.venue.state = gameEvent.competitions[0].venue.address.state;
    if (gameEvent.competitions[0].notes && gameEvent.competitions[0].notes.length > 0) {
      game.headline = gameEvent.competitions[0].notes[0].headline;
    } else {
      game.headline = '';
    }
    game.scores = {};
    game.scores.home = gameEvent.competitions[0].competitors[0].score;
    game.scores.away = gameEvent.competitions[0].competitors[1].score;

    //Game Status
    game.status = {};
    game.status.clock = gameEvent.status.displayClock;
    game.status.type = gameEvent.status.type.name;
    if (game.status.type == 'STATUS_FINAL' || game.status.type == 'STATUS_SCHEDULED') {
      if (parseInt(game.scores.home) > parseInt(game.scores.away)) {
        game.winner = 'home';
      } else if (parseInt(game.scores.home) < parseInt(game.scores.away)) {
        game.winner = 'away';
      } else {
        game.winner = null;
      }

      if (game.status.type == 'STATUS_FINAL') {
        game.status.period = 'F';
        if (gameEvent.status.period > 4) {
          game.status.period = 'F/' + (gameEvent.status.period - 4) + 'OT';
        }
      } else {
        game.status.period = 'S';
      }
    } else {
      if (gameEvent.status.period > 5) {
        game.status.period = (gameEvent.status.period - 4) + 'OT';
      } else {
        game.status.period = 'Q' + gameEvent.status.period;
      }
    }

    //Odds
    game.odds = {};
    if (gameEvent.competitions[0].odds) {
      game.odds.spread = gameEvent.competitions[0].odds[0].details;
      game.odds.overUnder = gameEvent.competitions[0].odds[0].overUnder;
    } else {
      game.odds.spread = 'N/A';
      game.odds.overUnder = 'N/A';
    }

    //Teams
    game.homeTeam = createESPNTeam(gameEvent.competitions[0].competitors[0]);
    game.awayTeam = createESPNTeam(gameEvent.competitions[0].competitors[1]);
    return game;
}

function insertESPNGame(gameEvent) {
    // pool.query('SELECT count(1) FROM cfb_espn.games WHERE espn_id = $1', [gameEvent.id], (err, res) => {
    //     if (err) {
    //         console.error(err);
    //     } else if (res.rows[0].count == 0) {
    //         console.log('Game ' + gameEvent.id + ' doesn\'t exist');
    //         var game = createESPNGame(gameEvent);
    //         // insert JSON into SQL
    //         pool.query('INSERT INTO cfb_espn.games(espn_id, json) values($1, $2)', [gameEvent.id, JSON.stringify(game)], (err, res) => {
    //             if (err) {
    //                 console.error(err);
    //             }
    //             console.log('Game ' + gameEvent.id + ' saved successfully');
    //         });
    //     } else {
    //         // game already exists in db
    //         console.log('Game ' + gameEvent.id + ' exists');
    //     }
    // });

    db.any('SELECT count(1) FROM cfb_espn.games WHERE espn_id = $1', [gameEvent.id])
    .then(result => {
        if (result[0].count == 0) {
            console.log('Game ' + gameEvent.id + ' doesn\'t exist');
            var game = createESPNGame(gameEvent);
            // insert JSON into SQL
            db.none('INSERT INTO cfb_espn.games(espn_id, json) values($1, $2)', [gameEvent.id, JSON.stringify(game)])
            .then(() => {
                console.log('Game ' + gameEvent.id + ' saved successfully');
            })
            .catch(error => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            console.log('Game ' + gameEvent.id + ' exists');
        }
    })
    .catch(error => {
        if (error) {
            console.error(error);
        }
    });
}

function createESPNTeam(competitorDict) {
  var team = {};
  team.id = competitorDict.team.id;
  team.location = competitorDict.team.location;
  team.name = competitorDict.team.name;
  team.abbreviation = competitorDict.team.abbreviation;
  team.displayName = competitorDict.team.displayName;
  team.color = competitorDict.team.color;
  team.logoUrl = competitorDict.team.logo;

  team.links = {};
  if (competitorDict.team.links && competitorDict.team.links.length > 0) {
    for (var i = 0; i < competitorDict.team.links.length; i++) {
      var linkDict = competitorDict.team.links[i];
      team.links[linkDict.rel[0]] = linkDict.href;
    }
  }

  team.conference = getConference(competitorDict.team.conferenceId);
  team.rank = competitorDict.curatedRank.current;

  team.records = {};
  if (competitorDict.records && competitorDict.records.length > 0) {
    if (competitorDict.records.length == 3) {
      team.records.overall = competitorDict.records[0].summary;
      team.records.home = competitorDict.records[1].summary;
      team.records.away = competitorDict.records[2].summary;
    } else if (competitorDict.records.length == 4) {
      team.records.overall = competitorDict.records[0].summary;
      team.records.conference = competitorDict.records[1].summary;
      team.records.home = competitorDict.records[2].summary;
      team.records.away = competitorDict.records[3].summary;
    } else {
      team.records.overall = competitorDict.records[0].summary;
    }
  }

  return team;
}

function updateDBData(date) {
    console.log('Starting update at', moment().format('MMMM Do YYYY, h:mm:ss a'));
    var start = new Date();
    var dateString = moment(date).format('YYYYMMDD');
    var url = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?calendartype=blacklist&dates=' + dateString;

    http.get(url, (res) => {
        var body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });

        res.on('end', function() {
          var cfbResponse = JSON.parse(body);
          if (cfbResponse.events) {
            for (var i = 0; i < cfbResponse.events.length; i++) {
              var gameEvent = cfbResponse.events[i];
              console.log('Processing game ' + gameEvent.id + '...');
              insertESPNGame(gameEvent);
            }
          }
          db.none('INSERT INTO cfb_espn.updates(retrieved_date, status) values($1, $2);', [dateString,'success'])
          .then(() => {
              var end = new Date();
              var diff = (end - start);
              console.log('Update completed successfully in ' + diff + ' ms.');
          })
          .catch(error => {
              if (error) {
                  console.error('Update INSERT failed with error: ', error);
              }
          });
        });
    }).on('error', function(error) {
        // add update with error
        console.error('HTTP GET failed with error: ', error);
        db.any('INSERT INTO cfb_espn.updates(retrieved_date, status, message) values($1, $2, $3);', [dateString,'error', JSON.stringify(error)])
        .then(() => {
            var end = new Date();
            var diff = (end - start);
            console.log('Update completed with error in ' + diff + ' ms. Error below.');
            console.log(error);
        })
        .catch(error => {
            if (error) {
                console.error('Update INSERT failed with error: ', error);
            }
        });
    });
}

function checkForUpdatedData(date) {
    var update = {};
    db.any('SELECT * FROM cfb_espn.updates ORDER BY created_at DESC LIMIT 1;')
    .then(res => {
        if (res.rows > 0) {
            update = res.rows[0];
            var updateQ = (moment(date) > moment(update.created_at).add(1, 'days')) ? 'Yes' : 'No';
            console.log('Last update: \n' + JSON.stringify(update) + '\n\nShould update? ' + updateQ);
            // { retrieved_date: '20171225', status: 'success', created_at: '2017-12-25T0:00:00Z' }

            if (update == null || moment(date) > moment(update.created_at).add(1, 'days')) {
                // reload with new data
                console.log('Needs data update...');
                updateDBData(date);
            } else {
                console.log('Last updated at ', moment(update.created_at).format('MMMM Do YYYY, h:mm:ss a'));
            }
        }
    })
    .catch(error => {
        if (error) {
            console.log(error.stack);
        }
    });
}


//checkForUpdatedData(new Date());
// console.log(moment(new Date(2017, 8, 4)).format('MMM DD, YYYY'));
updateDBData(new Date(2018, 9, 1));
