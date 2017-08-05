var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
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
            <div>${date}</div>
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

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/:articleName', function (req, res) {
    var articleName= req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
