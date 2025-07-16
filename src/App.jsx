import "./Global.css";
import "./dark.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import SidePanelComponent from "./page/SidePanelComponent";
import Settings from "./page/Settings";
import {ThemeProvider} from "./helpers/ThemeProvider.jsx";

function App() {
    return (

        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<NavBarComponent/>}>
                        <Route index element={<SidePanelComponent/>}/>
                        <Route path="settings" element={<Settings/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;