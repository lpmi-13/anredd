var express = require('express'),
	http    = require('http'),
	favicon = require('serve-favicon'),
	bodyparser = require('body-parser'),
	app		= express();


app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname, 'public'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(favicon(__dirname + '/public/favicon.ico'));

function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

var url = 'http://www.reddit.com/r/WritingPrompts/.json'

http.get(url, function(res) {
	var body = '';

	res.on('data', function(chunk) {
		body += chunk;
	});

	res.on('end', function() {
		var prompts = JSON.parse(body);
		var valz = getValues(prompts, 'title');
		
		var vArr = valz.map(function(t) {
			if (t.indexOf('[WP]') >= 0) {
				return t;
			}
		});
		console.log(vArr);
		app.get('/', function(req, res) {
			res.render('index', {rez: vArr});
		})
		// console.log(valz);
	});

}).on('error', function(e) {
	console.log("got error: ", e);
});

//THIS WORKS!!!!!
// var site = 'http://www.reddit.com/r/WritingPrompts/comments/3c5yg6/wp_the_monster_in_the_closet_finally_lures_the/.json?sort=top';

// http.get(site, function(res) {
//     var body = '';

//     res.on('data', function(chunk) {
//         body += chunk;
//     });

//     res.on('end', function() {
//         var redditResponse = JSON.parse(body)
//         var valz = getValues(redditResponse, 'body');
//         console.log("Got response: ", valz[5]);
//     });
// }).on('error', function(e) {
//       console.log("Got error: ", e);
// });

app.listen(process.env.PORT);