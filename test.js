setInterval(function(){						//always repeat the program
	
	var time = new Date();					//init time sturcture
	
	//get current time
	var s_min = time.getMinutes();
	var s_hour = time.getHours();
	var s_year = time.getFullYear();
	var s_month = time.getMonth() + 1;
	var s_day = time.getDate();

	s_min = parseInt(s_min / 15);			//nomalize minute
	
	/*
		start time handle:
		The system will update data every 15 minutes, which means for example:
		if it is 10:06, the system will update the data for 10:00 anytime between 10:00 and 10:15.
		Thus, the latest solid data we can fetch is data for 9:45.
		We rollback time for 15 minutes. Then special condition should be taken care of,such as:
		2015-01-01, 2015-03-01...
	*/
	if(s_min == 0){
		s_min = 45;
		s_hour = s_hour - 1;
		if(s_hour == -1){
			s_hour = 23;
			s_day = s_day - 1;
			if(s_day == 0){
				switch(s_month){
						case 12:
							s_day = 30;
							break;
						case 11:
							s_day = 31;
							break;
						case 10:
							s_day = 30;
							break;
						case 9:
							s_day = 31;
							break;
						case 8:
							s_day = 31;
							break;
						case 7:
							s_day = 30;
							break;
						case 6:
							s_day = 31;
							break;
						case 5:
							s_day = 30;
							break;
						case 4:
							s_day = 31;
							break;
						case 3:
							if (s_year % 100 == 0){
								if (s_year % 400 == 0)
								{
									s_day = 29;
								}
								else
								{
									s_day = 28;
								}
							}
							else{
								if (s_year % 4 == 0)
								{
									s_day = 29;
								}
								else
								{
									s_day = 28;
								}
							}
							break;
						case 2:
							s_day = 31;
							break;
						case 1:
							s_day = 31;
							break;
						
				}
				s_month = s_month - 1;
				if(s_month == 0){
					s_month = 12;
					s_year = s_year - 1;
				}
			}
		}
	}
	else{
		s_min = (s_min-1) * 15;
	}

	var e_min = s_min+15;
	var e_hour = s_hour;
	var e_year = s_year;
	var e_month = s_month;
	var e_day = s_day;
	
	/*	
		End time handle:
		We always fetch one data, thus the end time is 15 minutes later than begin time.
		Then special case should be taken care of. for example:
		2015-12-31, 2015-2-28...
	*/
	if(e_min == 60){
		e_min = 0;
		e_hour = e_hour + 1;
		if(e_hour == 24){
			e_hour = 0;
			e_day = e_day + 1;
			switch(e_month){
				case 1:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 2:
					if (e_year % 100 == 0){
						if (e_year % 400 == 0)
						{
							if(e_day == 29){
								e_day = 1
								e_month = e_month + 1;
							}
						}
						else
						{
							if(e_day == 28){
								e_day = 1
								e_month = e_month + 1;
							}
						}
					}
					else{
						if (e_year % 4 == 0)
						{
							if(e_day == 29){
								e_day = 1
								e_month = e_month + 1;
							}
						}
						else
						{
							if(e_day == 28){
								e_day = 1
								e_month = e_month + 1;
							}
						}
					}
					break;
				case 3:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 4:
					if(e_day == 31){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 5:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 6:
					if(e_day == 31){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 7:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 8:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 9:
					if(e_day == 31){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 10:
					if(e_day == 32){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 11:
					if(e_day == 31){
						e_day = 1;
						e_month = e_month + 1;
					}
					break;
				case 12:
					if(e_day == 32){
						e_day = 1;
						e_month = 1;
						e_year = e_year + 1;
					}
					break;
			}
		}
	}


	// Format the sending contant
	var cont = "https://monitoringapi.solaredge.com/site/969566/power?startTime="+s_year+'-'+s_month+'-'+s_day+'%20'+s_hour+':'+s_min+':00&endTime='+e_year+'-'+e_month+'-'+e_day+'%20'+e_hour+':'+e_min+':00&api_key=KR647NZKDEF2ILKO8B8OG3E50UL0IMJT'; 
	var power = 0;

	const https = require('https');	
	// Http send repuest
	https.get(cont, (resp) => {
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
		data += chunk;
	  });

	  // The whole response has been received. Print out the result and update it to database.
	  resp.on('end', () => {
		console.log(data);
		if(data[125] == 'n'){
				power = 0;
		}
		else{
			let i = 125;
			while(1){
				if(data[i] == '.')
				{
					break;
				}
				i = i + 1;
			}
			for(var a=125;a<i;a++){
				power = power*10 + parseInt(data[a]);
			}
		}
		
		// Connect to postgreSQL
		const pg = require('pg');
		var conString = "tcp://postgres:1234@localhost/mydatabase"; 
		const client =  new pg.Client(conString);
		
		// Send query
		var addSql = 'INSERT INTO PV_data(Date,PV_output) VALUES($1,$2)';
		var SQLString = s_year+'-'+s_month+'-'+s_day+' '+s_hour+':'+s_min+':00';
		var addSqlParams = [SQLString,power];
		client.connect(function(err) {
			if(err) {
			return console.error('connection failed', err);
			}
		});
		console.log(addSqlParams);
		client.query(addSql,addSqlParams,function(err,result){
			if(err){
				return console.error('failed',err);
			}
			else{
				client.end();
			}
		})
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
},1000000);	// Repeat every 1000000 ms




