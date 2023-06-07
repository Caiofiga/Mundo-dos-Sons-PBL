import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Route.css";
import Drag from "./Drag";
import Silaba from "./Silaba";
import Imagem from "./imagem";
import Rimas from "./rimas";
import Sons from "./sons";
import SignUp from "./login";
import { link } from "fs";
import { UserContext } from "./UserContext";
import { useState } from "react";
import UserResults from "./resultados";
import { Home } from "./startScreen";

export default function Routers() {
  const [userId, setUserId] = useState("");
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <UserContext.Provider value={{ userId, setUserId }}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<SignUp />} />
              <Route path="Drag" element={<Drag />} />
              <Route path="Silaba" element={<Silaba />} />
              <Route path="Imagem" element={<Imagem />} />
              <Route path="Rimas" element={<Rimas />} />
              <Route path="Sons" element={<Sons />} />
              <Route path="Home" element={<Home />} />
              <Route
                path="Resultados"
                element={<UserResults userId={userId} />}
              />
              <Route path="Fim" element={<Fim />} />

              {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

function Layout() {
  const location = useLocation();

  return (
    <div>
      <hr />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="slide" timeout={300}>
          <Outlet />
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

function Fim() {
  return (
    <div>
      <h2>Thank you for playing!</h2>
      <img
        className="img"
        src="https://media.tenor.com/r6SUKW5Lf9wAAAAC/cat-cat-fall.gif"
      ></img>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
