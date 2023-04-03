const express=require('express');
const path=require('path');
const fs = require('fs');
const cmd=require('node-cmd');
const execSync=require('child_process').execSync;
const child_process=require('child_process');
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('./public/index.html')
  }


  app.whenReady().then(() => {
    createWindow()

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
      })

  })

const eapp=express();

//Define paths for Static and Dynamic Assets
const publicDirFolder=path.join(__dirname,'/public');
const packageFolder=path.join(publicDirFolder,'/packages');


//Set the paths for static files to serve
eapp.use(express.static(publicDirFolder))
eapp.use(express.json());



eapp.get('',(req,res)=>{
    res.render('index');
});

eapp.post('/moveCourse',async (req,res)=>{
    
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
            try{
                let ops='/S /F /I /E';
                await new Promise(async(resolve)=>{
                    await moveDirectory(coursePath,fPath,ops);
                    resolve();
                })

                res.send({
                    msg:'success'
                });
                
            }catch(e){
                console.log(e);
                res.send({
                    msg:'failed'
                });
            }
           
           
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




eapp.listen(3100,()=>{
    console.log("Server is up in 3100 port");
})