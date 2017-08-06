console.log('Loaded!');
var button = document.getElementById("counter");

button.onclick = function(){
    
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==XMLHttpRequest.DONE){
        if(request.status==200){
            var counter = request.responseText;
            var span = document.getElementById("count");
            span.innerHTML  = counter.toString();
        }
    }
    
      
  };
  request.open('GET',"http://ee16b026.imad.hasura-app.io/counter",true);
  request.send(null);
  
};

var submit = document.getElementById("submit_btn");


submit.onclick=function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
    if(request.readyState==XMLHttpRequest.DONE){
        if(request.status==200){
            var nameinput = document.getElementById("name");
            var name = nameinput.value;
            var names = request.responseText;
            names = JSON.parse(names);
            
            var ls = "";
            for(var i=0;i<names.length;i++){
                ls+='<li>'+names[i]+'</li>';
            }
            var ul = document.getElementById("namelist");
            ul.innerHTML = ls;
        }
    }
};

request.open('GET',"http://ee16b026.imad.hasura-app.io/submit-name?name="+name,true);
request.send(null);

};


































