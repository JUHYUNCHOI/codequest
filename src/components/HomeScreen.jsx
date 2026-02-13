import { C } from "../theme";

const sections = [
  {
    label: "USACO",
    icon: "🐄",
    color: C.accent,
    problems: [
      {id:"rounding",emoji:"🔄",title:"Roundabout Rounding",sub:"Dec 2024 Bronze #1",color:C.accent},
      {id:"cheese",emoji:"🧀",title:"Cheese Block",sub:"Dec 2024 Bronze #2",color:"#d97706"},
      {id:"moo",emoji:"🐄",title:"It's Mooin' Time",sub:"Dec 2024 Bronze #3",color:"#7c5cfc"},
    ],
  },
  {
    label: "MCC",
    icon: "🌏",
    color: "#059669",
    problems: [
      {id:"fences",emoji:"🏗️",title:"Building Fences",sub:"MCC 2025 P1",color:"#059669"},
      {id:"fans",emoji:"🪭",title:"Fans",sub:"MCC 2025 P2",color:"#d97706"},
    ],
  },
];

function SectionHeader({ icon, label, color }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8, margin:"20px 0 8px",
    }}>
      <div style={{
        fontSize:14, fontWeight:900, color, fontFamily:"'JetBrains Mono',monospace",
        letterSpacing:1, textTransform:"uppercase",
        display:"flex", alignItems:"center", gap:6,
      }}>
        <span style={{fontSize:18}}>{icon}</span> {label}
      </div>
      <div style={{flex:1, height:2, background:C.border, borderRadius:1}} />
    </div>
  );
}

function ProblemCard({ p, onSelect }) {
  return (
    <button onClick={()=>onSelect(p.id)} style={{
      display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:14,cursor:"pointer",textAlign:"left",
      background:C.card,border:`2px solid ${C.border}`,boxShadow:"0 2px 10px rgba(0,0,0,.04)",transition:"all .15s",
      width:"100%",
    }}>
      <div style={{fontSize:36,flexShrink:0}}>{p.emoji}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"'Jua',sans-serif"}}>{p.title}</div>
        <div style={{fontSize:12,fontWeight:600,color:C.dim,marginTop:2}}>{p.sub}</div>
      </div>
      <div style={{fontSize:20,color:C.dimLight}}>→</div>
    </button>
  );
}

export default function HomeScreen({ onSelect }) {
  return (
    <div style={{maxWidth:440,margin:"0 auto",padding:"20px 0"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:64,marginBottom:8}}>⚔️</div>
        <div style={{fontSize:28,fontWeight:900,color:C.text,fontFamily:"'Jua',sans-serif"}}>CodeQuest</div>
        <div style={{fontSize:14,color:C.dim,marginTop:4,fontFamily:"'Jua',sans-serif"}}>인터랙티브 알고리즘 풀이</div>
      </div>

      {sections.map(sec => (
        <div key={sec.label}>
          <SectionHeader icon={sec.icon} label={sec.label} color={sec.color} />
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {sec.problems.map(p => (
              <ProblemCard key={p.id} p={p} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}

      <div style={{textAlign:"center",marginTop:24,fontSize:12,color:C.dimLight}}>문제 계속 추가 예정...</div>
    </div>
  );
}
