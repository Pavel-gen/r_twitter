import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Login from "./components/Login/Login.js";
const {notAuthRoutes, AuthRoutes} = require('./router.js')
const Auth = localStorage.getItem('token')
console.log(Auth)
// <Route path='*' element={<Navigate to='/login' />}/>
function App() {
  return (
    <BrowserRouter>
      <Routes>
      {notAuthRoutes.map(  route => {
        return  <Route path={route.path} element={route.element} />
      })}
      {Auth && AuthRoutes.map( route => {
        return <Route path={route.path} element={route.element} />
      })}
     
      </Routes>
    </BrowserRouter>
  );
}

export default App;
