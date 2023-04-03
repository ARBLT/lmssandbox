var scormData=[];
var tableElm=document.querySelector('#event_table');
var scormElm=document.querySelector('#event_data');
var formElm=document.querySelector('form');
var folderElm=document.querySelector('#sourceFolder');
var fileElm=document.querySelector('#rootFile');
var playerElm=document.querySelector('#player');


var count=0;
var folder,file;

if ( ! FakeLMS.isAvailable()) {
    console.log("Can't use fake LMS with this browser, sorry");
}


// you may want the following line before calling attachLMSAPIToWindow()
// so that functions returning booleans return them as strings, as some LMS APIs do in real life
FakeLMS.returnBooleanStrings = true;
 
 
FakeLMS.attachLMSAPIToWindow();
console.log('Now window.API\_1484\_11 is defined and will respond to LMS calls');
// you then can discover it like real LMS (see http://scorm.com/scorm-explained/technical-scorm/run-time/api-discovery-algorithms/)
 
// FakeLMS.clearData(); // if you need to remove all stored data, a fresh restart

this.onload=init();

function init(){
    
    readLocalStorage();
    updateScormTable();
  
}

formElm.addEventListener('submit',(event)=>{

    event.preventDefault();
    folder=folderElm.value;
    file=fileElm.value;

    let p={};
    p.folder=folder;

    fetch('http://localhost:3100/moveCourse',{
        method:'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body:JSON.stringify(p)
    }).then((response) => response.json())
    .then((data) =>{
        console.log(data);
        if(data.msg=="success"){
            let folders=folder.split('\\');
            let folderName=folders[folders.length-1];
            let path=`../packages/${folderName}/${file}`;
            console.log(path);
            playerElm.setAttribute("src",path);
        }
    });
});


window.addEventListener('storagechange',(event)=>{
    scormData=[];
    readLocalStorage();
    updateScormTable();
},false);



function readLocalStorage(){
  
    let temp={};
    temp.event="session_time";
    temp.data=window.localStorage.getItem('session_time');
    scormData.push(temp);
    temp={};
    temp.event="suspend_data";
    temp.data=window.localStorage.getItem('suspend_data');;
    scormData.push(temp);
    temp={};
    temp.event="lesson_status";
    temp.data=window.localStorage.getItem('lesson_status');;
    scormData.push(temp);
    // console.log(scormData);
}


function updateScormTable(){

    // tableElm.innerHTML='';

    count++;
    let countRow=document.createElement('tr');
    let thc=document.createElement('th');
    thc.innerHTML=`Update ${count}`;
    countRow.appendChild(thc);
    tableElm.appendChild(countRow);

    let thr=document.createElement('tr');
    let th1=document.createElement('th');
    let th2=document.createElement('th');
    th1.innerHTML="Event";
    th2.innerHTML="Data";
    thr.appendChild(th1);
    thr.appendChild(th2);
    tableElm.appendChild(thr);

    scormData.forEach(scorm => {      

        let tr=document.createElement('tr');
        let td1=document.createElement('td');
        let td2=document.createElement('td');
        td1.innerHTML=scorm.event;
        td2.innerHTML=scorm.data;
        // console.log(scorm.event);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableElm.appendChild(tr);
        // tableElm.appendChild(`<tr><td>${scorm.event}</td><td>${scorm.data}</td><tr>`)
    });
}


window.addEventListener("beforeunload",(event)=>{
    localStorage.removeItem('session_time');
    localStorage.removeItem('total_time');
    localStorage.removeItem('lesson_status');
    localStorage.removeItem('interactions');
    localStorage.removeItem('suspend_data');
});

