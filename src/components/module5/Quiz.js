import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import backgroundWallpaper from './bg.jpeg';
import Chat from './Chat';
import { useLocation } from 'react-router-dom';
import AuthDetails from "../AuthDetails"

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(20);
  const [showHint, setShowHint] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const location = useLocation();
  const { authUser, userSignOut } = AuthDetails();
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamInfo, setTeamInfo] = useState();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [rightAnswerCounter, setRightAnswerCounter] = useState(0);

   // API's
   const getUser =
   "https://ty5uk6v4k3wpsy6rarv56cpduy0hrnbj.lambda-url.us-east-1.on.aws/";
   const getTeam =
   "https://v3zawbbk6hy6azikv7uxoim4qy0wmkku.lambda-url.us-east-1.on.aws/";
   const updateGameId = 
   "https://cpbhq6fvnzdih7wxyva2le4bze0aweqy.lambda-url.us-east-1.on.aws/";


  useEffect(() => {
    fetchQuestions();
    fetchTeamsData();
  }, []);

  // Nisarg ViewTeam Useffect
  useEffect(() => {
    const getData = async () => {
      try {
        console.log(authUser.uid);
        const response = await axios.post(getUser, { id: authUser.uid });
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
        setLoggedInUser(mail)
        const res = await axios.post(getTeam, { id: teamID });
        setTeamInfo(JSON.parse(res.data.body).Items[0]);
        setTeamRole(JSON.parse(res.data.body).Items[0].team_roles[mail]);
        setTeamMembers(JSON.parse(res.data.body).Items[0].team_members);
      } catch (error) {
        console.log(error);
      }
    };
    getTeamData();
  }, [teamID, teamInfo]);

  useEffect(() => {
    // Set up the timer interval
    let interval;
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer((prevTimer) => prevTimer - 1);
        } else {
          // Timer ends, check if selected option is correct and update score
          if (selectedOption !== '') {
            const currentQuestion = questions[currentQuestionIndex];
            const currentTeam = teamsData.find((team) => team.team_id === teamInfo.team_id); 
            // if (currentTeam) {
            //   if (currentQuestion.correctAnswer === selectedOption) {
            //     // Correct answer, update score
            //     const newScore = currentTeam.Score + 1;
            //     const newRightAnswers = currentTeam.rightAnswers + 1;
            //     console.log(newRightAnswers)
            //     updateTeamScore(currentTeam.team_id, newScore, newRightAnswers, currentTeam.wrong_answers);
            //   } else {
            //     // Wrong answer, update wrong_answers
            //     const newWrongAnswers = currentTeam.wrong_answers + 1;
            //     updateTeamScore(currentTeam.team_id, currentTeam.Score, currentTeam.right_answers, newWrongAnswers);
            //   }
            // }
            if (currentTeam) {
              const rightAnswers = currentTeam.right_answers || 0;
              const wrongAnswers = currentTeam.wrong_answers || 0;
            
              if (currentQuestion.correctAnswer === selectedOption) {
                // Correct answer, update score and right_answers
                const newScore = currentTeam.Score + 1;
                const newRightAnswers = rightAnswers + 1;
                setRightAnswerCounter(rightAnswerCounter + 1);
                setRightAnswers(newRightAnswers)
                updateTeamScore(currentTeam.team_id, newScore, newRightAnswers, wrongAnswers);
              } 
              else {
                // Wrong answer, update score and wrong_answers
                const newWrongAnswers = wrongAnswers + 1;
                updateTeamScore(currentTeam.team_id, currentTeam.Score, rightAnswers, newWrongAnswers);
              }
            }
          }

          // Reset timer and move to the next question
          setTimer(20);
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedOption('');
          setShowHint(false); // Hide hint for the next question
        }
      }, 1000);
    }

    // Clear the timer interval when component unmounts or the currentQuestionIndex exceeds the number of questions
    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions.length, timer, selectedOption, teamsData]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        'https://us-central1-dixit-nlp.cloudfunctions.net/getFirestoreData/questions'
      );
      console.log(location.state.game.category);
      const filteredQuestions = response.data.filter(
        (question) => question.category === location.state.game.category
      );
      console.log(filteredQuestions);
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchTeamsData = async () => {
    // Fetch teams data from the API based on game_id
    var gameId = location.state.game.id;
    console.log(location.state.game);

    try {
      const response = await axios.get(
        `https://5hkrjbfwyd6cd73vafukgwod7i0hzzjy.lambda-url.us-east-1.on.aws/?game_id=${gameId}`
      );
      console.log(response.data);
      setTeamsData(response.data);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    // Check if an option is selected before proceeding to the next question
    if (selectedOption !== '') {
      setTimer(20);

      // Check if there are no more questions left
      if (currentQuestionIndex + 1 >= questions.length) {
        // Handle quiz completion
        setCurrentQuestionIndex(questions.length); // To prevent further actions
        return;
      }

      setSelectedOption('');
      setShowHint(false); // Hide hint for the next question
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const updateTeamScore = async (teamId, score, rightAnswers, wrongAnswers) => {
    // Replace the following line with your AWS Lambda API endpoint URL
    const apiEndpoint = 'https://qhorsnnrd2wqhyi6pdcsfzuioa0ohtsk.lambda-url.us-east-1.on.aws/';

    try {
      const response = await axios.put(apiEndpoint, {
        team_id: teamId,
        Score: score,
        right_answers: rightAnswers,
        wrong_answers: wrongAnswers,
      });
      console.log('Team score updated:', response.data);
      // Refetch teams data after updating the score
      fetchTeamsData();
    } catch (error) {
      console.error('Error updating team score:', error);
    }
  };

  // Check if all questions have been answered
  const isQuizCompleted = currentQuestionIndex >= questions.length;

  // useEffect(() => {
  //   if (isQuizCompleted) {
  //     // API call to update the game_id to an empty string
  //     const updateGameIdApi = async () => {
  //       try {
  //         await axios.post(updateGameId, { team_id: teamInfo.team_id, game_id: "" });
  //         console.log('Successfully updated game_id to an empty string.');
  //       } catch (error) {
  //         console.error('Error updating game_id:', error);
  //       }
  //     };

  //     updateGameIdApi();
  //   }
  // }, [isQuizCompleted, teamID]);

  useEffect(() => {
    if (isQuizCompleted) {
      // Delay the updateTeamScore function by 60 seconds
      const timeoutId = setTimeout(async () => {
        try {
          // Update the score of each team to zero
          // teamsData.forEach(async (team) => {
          //   await updateTeamScore(team.team_id, team.Score, team.right_answers, team.wrong_answers + (questions.length - rightAnswers));
          // });
          console.log(rightAnswers)
          updateTeamScore(teamInfo.team_id, teamInfo.Score, teamInfo.right_answers, teamInfo.wrong_answers + (questions.length - rightAnswerCounter));
  
          // Finally, update the game_id to an empty string
          await axios.post(updateGameId, { team_id: teamInfo.team_id, game_id: "" });
          console.log('Successfully updated game_id to an empty string.');
        } catch (error) {
          console.error('Error updating game_id:', error);
        }
      }); 
  
      // Clean up the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [isQuizCompleted, teamID]);
  
  // Function to find the team with the highest score
  const findWinner = () => {
    let highestScore = -1;
    let winner = null;

    teamsData.forEach((team) => {
      if (team.Score > highestScore) {
        highestScore = team.Score;
        winner = team;
      }
    });

    return winner;
  };

  if (isQuizCompleted) {
    const winner = findWinner();
    return (
      <Box
        sx={{
          backgroundImage: `url(${backgroundWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card className="card">
          <CardContent>
            <Typography variant="h5" className="question">
              Quiz Completed!
            </Typography>
            <Typography variant="body1" className="selectedOption">
              Thank you for participating.
            </Typography>
            
          </CardContent>
        </Card>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.incorrectAnswers.split(', ') || []; // Fetch options from the API response
  options.push(currentQuestion.correctAnswer); // Add the correct answer to the options array

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Render teams data */}
      <Card className="drawer-card">
        <CardContent>
          {teamsData.map((team, index) => (
            <div key={index} className="team-data">
              <Typography className="team-name">{team.team_name}</Typography>
              <Typography variant="body1" className="team-members">
                {team.team_members.map((member, memberIndex) => (
                  <div key={memberIndex} className="team-member">
                    {member}
                  </div>
                ))}
              </Typography>
              <Typography variant="body1" className="team-score">
                Score: {team.Score}
              </Typography>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Render the quiz question */}
      <Card className="card">
        <CardContent>
          <Typography variant="h5" className="question">
            <Box sx={{ fontWeight: 'bold' }}>Question {currentQuestionIndex + 1}: </Box>
            {currentQuestion?.questionText}
          </Typography>
          {showHint && (
            <Typography variant="body1" className="hint">
              Hint: {currentQuestion?.hint}
            </Typography>
          )}
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="mcq-options"
              name="mcq-options"
              value={selectedOption}
              onChange={handleOptionChange}
              className="option"
            >
              {options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={
                    <Typography
                      variant="body1"
                      className={selectedOption === option ? 'selectedOption' : 'option'}
                    >
                      {option}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Typography variant="body1" className="selectedOption"></Typography>
          
          <Button variant="contained" color="secondary" style={{ marginTop: '15px' }} onClick={handleShowHint}>
            Show Hint
          </Button>
          <Typography variant="body1" style={{ marginTop: '15px' }} className="selectedOption">
            Time Left: {timer} seconds
          </Typography>
        </CardContent>
      </Card>

      {/* Render the chat component */}
      <Card style={{ height: '100%' }}>
        {teamInfo && teamInfo.length !== 0 && <Chat 
            user={loggedInUser}
            teamId={teamInfo.team_id}
            teamName={teamInfo.team_name}
          />}
      </Card>
    </Box>
  );
};

export default Quiz;