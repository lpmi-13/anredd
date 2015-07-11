var express = require('express'),
    favicon = require('serve-favicon'),
    bodyparser = require('body-parser'),
    r       = require('nraw'),
    app     = express();


app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname, 'public'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(favicon(__dirname + '/public/favicon.ico'));

var reddit = new r("reddz v0.0.1");

app.get('/', function(req, res) {
	reddit.subreddit("WritingPrompts").exec(function(data) {
		if (data) {
		var topics =  getValues(data, 'title');
		var id = getValues(data, 'id');
		var wpz = [];
		// only get prompts that have WP
		var tArr = topics.map(function(t) {
			if ((t.indexOf('WP') >= 0) || (t.indexOf('wp') >= 0)) {
				wpz.push(topics.indexOf(t));
				return t;
			}
		});
		var good_ids = [];

		for (i = 0; i < wpz.length; i++) {
			good_ids[i] = id[wpz[i]];
		}
		}
	    res.render('index', {titlez: tArr, idz: good_ids});
	});
});

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

app.post('/', function(req, res) {
	var id = req.body.url;
	reddit.subreddit("WritingPrompts").post(id).exec(function(data) {
		var comments = getValues(data, 'body');
		
		var story = comments.sort(function (a, b) { return b.length - a.length; })[0];
		
		var tButton = '<select class="the btn" name="the"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

        var anButton = '<select class="an btn" name="an"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

        var aButton = '<select class="a btn" name="a"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

		res.end(story);
		});
	});

app.listen(3000);