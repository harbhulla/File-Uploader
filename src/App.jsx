import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import { StateProvider } from './components/StateContext';
export default function App() {
  return (
  <StateProvider>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Routes>
  </BrowserRouter>
  </StateProvider>
  )
};
