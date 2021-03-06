var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser');
var config = {
  user : 'ee16b026',
  database:'ee16b026',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); 
var articles={
    'article-one': {
    title:'article-one',
    heading:'article one',
    date: 'sep 5 2015',
    content:` <p>
                this is article one of my server
            </p>
             <p>
                this is article one of my server
            </p>`
},
   'article-two':{
        title:'article-two',
        heading:'article two',
        date: 'sep 10 2015',
        content:` <p>
                this is article two of my server
            </p>
             <p>
                this is article two of my server
            </p>`
        
    },
    'article-three':{
    title:'article-three',
    heading:'article three',
    date: 'sep 15 2015',
    content:` <p>
                this is article three of my server
            </p>
             <p>
                this is article three of my server
            </p>`
    }
};
function createTemplate(data){
    
    var title=data.title;
    var content=data.content;
    var heading=data.heading;
    var date=data.date;
    var htmlTemplate= `    
    <html>
    <head>
    <title>
    ${title}
    </title>
    <link href="/ui/style.css" rel="stylesheet" />
    <meta name="viewport" content = "width= device-width" ,intial-scale=1>
    </head>
    <body>
        <div class = "container">
            <div>
                <a href="/">Home</a>
                
            </div>
            <hr/>
            <h3>${heading}</h3>
            <div>${date.toDateString()}</div>
            <div>
                <p>
                    ${content}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    return htmlTemplate;

}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool = new Pool(config);
app.get('/test-db',function(req,res){
   pool.query('SELECT * FROM test', function(err,result){
       if (err){
           res.status(500).send(err.toString());
       }
       else{
           res.send(JSON.stringify(result.rows));
       }
       
   }); 
   
});
function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');   
    return ['pbkdf2',"10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
   var hashString =  hash(req.params.input,'this-is-some-random-string');
   res.send(hashString);
});
app.post('/create-user',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
   var salt = crypto.randomByte(128).toString('hex');
   var dbString =  hash(password,salt);
   pool.query('INSERT INTO "user"(username,password) VALUES($1,$2)',[username,dbString],function(){
      if (err){
           res.status(500).send(err.toString());
       }
       else{
           res.send('username created succesfully'+username);
       } 
   });
});
var counter = 0;
app.get("/counter",function(req,res){
   counter = counter +1;
   res.send(counter.toString());
});
var names= [];
app.get('/submit-name',function(req,res){
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/articles/:articleName', function (req, res) {
   pool.query("SELECT *FROM article WHERE title ='"+ req.params.articleName +"'",function(err,result){
      if(err){
          res.status(500).send(err.toString());
      } else{
          if(result.rows.length === 0){
              res.status(404).send('not found');
          }
          else{
              var Data = result.rows[0];
              res.send(createTemplate(Data));
          }
      }
   });
});



































// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
