import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import LandingPage from "./components/LandingPage";
import UserData from "./components/userdata";
import Authentication from "./components/auth/authentication";
import Reset from "./components/auth/reset";
import Profile from "./components/profile";
import CreateTeam from "./components/CreateTeam";
import CreateInvite from "./components/CreateInvite";
import ViewInvite from "./components/ViewInvite";
import ViewTeam from "./components/ViewTeam";
import LeaderboardPage from "./page/Leaderboard";
import Notification from "./components/Notification";
import TriviaTable from "./components/module4/TriviaTable";
import Quiz from "./components/module5/Quiz";
import GameWaitingPage from "./components/module4/GameWaitingPage";
import Statisctics from "./components/Statistics";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/userdata" element={<UserData />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreateTeam />} />
        <Route path="/view" element={<ViewTeam />} />
        <Route path="/invite" element={<CreateInvite />} />
        <Route path="/viewinvite" element={<ViewInvite />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/gameLobby" element={<TriviaTable />} />
        <Route path="/inGame" element={<Quiz />} />
        <Route path="/gameWaitingPage" element={<GameWaitingPage />}></Route>
        <Route path="/statistics" element={<Statisctics />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
