let clock_time = {
    h:0,
    m:0,
    s:0
}
let is_time_study = true;
let isPlay = false;
let studyTime = {h:0,m:25,s:0}
let restTime = {h:0,m:5,s:0}
const clock = document.querySelector("#clock");
const clock_state = document.querySelector("#clock_state");
const play = document.querySelector("#play");
const pause = document.querySelector("#pause");
const config = document.querySelector("#config");
const configSave = document.querySelector("#config_save");
const configButton = document.querySelector("#config_button");
const inputStudy = document.querySelector("#input_study");
const inputRest = document.querySelector("#input_relax");


const parseTime = (timeValue) =>{
    const time = {
        h:0,
        m:0,
        s:0
    }

    if(timeValue){
        const valueString = timeValue.split(':');
        time.h = parseInt(valueString[0]);
        time.m = parseInt(valueString[1]);
        time.s = 0;
    }

    return time;
}

const changeClock = (time,node) => {
    let {h,m,s} = time;
    if(h < 10){
        h= '0'+h;
    }
    if(m < 10){
        m= '0'+m;
    }
    if(s < 10){
        s= '0'+s;
    }
    node.textContent = `${h}:${m}:${s}`;
}
const changeInputTime = (time,node) => {
    let {h,m,s} = time;
    if(h < 10){
        h= '0'+h;
    }
    if(m < 10){
        m= '0'+m;
    }
    if(s < 10){
        s= '0'+s;
    }
    node.value = `${h}:${m}`;
}

const compararTime = (time1,time2) => {
    if(time1.h < time2.h){
        return -1;
    }else if(time1.h == time2.h){
        if(time1.m < time2.m){
            return -1;
        }else if(time1.m == time2.m){
            if(time1.s < time2.s){
                return -1;
            }else if(time1.s == time2.s){
                return 0;
            }
        }
    } 
    return 1
    
}
const increment1Second = (time) => {
    time.s++;
    if(time.s >= 60){
        time.s=0
        time.m++;
    }
    if(time.m >= 60){
        time.m=0;
        time.h++;
    }
    if(time.h >= 24){
        time.h=0;
    }
}

configButton.addEventListener("click",(e)=>{
    e.preventDefault();
    config.classList.toggle("navigation-phone");
    config.classList.toggle("navigation-none");
    configButton.classList.toggle("button-active");
})

configSave.addEventListener("click",(e)=>{
    e.preventDefault();
    const study = parseTime(inputStudy.value);
    const rest = parseTime(inputRest.value);
    if(compararTime(rest, {h:0,m:1,s:0}) >= 0 && compararTime(study, {h:0,m:1,s:0}) >= 0){
        studyTime = study;
        restTime = rest;
        clock_time = {
            h:0,
            m:0,
            s:0
        }
        changeClock(clock_time,clock);
    }
})

play.addEventListener("click",(e)=>{
        e.preventDefault();
        play.classList.toggle("button-active",true);
        pause.classList.toggle("button-active",false);
        isPlay = true;
    })

pause.addEventListener("click",(e)=>{
        e.preventDefault();
        pause.classList.toggle("button-active",true);
        play.classList.toggle("button-active",false);
        isPlay = false;
    })


{
    document.addEventListener("DOMContentLoaded",()=>{
        document.querySelectorAll('svg[data-src]').forEach(svg => {
            fetch(svg.dataset.src)
                .then(data=>data.text())
                .then(xml=> {
                    svg.innerHTML = xml;
                    svg.querySelector("svg").classList.add("svg");
                })
        })

    })
    changeInputTime(studyTime,inputStudy);
    changeInputTime(restTime,inputRest);
    changeClock(clock_time,clock);
    const audio = document.createElement("audio");
    audio.setAttribute("src", "media/audio/music_efect_258193__kodack__beep-beep.wav");
    audio.loop = true;
    audio.preload = "auto";
    document.body.appendChild(audio);
    setInterval(()=>{
        if(isPlay){
            let time_total;
            if(is_time_study){
                time_total = studyTime;
            }else{
                time_total = restTime;
            }
            if(compararTime(clock_time,time_total) < 0){
                increment1Second(clock_time);
            }else{
                clock_time.h = 0;
                clock_time.m = 0;
                clock_time.s = 0;
                is_time_study = !is_time_study;
                audio.play()
                    .then(()=>{
                        setTimeout(()=>{
                            audio.pause();
                        },1500);
                    })
                    .catch(()=>{
                        console.log("error in sound");
                    })
                clock_state.textContent =  is_time_study? "Study time":"relax time"
            }
            changeClock(clock_time,clock);
        }         
    },1000)
}