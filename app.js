var express = require('express'),
  favicon = require('serve-favicon'),
  bodyparser = require('body-parser'),
  r = require('nraw'),
  // compress = require('compression'),
  app = express();

app.set('views', './views');
app.set('view engine', 'jade');

// app.use(compress());
app.use(express.static(__dirname, 'public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/public/favicon.ico'));

var reddit = new r('reddz v0.0.1');

app.get('/', function(req, res) {
  reddit.subreddit('WritingPrompts').exec(function(data) {
    if (data) {
      var topics = getValues(data, 'title');
      var id = getValues(data, 'id');

      var wpz = [];
      // only get prompts that have WP
      var tArr = topics.map(function(t) {
        if (t.indexOf('WP') >= 0 || t.indexOf('wp') >= 0) {
          wpz.push(topics.indexOf(t));
          return t;
        }
      });
      var good_ids = [];

      for (i = 0; i < wpz.length; i++) {
        good_ids[i] = id[wpz[i]];
      }
    }
    res.render('index', { titlez: tArr, idz: good_ids });
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
  reddit
    .subreddit('WritingPrompts')
    .post(id)
    .exec(function(data) {
      var comments = getValues(data, 'body');

      for (i = 0; i < comments.length; i++) {
        if (comments[i].indexOf('####') > 0) {
          comments[i] = 'x';
        }
      }
      var story = comments.sort(function(a, b) {
        return b.length - a.length;
      })[0];

      res.end(story);
    });
});

app.listen(process.env.PORT || 3000);
