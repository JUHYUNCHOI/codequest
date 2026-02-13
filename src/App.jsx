import { useState } from "react";
import { C } from "./theme";
import HomeScreen from "./components/HomeScreen";
import RoundingApp from "./problems/rounding/RoundingApp";
import CheeseApp from "./problems/cheese/CheeseApp";
import MooApp from "./problems/moo/MooApp";
import FencesApp from "./problems/fences/FencesApp";
import FansApp from "./problems/fans/FansApp";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "home") return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 8px", fontFamily: "'Noto Sans KR','sans-serif'" }}>
      <HomeScreen onSelect={setPage} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "16px 8px 60px", fontFamily: "'Noto Sans KR','sans-serif'" }}>
      <button onClick={() => setPage("home")} style={{
        background: C.card, border: `2px solid ${C.border}`, borderRadius: 10,
        padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
        color: C.dim, marginBottom: 12,
      }}>← Home</button>
      {page === "rounding" && <RoundingApp />}
      {page === "cheese" && <CheeseApp />}
      {page === "moo" && <MooApp />}
      {page === "fences" && <FencesApp />}
      {page === "fans" && <FansApp />}
    </div>
  );
}
