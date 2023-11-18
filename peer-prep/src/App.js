import './App.css';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList';

function App() {
  return (
    <div>
      <Navbar/>
      {/* <LoginSignUp/> */}
      <Questions/>

    </div>
  );
}

export default App;
