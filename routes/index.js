var express = require('express');
var router = express.Router();

var employeeModel = require('../modules/employee');
const { route } = require('./users');
var employeeDetails = employeeModel.find();

/* GET home page. */

router.get('/', function(req, res, next){
      employeeDetails.exec((err, data) => {
        if (err) throw err;
        else {
            res.render('index', {title: "Sample Domino's Employee Information",data: data, success:'',record : ''});
        }
    })
});

router.get('/upload',(req, res)=>{
    res.send('upload your image');
})

router.post('/', (req, res, next) => {
    var employee =new employeeModel({
        name: req.body.name,
        email: req.body.email,
        etype: req.body.etype,
        hourlyRate: req.body.hourlyRate,
        totalHour: req.body.totalHour,
        total: parseInt(req.body.hourlyRate) *
            parseInt(req.body.totalHour)
    });

    employee.save((err, savedData)=>{
      
        if(typeof savedData ==='undefined'){
            res.redirect('/')
         }
        else{
            employeeDetails.exec((err,data)=>{
                if(err) throe (err);
                res.render('index',{title : '', data : data, success : 'Data has been inserted Successfully',record :''});
            })
        }
      
    })
})

router.post('/search/', (req, res, next)=> {
    var fltName = req.body.fltName;
    var fltEmail = req.body.fltEmail;
    var fltType = req.body.fltEtype;
    
    if(fltName !='' && fltEmail !='' && fltType !=''){
        var fltDetails = {
            $and : [
                {name : fltName},{$and : [{email:fltEmail, etype :fltEtype}]}
            ]

        }
    }
    else if(fltName =='' && fltEmail !='' && fltType !=''){
        var fltDetails = {
            $and : [
                {email : fltEmail},
                {$or : [{name:fltName}, {etype : fltEtype}]}
            ]
             } 
    }
     else if(fltName !='' && fltEmail =='' && fltType ==''){
        var fltDetails = {
            $or : [{name: fltName},
                {$or:[{email: fltEmail}, {etype : fltType}]}
            ]
        } 
    }
    else if(fltEmail !='' && fltName =='' && fltType ==''){
        var fltDetails = {
            $or : [{email: fltEmail},
                {$or:[{name: fltName},{etype : fltType}]}
            ]
        } 
    }

     else if(fltEmail !='' && fltName !='' && fltType ==''){
        var fltDetails = {
            $or : [{email: fltEmail, name: fltName},
                {$or:[{etype : fltType}]}
            ]
        } 
    }
      else if(fltName =='' && fltType !='' && fltEmail ==''){
        var fltDetails = {
            $or: [{etype: fltType},
                {$or:[{ email: fltEmail, etype : fltName}]}
            ]
        } 
    }
  
    else{
        var fltDetails = {}
    }
 var empFltrDetails = employeeModel.find(fltDetails);
  empFltrDetails.exec((error, srchdata) => {
    if (error) {
       console.log(error);
    } else {
        // console.log(srchdata)
        res.render('index', {title:'',success : '',data: srchdata, record : 'Record has been found' });
    }
})
})


router.get('/edit/:id',  (req, res, next)=>{
    var id = req.params.id;
    var editDetails = employeeModel.findByIdAndUpdate(id);
     editDetails.exec(function(err,editData){
        if(err)  return handleError(err);
        res.render('edit',{data : editData})
     });
   
})

router.post('/edit/', async (req, res, next)=>{
    var id =req.body.id;
    var eName = req.body.edtName;
    var eMail = req.body.edtEmail;
    var eType = req.body.edtEtype;
    var eHourRate = req.body.edtHourRate;
    var eTotalHour = req.body.edtTotalHour;
    var eTotal = eHourRate* eTotalHour;
 employeeModel.findByIdAndUpdate(id,{
    name: eName,
    email: eMail,
    etype: eType,
    hourlyRate: eHourRate,
    totalHour: eTotalHour,
    total: eTotal
},(err,edtData)=>{
    if(err) return handleError(err);
    res.redirect('/')
});
})



router.get('/delete/:id',(req, res, next)=>{
    var id = req.params.id;
   var deleteRecord =  employeeModel.findById(id);
     deleteRecord.exec((err, delRecord)=>{
       if (err)  return handleError(err);
       res.render('delete',{data : delRecord})
   })
})

router.post('/delete/', (req, res,next)=>{
    var id =req.body.id;
    employeeModel.findByIdAndDelete(id,(err,data)=>{
        if(err)  return handleError(err);
        res.redirect('/');
    })

})

module.exports = router;