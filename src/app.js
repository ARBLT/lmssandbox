const express=require('express');
const path=require('path');
const fs = require('fs');
const cmd=require('node-cmd');
const execSync=require('child_process').execSync;
const child_process=require('child_process');


const app=express();

//Define paths for Static and Dynamic Assets
const publicDirFolder=path.join(__dirname,'../public');
const packageFolder=path.join(publicDirFolder,'/packages');


//Set the paths for static files to serve
app.use(express.static(publicDirFolder))
app.use(express.json());



app.get('',(req,res)=>{
    res.render('index');
});

app.post('/moveCourse',async (req,res)=>{
    
            let coursePath=req.body.folder;
            console.log(coursePath)

            let folders=coursePath.split('\\');
            let folderName=folders[folders.length-1];
            let fPath=packageFolder+'\\'+folderName;

            try{
                fs.mkdirSync(fPath);
            }catch(e){
                console.log(e);
            }
            let ops='/S /F /I /E';
            await moveDirectory(coursePath,fPath,ops);
            res.send({
                msg:'success'
            });
    });


const moveDirectory=async(src,dest,opts)=>{
//    console.log("called");
    try{
        let p=child_process.execSync('xcopy '+src+' '+dest+' '+opts,(data,err)=>{
            console.log(`P is ${p}`);
            console.log(`Error is ${err}`);
            console.log(`Data is ${data}`);
            
            console.log("started processing");
           
          })
    }catch(e){
        console.log("Issue");
        console.log(e);
    }
}




app.listen(3100,()=>{
    console.log("Server is up in 3100 port");
})