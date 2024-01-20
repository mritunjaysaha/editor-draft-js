import "draft-js/dist/Draft.css";
import "./App.css";
import { CustomEditor } from "./components/CustomEditor/CustomEditor";

function App() {
    return (
        <div className="App">
            <CustomEditor />
        </div>
    );
}

export default App;
