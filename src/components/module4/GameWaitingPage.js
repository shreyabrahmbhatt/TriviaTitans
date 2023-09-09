import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundWallpaper from './bg.jpeg';

function GameWaitingPage() {
  const [waitingTeams, setWaitingTeams] = useState([]); // Store only waiting teams
  const { state } = useLocation();
  const { game } = state;
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(game.startTime));
  const navigate = useNavigate();

  function calculateRemainingTime(startTime) {
    const currentTime = new Date();
    const startDateTime = new Date(currentTime.toDateString() + ' ' + startTime);
    let remainingMilliseconds = startDateTime - currentTime;

    // If the remaining time is negative, it means the game has already started, so set it to 0
    if (remainingMilliseconds < 0) {
      remainingMilliseconds = 0;
    }

    return remainingMilliseconds;
  }

  const fetchWaitingTeams = async () => {
    try {
      const response = await axios.get('https://5hkrjbfwyd6cd73vafukgwod7i0hzzjy.lambda-url.us-east-1.on.aws/');
      const filteredTeams = response.data.filter((team) => team.game_id !== '');
       console.log(filteredTeams);
      setWaitingTeams(filteredTeams);
    } catch (error) {
      console.error('Error fetching waiting teams data:', error);
    }
  };

  useEffect(() => {
    // Fetch waiting teams initially
    fetchWaitingTeams();

    // Fetch waiting teams every 3 seconds
    const interval = setInterval(fetchWaitingTeams, 3000);

    // Clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      navigate('/inGame', { state: { game } });
    }
  }, [remainingTime]);

  return (
    <div className="background-image" style={{ backgroundImage: `url(${backgroundWallpaper})` }}>
      <h1 style={{ color: 'white' }}>Game Waiting Page</h1>
      <p style={{ color: 'white' }}>Remaining Time: {formatTime(remainingTime)}</p>
      <h2 style={{ color: 'white' }}>Waiting Teams:</h2>
      <ul style={{ color: 'white' }}>
        {waitingTeams.map((team) => (
          <li key={team.team_id}>
            {team.team_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default GameWaitingPage;
