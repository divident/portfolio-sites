import { useEffect, useState } from 'react';

import './App.css';
import CircleProgress from './CircleProgress';
import Timer from './Timer';
import settings from './settings.png';

function App() {

  const [progress, setProgresss] = useState(0);
  const [timers, setTimers] = useState({
    'pomodoro': 120,
    'short': 60,
    'long': 240
  });

  const [tmpTimers, setTmpTimers] = useState({
    'pomodoro': 2,
    'short': 1,
    'long': 4
  })

  const [timerName, setTimerName] = useState('pomodoro')
  const [timer, setTimer] = useState(timers['pomodoro'])
  const [stop, setStop] = useState(true);
  const [lastStep, setLastStep] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')
  const [primaryColor, setPrimaryColor] = useState('#f26d66')

  useEffect(() => {
    const step = 100 / timer;
    if (lastStep !== step) {
      setProgresss(0);
      setLastStep(step);
    }
    const interval = setInterval(() => setProgresss((state) => Math.min(state + step, 100)), 1000)
    if (stop) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, stop, lastStep]);


  const changeTimer = (index) => () => {
    setTimerName(index);
    setTimer(timers[index]);
  }

  const onApply = (ev) => {
    setShowSetting(s => !s)
    setTimers({
      pomodoro: tmpTimers.pomodoro * 60,
      short: tmpTimers.short * 60,
      long: tmpTimers.long * 60,
    });
  }

  const onTimeChange = (timer) => (ev) => {
    setTmpTimers(s => ({ ...s, [timer]: ev.target.value }))
  }

  const onFontChange = (font) => (ev) => {
    setFontFamily(font)
  }

  const onColorChange = (color) => (ev) => {
    setPrimaryColor(color);
    let bodyStyles = document.body.style;
    bodyStyles.setProperty('--bg-active', color);
    bodyStyles.setProperty('--text-primary', color);
  }

  return (
    <main className="flex main" style={{ fontFamily }}>
      <div><h1 className="text-secondary" style={{ fontSize: "3rem" }}>Pomodoro</h1></div>
      <ul className="timer-list">
        <li className={"timer-item " + (timerName === 'pomodoro' && "active")} onClick={changeTimer('pomodoro')}>pomodoro</li>
        <li className={"timer-item " + (timerName === 'short' && "active")} onClick={changeTimer('short')}>short break</li>
        <li className={"timer-item " + (timerName === 'long' && "active")} onClick={changeTimer('long')}>long break</li>
      </ul>
      <div className="progress">
        <CircleProgress stroke={10} radius={170} progress={progress} color={primaryColor}></CircleProgress>
        <div className="timer">
          <Timer timeSec={timer} stop={stop}></Timer>
          <button style={{ fontFamily }} className="btn-stop" onClick={() => setStop(s => !s)}>{stop ? "Start" : "Stop"}</button>
        </div>
      </div>
      <div onClick={(ev) => setShowSetting(s => !s)}>
        <img className="rotate" src={settings} width="24" height="24" alt="settings"/>
      </div>
      {showSetting && <div className="setting">
        <div className='setting-header flex flex-row justify-between items-center'>
          <div>
            <h2 className='color-black'>Settings</h2>
          </div>
          <div className='exit' onClick={(ev) => setShowSetting(s => !s)}>&times;</div>
        </div>
        <div className='divider'></div>
        <div>
          <p className='uppercase text-xl spacing-xl color-black'>TIME (MINUTES)</p>
          <div className='select-panel'>
            <div>
              <label htmlFor="pomodoro" className='block custom-label'>pomodoro</label>
              <select id="pomodoro" className='custom-select' value={tmpTimers.pomodoro} onChange={onTimeChange('pomodoro')}>
                {Array.from(Array(30).keys()).map(e => <option key={e} value={e + 1}>{e + 1}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="short-break" className='block custom-label'>short break</label>
              <select id="short-break" className='custom-select' value={tmpTimers.short} onChange={onTimeChange('short')}>
                {Array.from(Array(30).keys()).map(e => <option key={e} value={e + 1}>{e + 1}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="long-break" className='block custom-label'>long break</label>
              <select className='custom-select' id="long-break" value={tmpTimers.long} onChange={onTimeChange('long')}>
                {Array.from(Array(30).keys()).map(e => <option key={e} value={e + 1}>{e + 1}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className='divider'></div>
        <div className='flex flex-row justify-between'>
          <div className='uppercase text-xl spacing-xl color-black'>Font</div>
          <div className='flex flex-row'>
            <div className={'dot bg-grey' + (fontFamily === "Arial, sans-serif" ? ' dot-selected' : '')} style={{ fontFamily: "Arial, sans-serif" }} onClick={onFontChange('Arial, sans-serif')}>Aa</div>
            <div className={'dot bg-grey' + (fontFamily === "Didot, serif" ? ' dot-selected' : '')} style={{ fontFamily: "Didot, serif" }} onClick={onFontChange('Didot, serif')}>Aa</div>
            <div className={'dot bg-grey' + (fontFamily === "Bradley Hand, cursive" ? ' dot-selected' : '')} style={{ fontFamily: "Bradley Hand, cursive" }} onClick={onFontChange('Bradley Hand, cursive')}>Aa</div>
          </div>
        </div>
        <div className='divider'></div>
        <div className='flex flex-row justify-between'>
          <div className='uppercase text-xl spacing-xl color-black'>Color</div>
          <div className='flex flex-row'>
            <div className='dot bg-red' onClick={onColorChange('#f26d66')}>{primaryColor === '#f26d66' && '✔'}</div>
            <div className='dot bg-pink' onClick={onColorChange('#db7ffb')}>{primaryColor === '#db7ffb' && '✔'}</div>
            <div className='dot bg-aqua' onClick={onColorChange('#6df4fa')}>{primaryColor === '#6df4fa' && '✔'}</div>
          </div>
        </div>
        <div>
          <button className='btn-apply' onClick={onApply}>Apply</button>
        </div>
      </div>}
    </main>
  );
}

export default App;
