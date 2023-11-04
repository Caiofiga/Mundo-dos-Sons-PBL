import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
import "../css/Route.css";
import Drag from "./Drag";
import Silaba from "./Silaba";
import Imagem from "./imagem";
import Rimas from "./rimas";
import Sons from "./sons";
import SignUp from "./login";
import { UserContext } from "./UserContext";
import { useState } from "react";
import UserResults from "./resultados";
import { Home } from "./startScreen";
import PDF from "./PDF";
import Prot from "./prototype";
export default function Routers() {
  const [userId, setUserId] = useState("");
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <UserContext.Provider value={{ userId, setUserId }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="Drag" element={<Drag />} />
              <Route path="Silaba" element={<Silaba />} />
              <Route path="Imagem" element={<Imagem />} />
              <Route path="Rimas" element={<Rimas />} />
              <Route path="Sons" element={<Sons />} />
              <Route path="Home" element={<SignUp />} />
              <Route path="PDF" element={<PDF userId={userId} />} />
              <Route path="Prot" element={<Prot />} />
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

export function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Sons">Sons</Link>
        </li>
        <li>
          <Link to="/Silaba">Silaba</Link>
        </li>
        <li>
          <Link to="/Imagem">Imagem</Link>
        </li>
        <li>
          <Link to="/Rimas">Rimas</Link>
        </li>
        <li>
          <Link to="/Drag">Drag</Link>
        </li>
        <li>
          <Link to="/Fim">Fim</Link>
        </li>
        <li>
          <Link to="/Prot">Prototype</Link>
        </li>
      </ul>
    </nav>
  );
}
function Layout() {
  const location = useLocation();

  return (
    <div>
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
