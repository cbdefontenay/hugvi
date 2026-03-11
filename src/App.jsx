import "./Global.css";
import "./dark.css";
import "./ocean.css";
import "./sepia.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import SidePanelComponent from "./page/SidePanelComponent";
import Settings from "./page/Settings";
import {ThemeProvider} from "./helpers/ThemeProvider.jsx";
import {DbProvider} from "./helpers/DbContext.jsx";

function App() {
    return (
        <ThemeProvider>
            <DbProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<NavBarComponent/>}>
                            <Route index element={<SidePanelComponent/>}/>
                            <Route path="settings" element={<Settings/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DbProvider>
        </ThemeProvider>
    );
}

export default App;