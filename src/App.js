import React, { useState, useEffect } from 'react';
import Notice from './components/notice';
import Charts from './components/charts';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import { differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import "./App.css"


function App() {
  const [notices, setNotices] = useState([]);
  const [liveNotices, setLiveNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [noticeDate, setNoticeDate] = useState(new Date());
  const [noticeTime, setNoticeTime] = useState('22:10:00');
  const [duration, setDuration] = useState('60');
  const [count, setCount] = useState(0);

  const addNotice = () => {
    setNotices([...notices, { id: uuidv4(), title, text, noticeTime, noticeDate, duration, active: true, color: 'green' }]);
    setCount(count + 1);
  }

  const refreshNotices = () => {
    const updatedNotices = notices.filter(notice => {
      if (!notice.active) return false;

      const currentDateTime = new Date();
      const dateDiff = differenceInDays(currentDateTime, notice.noticeDate);
      if (dateDiff !== 0) return false;
      const currentTimeSplit = currentDateTime.toTimeString().split(" ")[0].split(":");
      const currentTime = parseInt(currentTimeSplit[0]) * 60 * 60 + parseInt(currentTimeSplit[1]) * 60 + parseInt(currentTimeSplit[2]);
      const givenTimeSplit = notice.noticeTime.split(":");
      const givenTime = givenTimeSplit[0] * 60 * 60 + givenTimeSplit[1] * 60;
      if (currentTime < givenTime || currentTime > (givenTime + parseInt(notice.duration))) return false;
      return true;
    }).map(notice => {
      if (parseInt(notice.duration) <= 60) return notice;

      const currentDateTime = new Date();
      const currentTimeSplit = currentDateTime.toTimeString().split(" ")[0].split(":");
      const currentTime = parseInt(currentTimeSplit[0]) * 60 * 60 + parseInt(currentTimeSplit[1]) * 60 + parseInt(currentTimeSplit[2]);
      const givenTimeSplit = notice.noticeTime.split(":");
      const givenTime = givenTimeSplit[0] * 60 * 60 + givenTimeSplit[1] * 60 + parseInt(notice.duration);
      if ((givenTime - currentTime) < 60) notice.color = 'orange';
      return notice;

    });

    setLiveNotices(updatedNotices);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotices();
    }, 2000);
    return () => clearInterval(interval);
  })
  return (
    <div className="Container">
      <div>
      <div className="Section">
        <h1>Notice Board</h1>
        <label>
          Title:
              <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Text:
              <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <label>
          Date:
        <DatePicker value={noticeDate} onChange={setNoticeDate} />
        </label>
        <label>
          Time:
        <TimePicker value={noticeTime} format="h:mm a" onChange={setNoticeTime} />
        </label>
        <label>
          Duration (secs) :
        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} />
        </label>
        <button onClick={addNotice}>Add Notice</button>
      </div>
      <div className="Section">
        {liveNotices.length ? (liveNotices.map(notice => <Notice key={notice.id} {...notice} />)) : (<div />)}
      </div>
      </div>
      <div className="Section">
        <Charts totalCount={count} activeCount={liveNotices.length} />
      </div>
    </div>
  );
}
export default App;
