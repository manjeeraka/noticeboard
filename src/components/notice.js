import React from 'react';
import './notice.css';

const Notice = ({title, text, noticeTime, noticeDate, duration, color}) => {
    return (
        <div className="Notice" style={{backgroundColor: `${color}`}}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Notice;