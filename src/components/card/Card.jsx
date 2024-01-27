import React from 'react'
import { FaPlaneDeparture } from "react-icons/fa";

const Card = (props) => {
    return (
        <div className='h-[150px] px-2 py-3 text-xs'>
            <head className='flex justify-center mb-2'><FaPlaneDeparture size={33}/></head>
            <div className='flex items-center mb-1'>
                <div>Flight Number :</div>
                <div className='ms-2'>{props.flightNumber}</div>
            </div>
            <div className='flex flex-wrap items-center mb-1'>
                <div>Mission Name :</div>
                <div className='ms-2'>{props.missionName}</div>
            </div>
            <div className='flex items-center mb-1'>
                <div>Launch Year :</div>
                <div className='ms-2'>{props.launchYear}</div>
            </div>

        </div>
    )
}

export default Card