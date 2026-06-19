import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CreateWorldCupPage } from "./routes/CreateWorldCupPage";
import { HomePage } from "./routes/HomePage";
import { PlayWorldCupPage } from "./routes/PlayWorldCupPage";
import { RankingPage } from "./routes/RankingPage";
import { ResultPage } from "./routes/ResultPage";

export default function App() {
  return (
    <BrowserRouter basename="/worldcup">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateWorldCupPage />} />
          <Route path="/play/:id" element={<PlayWorldCupPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/ranking/:id" element={<RankingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
