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
import {FullscreenProvider} from "./helpers/FullscreenContext.jsx";

function App() {
    return (
        <ThemeProvider>
            <DbProvider>
                <FullscreenProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<NavBarComponent/>}>
                                <Route index element={<SidePanelComponent/>}/>
                                <Route path="settings" element={<Settings/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </FullscreenProvider>
            </DbProvider>
        </ThemeProvider>
    );
}

export default App;