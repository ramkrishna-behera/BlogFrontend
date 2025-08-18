import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import DynamicIslandNavbar from './Components/Navbar/DynamicIslandNavbar';
import LoginPage from './Pages/LoginPage/LoginPage';
import WritePage from './Pages/WritePage/WritePage';
import ExploreArticles from './Pages/ExploreArticle/ExploreArticle';
import PostPage from './Pages/PostPage/PostPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import AboutPage from './Pages/AboutPage/AboutPage';
import { useDispatch } from "react-redux";
import { setCredentials } from './redux/authSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");

    if (token && user) {
      dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);
  return (
    <>
      <DynamicIslandNavbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/explore" element={<ExploreArticles />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App;
