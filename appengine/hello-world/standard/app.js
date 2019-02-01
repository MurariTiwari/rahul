/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_node_request_example]
const express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expresslayout=require('express-ejs-layouts');
const Pool=require('pg').Pool;
const app = express();


const config={
  max: 1,
	user:'postgres',
	database:'postgres',
	password:'@Rahul11'
}

config.host=`/cloudsql/ayushman-226612:asia-south1:new-db-1`;

var pool=new Pool(config);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(expresslayout)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res
    .status(200)
    .render(`dash`,{page:"dash"});
});

app.post('/del',(req,res)=>{
  pool.query("delete from customer where cid=($1);",[req.body.o],function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });
})


app.post('/delEmployee',(req,res)=>{
  pool.query("delete from salary where sid=($1);",[req.body.o],function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      pool.query("delete from employee where eid=($1);",[req.body.o],function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });

    }
  });
})

app.post('/add',(req,res)=>{

  
   var data=JSON.parse(req.body.o);
  pool.query("insert into customer(name,phone,email,gst,address)values($1,$2,$3,$4,$5);",[data.name,data.phone,data.email,data.gst,data.address],function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });


  });


  app.post('/edit',(req,res)=>{

  
    var data=JSON.parse(req.body.o);
    if(data.adv=="")
    data.adv=0;
    if(data.due=="")
    data.due=0;
   pool.query(" update customer set name=$1,phone=$2,email=$3,gst=$4,address=$5,advance=$6,dues=$7 where cid=$8",[data.name,data.phone,data.email,data.gst,data.address,data.adv,data.due,data.id],function(err,results)
   {
     if (err) {
       console.error(err);
       res.status(500).send(err);
     } else {
       res.send(JSON.stringify(results));
     }
   });
 
 
   });

app.post('/addEmployee',(req,res)=>{
  var data=JSON.parse(req.body.o);
  pool.query("insert into employee(name,fname,phone,email,designation,date,gender,state,address)values($1,$2,$3,$4,$5,$6,$7,$8,$9);",[data.name,data.fname,data.phone,data.email,data.designation,data.date,data.gender,data.state,data.address],function(err,results){
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  })

})




app.post('/viewEmployee',(req,res)=>{
  var data=JSON.parse(req.body.o);
  
  pool.query("select * from employee,salary where employee.eid=$1 and salary.sid=$1;",[data],function(err,results){
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      
      res.send(JSON.stringify(results.rows[0]));

    }
  })

})

app.post('/viewCustomer',(req,res)=>{
  var data=JSON.parse(req.body.o);
  
  pool.query("select * from customer where cid=$1",[data],function(err,results){
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      
      res.send(JSON.stringify(results.rows[0]));

    }
  })

})

app.post('/viewSalary',(req,res)=>{
  var data=JSON.parse(req.body.o);
  
  pool.query("select * from salary where sid=$1;",[data],function(err,results){
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results.rows[0]));
    }
  })

})



app.post('/addSalary',(req,res)=>{
  var data=JSON.parse(req.body.o);
  pool.query("insert into salary(sid,pfno,pfaccno,inc,pf,sal,hra)values($1,$2,$3,$4,$5,$6,$7);",[data.id,data.pfno,data.pfaccno,data.inc,data.pf,data.sal,data.hra],function(err,results){
    if (err) {
      pool.query("update salary set pfno=$1,pfaccno=$2,inc=$3,pf=$4,sal=$5,hra=$6 where sid=$7",[data.pfno,data.pfaccno,data.inc,data.pf,data.sal,data.hra,data.id],function(err,results){
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send(JSON.stringify(results));
        }
      })
    } else {
      res.send(JSON.stringify(results));
    }
  })
})


  app.post('/addSupplier',(req,res)=>{
     
   var data=JSON.parse(req.body.o);
  
   pool.query("insert into supplier(name,phone,email,gst,address,state)values($1,$2,$3,$4,$5,$6);",[data.name,data.phone,data.email,data.gst,data.address,data.state],function(err,results)
    {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }
    });
    
  })

  app.post('/addstock',(req,res)=>{

  
    var data=JSON.parse(req.body.o);
   if(data.hsn=="")
    data.hsn=0;
    console.log(data)
   pool.query("insert into stock(date,category,company,model,uom,quantity,hsn,pprice,bprice,sprice,detail)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);",[data.date,data.category,data.company,data.model,data.uom,parseInt(data.quantity),parseInt(data.hsn),parseInt(data.pprice),parseInt(data.bprice),parseInt(data.sprice),data.detail],function(err,results)
   {
     if (err) {
       console.error(err);
       res.status(500).send(err);
     } else {
       res.send(JSON.stringify(results));
     }
   });
 
 
   });
 




app.get('/expense', (req, res) => {
  res
    .status(200)
    .render(`expense`,{page:"expense",tab:"expense"});
});


app.get('/supplier', (req, res) => {

  pool.query("select * from supplier",function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res
      .status(200)
      .render(`expense`,{page:"expense",tab:"supplier",res:results});
    }
  });

 
});


app.get('/purchase', (req, res) => {
  res
    .status(200)
    .render(`expense`,{page:"expense",tab:"purchase"});
});

app.get('/employee', (req, res) => {
  pool.query("select * from employee",function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
  res
    .status(200)
    .render(`employee`,{page:"employee",res:results});
}})
});
app.get('/return', (req, res) => {
  res
    .status(200)
    .render(`return`,{page:"return"});
});

app.get('/report', (req, res) => {
  res
    .status(200)
    .render(`report`,{page:"report"});
});
app.get('/invoice', (req, res) => {
  res
    .status(200)
    .render(`sales`,{page:"sales",tab:"invoice"});
});
app.get('/customer', (req, res) => {
  pool.query("select * from customer",function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res
    .status(200)
    .render(`sales`,{page:"sales",tab:"customer",res:results});
    }
  })
  });
app.get('/stock', (req, res) => {

  pool.query("select * from stock",function(err,results)
  {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res
    .status(200)
    .render(`sales`,{page:"sales",tab:"stock",res:results});
    }
  })
  
});
app.get('/sales', (req, res) => {
  res
    .status(200)
    .render(`sales`,{page:"sales",tab:"all"});
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]
