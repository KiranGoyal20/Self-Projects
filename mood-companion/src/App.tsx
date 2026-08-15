import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { DetectPage } from "./pages/DetectPage";
import { QuizPage } from "./pages/QuizPage";
import { JournalPage } from "./pages/JournalPage";
import { PickerPage } from "./pages/PickerPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { HistoryPage } from "./pages/HistoryPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/detect" element={<DetectPage />} />
        <Route path="/detect/quiz" element={<QuizPage />} />
        <Route path="/detect/journal" element={<JournalPage />} />
        <Route path="/detect/pick" element={<PickerPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
