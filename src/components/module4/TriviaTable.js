import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import backgroundWallpaper from './bg.jpeg';
import StyledBadge from './StyledBadge';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import { Button, Text } from "@nextui-org/react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Collapse  } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Chatbot from '../module10/Chatbot';
import AuthDetails from "../AuthDetails";
import GameWaitingPage from './GameWaitingPage';

function TriviaTable() {
    const[backupData, setBackupData] = useState([]);
    const[data, setData] = useState([]);
    const[counter, setCounter] = useState(1);
    const[multiSelectionsCategory, setMultiSelectionsCategory] = useState([]);
    const[multiSelectionsDifficulty, setMultiSelectionsDifficulty] = useState([]);
    const[multiSelectionsTime, setMultiSelectionsTime] = useState([]);
    const[optionsCategory, setOptionsCategory] = useState([]);
    const[optionsDifficulty, setOptionsDifficulty] = useState([]);
    const[optionsTime, setOptionsTime] = useState([]);
    const[open, setOpen] = useState(-1);
    const [timers, setTimers] = useState([]);
    const { authUser, userSignOut } = AuthDetails();
    const [teamName, setTeamName] = useState("");
    const [teamID, setTeamID] = useState("");
    const [teamMembers, setTeamMembers] = useState("");
    const [teamRole, setTeamRole] = useState("");
    const [teamInfo, setTeamInfo] = useState("");
    const [mergedData, setMergedData] = useState([]);
    let navigate = useNavigate();

    // API's
    const getUser =
    "https://ty5uk6v4k3wpsy6rarv56cpduy0hrnbj.lambda-url.us-east-1.on.aws/";
    const getTeam =
    "https://v3zawbbk6hy6azikv7uxoim4qy0wmkku.lambda-url.us-east-1.on.aws/";
    const updateGameId = 
    "https://cpbhq6fvnzdih7wxyva2le4bze0aweqy.lambda-url.us-east-1.on.aws/";
    const getFirestoreDataApi = 'https://us-central1-dixit-nlp.cloudfunctions.net/getFirestoreData/games';
    const getQuizTimeApi = 'https://yzoiyhjqu4c5cyld5gv6c5ha5u0bknpv.lambda-url.us-east-1.on.aws/';


    
    useEffect(() => {
      // Fetch data from both APIs
      const fetchFirestoreData = async () => {
        try {
          const response = await axios.get(getFirestoreDataApi);
          const firestoreData = response.data;
          const quizTimeResponse = await axios.get(getQuizTimeApi);
          const quizTimeData = quizTimeResponse.data;
  
          // Merge the data based on gameId/id
          const mergedData = firestoreData.map((item) => {
            const quizTimeItem = quizTimeData.find((qtItem) => qtItem.gameId === item.id);
            return {
              ...item,
              startTime: quizTimeItem?.time || '00:00',
            };
          });
  
          setMergedData(mergedData);
          setBackupData(mergedData); // Assuming you want to use the merged data for filtering as well
          allocatingOptions(mergedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchFirestoreData();
    }, []);

    
      useEffect(() => {
        const storedTimers = JSON.parse(localStorage.getItem('countdownTimers'));
        if (storedTimers && storedTimers.length === data.length) {
          setTimers(storedTimers);
        } else {
            const countdownTimers = data.map((item) => item.time * 60);
          setTimers(countdownTimers);
        }

        const interval = setInterval(() => {
          setTimers((prevTimers) =>
            prevTimers.map((timer) => (timer > 0 ? timer - 1 : 0))
          );
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, [data]);

    
      useEffect(() => {
        if(timers.length !== 0){
            localStorage.setItem('countdownTimers', JSON.stringify(timers));
        }
        
      }, [timers]);

      // Nisarg ViewTeam Useffect
      useEffect(() => {
        const getData = async () => {
          try {
            console.log(authUser.uid);
            const response = await axios.post(getUser, { id: authUser.uid });
            console.log(JSON.parse(response.data.body).Items[0].team_id);
            console.log(JSON.parse(response.data.body).Items[0].team_name);
            setTeamID(JSON.parse(response.data.body).Items[0].team_id);
            setTeamName(JSON.parse(response.data.body).Items[0].team_name);
          } catch (error) {
            console.log(error);
          }
        };
        getData();
      }, [authUser]);

      // Nisarg GetTeam Data
      useEffect(() => {
        const getTeamData = async () => {
          try {
            const mail = authUser.email;
            console.log(mail)
            const res = await axios.post(getTeam, { id: teamID });
            console.log("Team Details")
            console.log(JSON.parse(res.data.body).Items[0]);
            console.log(JSON.parse(res.data.body).Items[0].team_roles);
            setTeamInfo(JSON.parse(res.data.body).Items[0]);
            setTeamRole(JSON.parse(res.data.body).Items[0].team_roles[mail]);
            setTeamMembers(JSON.parse(res.data.body).Items[0].team_members);
          } catch (error) {
            console.log(error);
          }
        };
        getTeamData();
      }, [teamID]);

    function allocatingOptions(data){
        var listOfCategory = [];
        var listOfDifficulty = [];
        var listOfTime = [];

        console.log(data)

        for(let item in data){
            console.log(item);
            if(!listOfCategory.includes(data[item].category)){
                listOfCategory.push(data[item].category);
            }
            if(!listOfDifficulty.includes(data[item].difficulty)){
                listOfDifficulty.push(data[item].difficulty);
            }
            if(!listOfTime.includes(data[item].time)){
                listOfTime.push((data[item].time).toString());
            }
        }
        setOptionsCategory(listOfCategory);
        setOptionsDifficulty(listOfDifficulty);
        setOptionsTime(listOfTime);
    }

    // async function redirectToInGame(game){
    //   await axios.post(updateGameId, {team_id: teamID, game_id: game.id});
    //   console.log("Game:", game);
    //   //navigate('/inGame', {state: {game: game, team: teamInfo}})
    //   //navigate('/inGame')
    //   navigate('/inGame', {state: {game: game}})
    // }

    async function redirectToInGame(game) {
      await axios.post(updateGameId, { team_id: teamID, game_id: game.id });
      console.log('Game:', game);
      navigate('/gameWaitingPage', { state: { game } });
    }

    function handleFilter(data){
        const filteredData = data.filter(item => {
          item.time = (item.time).toString()
            const categoryMatch = multiSelectionsCategory.includes(item.category);
            const difficultyMatch = multiSelectionsDifficulty.includes(item.difficulty);
            const timeMatch = multiSelectionsTime.includes(item.time);
            console.log(timeMatch)
        
            return categoryMatch && difficultyMatch && timeMatch;
          });
        
        filteredData.forEach((item, index) => {
        //startTimer(item.time, index);
        });

          setData(filteredData);
          if(filteredData.length === 0){
            setData(backupData);
          }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
    
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
        return `${formattedMinutes}:${formattedSeconds}`;
      }

      if (!data) {
        return <div>Loading...</div>; // or any loading state indicator
      }

      function getRemainingTime(startTime) {
        const currentTime = new Date();
        const gameStartTime = new Date(currentTime);
        const [hours, minutes] = startTime.split(':').map(Number);
        gameStartTime.setHours(hours, minutes, 0, 0);
    
        const timeDiffInSeconds = Math.floor((gameStartTime - currentTime) / 1000);
        return timeDiffInSeconds > 0 ? timeDiffInSeconds : 0;
      }

      // Render remaining time based on the game start time
      function renderRemainingTime(startTime) {
        const remainingSeconds = getRemainingTime(startTime);
        return formatTime(remainingSeconds);
      }

    //   function startTimer(gameTime, index) {
    //     const timer = setInterval(() => {
    //       setTimers(prevTimers => ({
    //         ...prevTimers,
    //         [index]: prevTimers[index] - 1
    //       }));
    //     }, 1000);
    
    //     setTimers(prevTimers => ({
    //       ...prevTimers,
    //       [index]: gameTime
    //     }));
    
    //     if (gameTime <= 0) {
    //       clearInterval(timer);
    //     }
    //   }
    
    return (
        <div className="trivia-table-container">
            <div className="background-image" style={{ backgroundImage: `url(${backgroundWallpaper})` }}></div>
            <div className="text-container">
            <Text
                h1
                size={60}
                css={{
                textGradient: "45deg, $blue600 -20%, $red500 50%",
                }}
                weight="bold"
            >Trivia Game</Text>
               
                <p className="subtitle">Join the fun and test your knowledge!</p>
            </div>
            <div style={{ display: 'flex', gap: '100px', position: 'absolute', top: '30%', left: '10%', justifyContent: 'center' }}>
                <Typeahead
                    id="typeahead-category"
                    labelKey="name"
                    multiple
                    options={optionsCategory}
                    onChange={setMultiSelectionsCategory}
                    placeholder="Choose Category...."
                    selected={multiSelectionsCategory}
                    style={{width: '300px'}}
                />
                <Typeahead
                    id="typeahead-difficulty"
                    labelKey="name"
                    multiple
                    options={optionsDifficulty}
                    onChange={setMultiSelectionsDifficulty}
                    placeholder="Choose Difficulty...."
                    selected={multiSelectionsDifficulty}
                    style={{width: '300px'}}
                />
                <Typeahead
                    id="typeahead-time"
                    labelKey="name"
                    multiple
                    options={optionsTime}
                    onChange={setMultiSelectionsTime}
                    placeholder="Choose Time...."
                    selected={multiSelectionsTime}
                    style={{width: '300px'}}
                />
            </div>
            <Button style={{width: '150px', position: 'absolute', top: '40%', left: '43%'}}ghost color="gradient" auto onClick={() => handleFilter(data)}>Filter</Button>
            <TableContainer style={{height: "auto", width: "70%", position: 'absolute', top: '50%', left:'15%', background: 'rgba(0,0,0,0.8)'}}component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}></TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Index</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Name</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Category</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Difficulty</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Game Time (min)</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Game Start time</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Remaining Time</TableCell>
                            <TableCell style={{ color: 'white', fontSize: '20px'}}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mergedData.map((item, index) => (
                            <Fragment>
                                <TableRow key={index} style={{ color: 'white', fontSize: '20px'}}>
                                <TableCell>
                                    <IconButton onClick={()=> setOpen(open === index ? -1 : index)}>
                                    {open === index ? (
                                        <KeyboardArrowUpIcon style={{fill: "white"}} />
                                    ) : (<KeyboardArrowDownIcon style={{fill: "white"}}/>)
                                    }
                                    </IconButton>
                                </TableCell>
                                <TableCell style={{ color: 'white', fontSize: '20px'}} >{index+1}</TableCell>
                                <TableCell style={{ color: 'white', fontSize: '20px'}}>{item.gameName}</TableCell>
                                <TableCell style={{ color: 'white', fontSize: '20px'}}>{item.category}</TableCell>
                                <TableCell>
                                    <StyledBadge type={item.difficulty}>{item.difficulty}</StyledBadge>
                                </TableCell>
                                <TableCell style={{ color: 'white', fontSize: '20px'}}>{item.time}</TableCell>
                                <TableCell style={{ color: 'white' }}>{item.startTime}</TableCell>
                                <TableCell style={{ color: 'white' }}>
                                  <Typography variant="body2">
                                  {renderRemainingTime(item.startTime)}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ color: 'white' }}>
                                  <Button style={{ width: '100px' }} onClick={()=> redirectToInGame(item)} ghost color="gradient" auto>
                                    Join the Game
                                  </Button>
                                </TableCell>
                 
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={5} sx={{ paddingBottom: 0, paddingTop: 0, border: "0px" }}>
                                        <Collapse in={open === index} unmountOnExit>
                                            <Box sx={{
                                                width: "172%", 
                                                marginLeft: -2,
                                                backgroundColor: "rgba(255, 255, 255)",
                                                minHeight: 36,
                                                alignItems: 'center',
                                                textAlign: 'left',
                                                fontSize: 20
                                                }}>
                                                <Text style={{width: '600px', paddingLeft: '50px', paddingTop: '20px', paddingBottom: "20px"}} color="primary">{item.description}</Text>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                    ))}
                    </TableBody>
                </Table>
                <Chatbot />
            </TableContainer>
        </div>
    )
}

export default TriviaTable