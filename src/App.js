import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import { StatusIndicator } from 'evergreen-ui'

var options = {
  timeout: 3000,
  permanentTestInterval: 30000,
  recordDuration: 15000
}
// var headers_data = new Headers({
//   'Authorization': `Basic ${btoa(config.username + ':' + config.password)}`,
//   'Access-Control-Allow-Origin': '*',
//   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
// });

function App() {
  const [statusDevices, setstatusDevices] = useState([]);
  const [stats, setStats] = useState([]);
  const [videoInputs, setvideoInputs] = useState([]);
  const [videoStats, setvideoStats] = useState([]);
  const [audioInputs, setAudioInputs] = useState([]);
  const [AudioStatus, setAudioStatus] = useState('No audio');

  useEffect(() => {
    
    const fetchDeviceStatus = async () => {fetch('https://iu-project-api.herokuapp.com/status',
    {headers:{ 'Authorization': `Basic ${btoa("admin" + ':' + "t3st1u1999")}`},
    'Content-Type': 'application/json'})
      .then(result => {
        result.text().then(text =>{
          console.log(text)
          if(text !== 'RETRY'){
        const device_stats = text.split(',').slice(0,4);
        let devices = [device_stats[0].split(':')[0],
        device_stats[2].split(':')[0]];
        let stats = [device_stats[1],
        device_stats[3]];
        setstatusDevices(devices);
        setStats(stats);
          }
        }).then(
          fetch('https://iu-project-api.herokuapp.com/InputStatus',
          {headers:{ 'Authorization': `Basic ${btoa("admin" + ':' + "t3st1u1999")}`},
          'Content-Type': 'application/json'})
            .then(result => {
              const status = result.data
              result.text().then(text =>{
                console.log('input status', text)
                if(text !== 'RETRY'){
                  const videoStats = text.split(';');
                  let videoInputs = [videoStats[0].split(':')[0],
                  videoStats[1].split(':')[0]];
                  let vidStats = [videoStats[0].split(':')[1],
                  videoStats[1].split(':')[1]];
                  setvideoInputs(videoInputs);
                  setvideoStats(vidStats);
                }
              }).then(
                fetch('https://iu-project-api.herokuapp.com/AudioStatus',
                {headers:{ 'Authorization': `Basic ${btoa("admin" + ':' + "t3st1u1999")}`},
                'Content-Type': 'application/json'})
                  .then(result => {
                    result.text().then(text =>{
                      if(text !== 'RETRY'){
                      const audioInputs = [text.split(':')[1]];
                      if (audioInputs.length<2){
                        setAudioStatus('No Audio');
                      }
                      else{
                        setAudioStatus('Audio Present');
                      }
                      setAudioInputs(audioInputs);
                    }
                    })
                    
                  })
              )
            })
        )
      })
      }
      fetchDeviceStatus();
      const interval = setInterval(() => fetchDeviceStatus(), 30000)
        return () => {
          clearInterval(interval);
        }
  }, [])
  
  
    
  // useEffect(() => {
  //   const fetchVideoStatus = async () =>{
  //     if(!!statusDevices) {
  //   fetch('http://localhost:3001/InputStatus',
  //   {headers:{ 'Authorization': `Basic ${btoa("admin" + ':' + "t3st1u1999")}`},
  //   'Content-Type': 'application/json'})
  //     .then(result => {
  //       const status = result.data
  //       result.text().then(text =>{
  //         console.log('input status', text)
  //         if(text !== 'RETRY'){
  //           const videoStats = text.split(';');
  //           let videoInputs = [videoStats[0].split(':')[0],
  //           videoStats[1].split(':')[0]];
  //           let vidStats = [videoStats[0].split(':')[1],
  //           videoStats[1].split(':')[1]];
  //           setvideoInputs(videoInputs);
  //           setvideoStats(vidStats);
  //         }
  //       })
  //     })
  //   }
  //   }
  //   fetchVideoStatus();
  //   const interval = setInterval(() => fetchVideoStatus(), 30000)
  //       return () => {
  //         clearInterval(interval);
  //       }
  // }, [statusDevices])

  // useEffect(() => {
  //   const fetchAudioStatus = async () =>{
  //     if(!!videoInputs) {
  //     fetch('http://localhost:3001/AudioStatus',
  //     {headers:{ 'Authorization': `Basic ${btoa("admin" + ':' + "t3st1u1999")}`},
  //     'Content-Type': 'application/json'})
  //       .then(result => {
  //         result.text().then(text =>{
  //           if(text !== 'RETRY'){
  //           const audioInputs = [text.split(':')[1]];
  //           if (audioInputs.length<2){
  //             setAudioStatus('No Audio');
  //           }
  //           else{
  //             setAudioStatus('Audio Present');
  //           }
  //           setAudioInputs(audioInputs);
  //         }
  //         })
          
  //       })
  //     }
  //     }
  //     fetchAudioStatus();
  //   const interval = setInterval(() => fetchAudioStatus(), 30000)
  //       return () => {
  //         clearInterval(interval);
  //       }
  // }, [videoInputs])


  return (
    <div className="App">
      <h2 className="bold-text" style={{ marginTop: 20 }}>Hardware Status</h2>
      {statusDevices.map((device, index)=> (
        <div  key = {index}>
        
        <h2 className="p-text" style={{ marginTop: 20 }}>{device}</h2>
        
          <StatusIndicator dotSize={20} color={stats[index] === 'OFF'?"danger":"success"}>
          </StatusIndicator> 
      </div>
      ))}
       <h2 className="bold-text" style={{ marginTop: 20 }}>Video Input</h2>
      {videoInputs.map((videoInput, index)=> (
        <div key = {index}>
        
        <p className="p-text" style={{ marginTop: 20 }}>{videoInput} {videoStats[index]}</p>
          <StatusIndicator dotSize={20} color={videoStats[index].toLowerCase().trim() === 'no video input'?"danger":"success"}>
          </StatusIndicator> 
      </div>
      ))
      }

      <h2 className="bold-text" style={{ marginTop: 20 }}>Audio Input</h2>
      {audioInputs.map((audioInput, index)=> (
        <div key = {index}>
        <p className="p-text" style={{ marginTop: 20 }}>{audioInput}{AudioStatus[index]}</p>
          <StatusIndicator dotSize={20} color={AudioStatus[index].toLowerCase().trim() === 'no audio'?"danger":"success"}>
          </StatusIndicator> 
      </div>
      ))
      }

    </div>
    
    
  );
}

export default App;
