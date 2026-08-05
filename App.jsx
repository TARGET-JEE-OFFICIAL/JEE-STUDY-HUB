import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MessageSquare, Search, Filter, ThumbsUp, CheckCircle2, Image as ImageIcon,
  Plus, X, Users, Send, Bell, Flag, Award, Star, ChevronDown, ChevronLeft,
  ChevronRight, Sun, Moon, BookOpen, Flame, Trophy, Shield, MessageCircle,
  Sparkles, User, Hash, TrendingUp, Home as HomeIcon, Atom, FlaskConical,
  Calculator, ListChecks, Target, FileText, Info, Mail, Menu, Bookmark,
  BookmarkCheck, Download, Printer, PenLine, Trash2, Save, Clock, Lightbulb,
  AlertTriangle, GraduationCap, Timer, Repeat, Play
} from "lucide-react";

/* ================================================================
   THEME
================================================================ */
const ThemeStyles = () => (
  <style>{`
    .jsh-root {
      --bg: #F7F8FB; --bg-soft: #EEF2F9; --card: #FFFFFF; --border: #E3E7EF;
      --ink: #14181F; --ink-soft: #5B6472; --ink-faint: #8892A0;
      --blue: #2452E8; --blue-deep: #16309C; --blue-tint: #EAF0FF;
      --physics: #2452E8; --physics-tint: #EAF0FF;
      --chem: #0E9F8E; --chem-tint: #E6F8F5;
      --math: #7C4FE0; --math-tint: #F2EBFF;
      --amber: #C9820A; --amber-tint: #FBF0DC;
      --red: #D64545; --red-tint: #FCEAEA;
      --green: #1D9A5B; --green-tint: #E5F6ED;
      --shadow: 0 1px 2px rgba(20,24,31,0.04), 0 8px 24px -12px rgba(20,24,31,0.10);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg); color: var(--ink); min-height: 100vh;
      transition: background .2s ease, color .2s ease;
    }
    .jsh-root[data-theme='dark'] {
      --bg: #0E1218; --bg-soft: #151A22; --card: #171C25; --border: #262D39;
      --ink: #EDF0F5; --ink-soft: #A6AEBC; --ink-faint: #6E7787;
      --blue: #5B84FF; --blue-deep: #8BA4FF; --blue-tint: #1A2440;
      --physics: #5B84FF; --physics-tint: #1A2440;
      --chem: #2BC7B2; --chem-tint: #10302C;
      --math: #A480F2; --math-tint: #26193F;
      --amber: #E3A63C; --amber-tint: #34290E;
      --red: #E36A6A; --red-tint: #351A1A;
      --green: #4ECB8C; --green-tint: #123326;
      --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5);
    }
    .jsh-display { font-family: 'Sora','Inter',ui-sans-serif,sans-serif; }
    .jsh-mono { font-family: 'IBM Plex Mono',ui-monospace,monospace; }
    .jsh-card { background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow); }
    .jsh-tab-notch { border-left: 4px solid var(--tab-color, var(--blue)); }
    .jsh-scroll::-webkit-scrollbar { width:6px; height:6px; }
    .jsh-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius:999px; }
    .jsh-btn-primary { background: var(--blue); color: #fff; }
    .jsh-btn-primary:hover { background: var(--blue-deep); }
    .jsh-input { background: var(--bg-soft); border:1px solid var(--border); color: var(--ink); }
    .jsh-input::placeholder { color: var(--ink-faint); }
    .jsh-chip { border:1px solid var(--border); color: var(--ink-soft); background: var(--bg-soft); }
    .jsh-chip[data-active='true'] { background: var(--blue); color:#fff; border-color: var(--blue); }
    .jsh-fade-in { animation: jshFade .25s ease both; }
    .jsh-ruled {
      background-image: repeating-linear-gradient(var(--card) 0 27px, var(--border) 27px 28px);
    }
    @keyframes jshFade { from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:none;} }
    @media (prefers-reduced-motion: reduce) { .jsh-fade-in { animation:none; } }
    @media print {
      .jsh-no-print { display:none !important; }
      .jsh-root { background:#fff !important; color:#000 !important; }
    }
  `}</style>
);

/* ================================================================
   DATA
================================================================ */
const SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const subjectIcon = { Physics: Atom, Chemistry: FlaskConical, Mathematics: Calculator };
const subjectColorVar = (s) => (s === "Physics" ? "--physics" : s === "Chemistry" ? "--chem" : "--math");
const subjectTintVar = (s) => (s === "Physics" ? "--physics-tint" : s === "Chemistry" ? "--chem-tint" : "--math-tint");

const CHAPTERS_BY_SUBJECT = {
  Physics: ["Units and Dimensions", "Kinematics", "Laws of Motion", "Rotational Motion"],
  Chemistry: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Equilibrium"],
  Mathematics: ["Sets", "Trigonometry", "Quadratic Equations", "Sequences & Series"],
};

const initialSubjectData = {
  Physics: [
    {
      id: "p1", title: "Units and Dimensions",
      keyConcepts: ["Fundamental vs derived units", "Dimensional formula of physical quantities", "Principle of homogeneity of dimensions"],
      formulas: ["[Velocity] = [M⁰L¹T⁻¹]", "[Force] = [M¹L¹T⁻²]", "[Energy] = [M¹L²T⁻²]"],
      mistakes: ["Confusing dimensional formula with unit", "Forgetting that dimensionless constants have [M⁰L⁰T⁰]"],
      examTips: ["Always check dimensional consistency before trusting a derived formula", "Use dimensional analysis to eliminate wrong options quickly"],
      revision: ["List all 7 fundamental quantities and their SI units", "Practice converting units across systems (CGS ↔ SI)"],
      notesText: "Dimensional analysis lets you verify equations and even derive relationships between physical quantities without doing the full experiment. Every physical quantity can be expressed as a combination of powers of mass [M], length [L], and time [T] (plus other base quantities where relevant).",
    },
    {
      id: "p2", title: "Kinematics",
      keyConcepts: ["Equations of motion under constant acceleration", "Relative velocity in 1D and 2D", "Projectile motion basics"],
      formulas: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as"],
      mistakes: ["Mixing up sign conventions for deceleration", "Ignoring vector nature of velocity in 2D problems"],
      examTips: ["Draw a clear diagram with a chosen positive direction before writing equations", "For projectile motion, split into independent x and y components"],
      revision: ["Re-derive all three equations of motion from first principles", "Solve 5 relative-velocity problems involving rivers/boats"],
      notesText: "Kinematics describes motion without worrying about its causes. Most JEE problems reduce to picking the right equation of motion and being careful with signs and reference frames.",
    },
  ],
  Chemistry: [
    {
      id: "c1", title: "Mole Concept",
      keyConcepts: ["Avogadro's number and molar mass", "Limiting reagent identification", "Empirical vs molecular formula"],
      formulas: ["Moles = Given mass / Molar mass", "Moles = Number of particles / Nₐ", "Molarity = Moles of solute / Litres of solution"],
      mistakes: ["Forgetting to balance the equation before mole ratio calculations", "Using mass instead of moles when comparing reactants"],
      examTips: ["Always balance the chemical equation first", "Convert everything to moles before comparing quantities"],
      revision: ["Practice 10 limiting reagent problems with 3+ reactants", "Revise molarity, molality, and normality formulas together"],
      notesText: "The mole is the bridge between the atomic world and the lab bench. Nearly every stoichiometry problem in JEE reduces to correctly converting given quantities into moles first.",
    },
    {
      id: "c2", title: "Atomic Structure",
      keyConcepts: ["Bohr's model and energy levels", "Quantum numbers and their significance", "Aufbau, Pauli, and Hund's rules"],
      formulas: ["E_n = -13.6 Z²/n² eV", "1/λ = RZ²(1/n₁² - 1/n₂²)", "Δx·Δp ≥ h/4π"],
      mistakes: ["Mixing up n, l, m, s quantum number rules", "Forgetting exceptions to Aufbau principle (Cr, Cu)"],
      examTips: ["Memorize exceptions to electronic configuration rules separately", "Practice Rydberg formula for both emission and absorption spectra"],
      revision: ["Write electronic configurations for the first 30 elements from memory", "Revise all quantum number constraints in a table"],
      notesText: "Atomic structure connects classical and quantum ideas. JEE tests both conceptual understanding (quantum numbers, orbital shapes) and calculation speed (spectral lines, energy levels).",
    },
  ],
  Mathematics: [
    {
      id: "m1", title: "Sets",
      keyConcepts: ["Set operations: union, intersection, difference", "De Morgan's laws", "Cardinality formulas for union of sets"],
      formulas: ["n(A∪B) = n(A) + n(B) − n(A∩B)", "n(A∪B∪C) = n(A)+n(B)+n(C)−n(A∩B)−n(B∩C)−n(A∩C)+n(A∩B∩C)"],
      mistakes: ["Forgetting to subtract the triple intersection in 3-set problems", "Confusing subset with proper subset notation"],
      examTips: ["Draw a Venn diagram for any word problem before writing formulas", "Label regions with variables when 3 sets overlap"],
      revision: ["Solve 8 Venn-diagram word problems with 3 overlapping sets", "Revise De Morgan's laws with example sets"],
      notesText: "Set theory questions in JEE are often disguised word problems. The fastest route is almost always a clearly labeled Venn diagram before any algebra.",
    },
    {
      id: "m2", title: "Trigonometry",
      keyConcepts: ["Compound angle formulas", "Transformation formulas (sum to product)", "General solutions of trig equations"],
      formulas: ["sin(A±B) = sinA·cosB ± cosA·sinB", "cos(A±B) = cosA·cosB ∓ sinA·sinB", "sinC + sinD = 2 sin((C+D)/2)·cos((C−D)/2)"],
      mistakes: ["Losing solutions by forgetting the general solution '+ nπ' or '+ 2nπ'", "Sign errors when expanding cos(A−B)"],
      examTips: ["Memorize compound and transformation formulas as a pair, not in isolation", "Always state the general solution unless the domain is restricted"],
      revision: ["Derive all transformation formulas from compound angle formulas", "Solve 6 general-solution trig equations"],
      notesText: "Trigonometric identities are the algebra of angles. Most JEE trig problems are really about picking the right identity to collapse an expression, not about complex computation.",
    },
  ],
};

const initialQuestions = [
  { id: "q1", subject: "Physics", chapter: "Kinematics", difficulty: "Easy", type: "Topic-wise",
    question: "A ball is thrown vertically upward with speed 20 m/s. Find the time to reach maximum height. (g = 10 m/s²)",
    answer: "2 s",
    explanation: "At max height, v = 0. Using v = u − gt → 0 = 20 − 10t → t = 2 s.", completed: false },
  { id: "q2", subject: "Physics", chapter: "Laws of Motion", difficulty: "Medium", type: "Daily Practice",
    question: "A block of mass 5 kg rests on a rough horizontal surface (μ = 0.4). Find the minimum force to just move it. (g = 10 m/s²)",
    answer: "20 N",
    explanation: "Limiting friction = μmg = 0.4 × 5 × 10 = 20 N. Applied force must equal this to just overcome static friction.", completed: false },
  { id: "q3", subject: "Chemistry", chapter: "Mole Concept", difficulty: "Medium", type: "Topic-wise",
    question: "Calculate the number of moles in 22 g of CO₂. (Molar mass of CO₂ = 44 g/mol)",
    answer: "0.5 mol",
    explanation: "Moles = given mass / molar mass = 22/44 = 0.5 mol.", completed: false },
  { id: "q4", subject: "Chemistry", chapter: "Atomic Structure", difficulty: "Hard", type: "Previous Year",
    question: "Find the wavelength of the spectral line for n=3 to n=2 transition in a hydrogen atom. (R = 1.097×10⁷ m⁻¹)",
    answer: "≈ 656 nm",
    explanation: "1/λ = R(1/2² − 1/3²) = R(1/4 − 1/9) = R(5/36). Solving gives λ ≈ 656 nm — the Balmer Hα line.", completed: false },
  { id: "q5", subject: "Mathematics", chapter: "Sets", difficulty: "Easy", type: "Daily Practice",
    question: "If n(A) = 20, n(B) = 15, n(A∩B) = 5, find n(A∪B).",
    answer: "30",
    explanation: "n(A∪B) = n(A) + n(B) − n(A∩B) = 20 + 15 − 5 = 30.", completed: false },
  { id: "q6", subject: "Mathematics", chapter: "Trigonometry", difficulty: "Hard", type: "Previous Year",
    question: "Solve for general solution: 2sin²θ − 3sinθ + 1 = 0.",
    answer: "θ = nπ + (−1)ⁿ·π/6, or θ = (2n+1)π/2",
    explanation: "Factor as (2sinθ − 1)(sinθ − 1) = 0, giving sinθ = 1/2 or sinθ = 1. Apply general solution formulas for each root separately.", completed: false },
];

const formulaSheet = {
  Physics: [
    { topic: "Kinematics", items: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as"] },
    { topic: "Laws of Motion", items: ["F = ma", "f_s(max) = μₛN", "p = mv"] },
    { topic: "Rotational Motion", items: ["τ = Iα", "L = Iω", "KE_rot = ½Iω²"] },
  ],
  Chemistry: [
    { topic: "Mole Concept", items: ["n = m/M", "n = N/Nₐ", "Molarity = n/V(L)"] },
    { topic: "Atomic Structure", items: ["Eₙ = −13.6Z²/n² eV", "1/λ = RZ²(1/n₁²−1/n₂²)"] },
    { topic: "Equilibrium", items: ["Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ", "ΔG° = −RT lnK"] },
  ],
  Mathematics: [
    { topic: "Trigonometry", items: ["sin(A±B) = sinAcosB ± cosAsinB", "cos2A = 1−2sin²A"] },
    { topic: "Quadratic Equations", items: ["x = [−b ± √(b²−4ac)] / 2a", "Sum of roots = −b/a, Product = c/a"] },
    { topic: "Sequences & Series", items: ["aₙ = a + (n−1)d", "Sₙ = n/2 [2a + (n−1)d]", "Sₙ (GP) = a(rⁿ−1)/(r−1)"] },
  ],
};

/* ---- community data ---- */
const CURRENT_USER = {
  id: "u_you", name: "You", cls: "Class 11", avatarColor: "#2452E8",
  reputation: 245, questionsAsked: 6, answersPosted: 14, bestAnswers: 3, helpfulVotes: 52,
  badges: ["Beginner", "Active Learner", "Physics Expert"],
};
const ALL_BADGES = [
  { name: "Beginner", desc: "Joined the community", icon: Sparkles },
  { name: "Active Learner", desc: "Posted 10+ replies", icon: BookOpen },
  { name: "Problem Solver", desc: "5 best answers received", icon: Star },
  { name: "Top Contributor", desc: "500+ reputation points", icon: Trophy },
  { name: "Physics Expert", desc: "20+ helpful Physics answers", icon: Award },
  { name: "Chemistry Expert", desc: "20+ helpful Chemistry answers", icon: Award },
  { name: "Mathematics Expert", desc: "20+ helpful Math answers", icon: Award },
  { name: "Daily Learner", desc: "7-day activity streak", icon: Flame },
];
const DIFFICULTIES_FORUM = ["Easy", "Medium", "Hard", "JEE Main", "JEE Advanced"];

const seedThreads = [
  { id: "t1", title: "Why is angular momentum conserved when torque is zero, intuitively?", subject: "Physics", chapter: "Rotational Motion", difficulty: "JEE Advanced", author: "Rhea K.", cls: "Class 12", createdAt: "2 hours ago",
    body: "I understand the math (dL/dt = τ), but I want an intuitive picture for why L stays constant when there's no external torque. My textbook's ice skater example confuses me — why does spin speed change if L is constant?",
    images: [], upvotes: 18, upvotedByMe: false, reported: false,
    replies: [
      { id: "r1", author: "Aman S.", cls: "Class 12", text: "Think of L = I·ω. When the skater pulls arms in, I drops because mass moves closer to the axis. Since L can't change without external torque, ω must increase to compensate.", upvotes: 24, upvotedByMe: true, isBest: true, createdAt: "1 hour ago" },
      { id: "r2", author: "Priya M.", cls: "Class 11", text: "Adding on — this is exactly analogous to linear momentum p = mv being conserved while v alone can change if m changes (like a rocket).", upvotes: 9, upvotedByMe: false, isBest: false, createdAt: "42 min ago" },
    ] },
  { id: "t2", title: "Best method to find limiting reagent quickly in mole concept problems?", subject: "Chemistry", chapter: "Mole Concept", difficulty: "Medium", author: "You", cls: "Class 11", createdAt: "5 hours ago",
    body: "For problems with 3+ reactants, dividing moles by coefficients for each one takes too long under time pressure. Is there a faster shortcut that still works reliably?",
    images: [], upvotes: 11, upvotedByMe: false, reported: false,
    replies: [ { id: "r3", author: "Karthik R.", cls: "Class 12", text: "Compare only two reactants at a time using mol/coefficient ratio, keep the smaller one as your running limiting candidate, then compare against the next. Never more than n−1 comparisons.", upvotes: 15, upvotedByMe: false, isBest: false, createdAt: "3 hours ago" } ] },
  { id: "t3", title: "Trig identity simplification — stuck on this JEE Main question", subject: "Mathematics", chapter: "Trigonometry", difficulty: "JEE Main", author: "Sana T.", cls: "Class 11", createdAt: "1 day ago",
    body: "Simplify sin(A+B)·sin(A−B) in terms of sin²A and sin²B. I keep getting stuck after expanding both products — attaching my working below.",
    images: ["handwritten-working.png"], upvotes: 7, upvotedByMe: false, reported: false, replies: [] },
];

const seedGroups = [
  { id: "g1", name: "Class 11 Physics Circle", level: "Class 11", members: 34, joined: true, description: "Daily doubt-solving and chapter-wise revision for Class 11 Physics.",
    chat: [ { author: "Meera", text: "Anyone finished the Kinematics DPP today?", time: "10:12 AM" }, { author: "Devansh", text: "Yep, Q7 was tricky — relative velocity in 2D.", time: "10:14 AM" } ] },
  { id: "g2", name: "JEE Advanced Warriors", level: "JEE Advanced", members: 58, joined: false, description: "For students targeting JEE Advanced — high-difficulty problem sets.",
    chat: [ { author: "Ishaan", text: "Today's challenge was brutal 😅", time: "9:02 PM" } ] },
  { id: "g3", name: "Mole Concept Mastery", level: "Class 11", members: 21, joined: false, description: "Focused group to fully master Mole Concept before moving ahead.", chat: [] },
  { id: "g4", name: "JEE Main 90-Day Sprint", level: "JEE Main", members: 76, joined: true, description: "Structured daily plan and accountability group for the final stretch.",
    chat: [ { author: "Farah", text: "Shared today's revision notes in the group notes tab.", time: "7:45 AM" } ] },
];

const dailyChallenge = {
  date: "Today", subject: "Physics", difficulty: "JEE Main",
  question: "A particle moves along the x-axis with velocity v = 3t² − 12t + 9 (m/s). Find the total distance travelled between t = 0s and t = 4s.",
  submissions: [
    { author: "Nikhil", method: "Split at turning points (t=1, t=3), integrate |v| in each interval.", votes: 12 },
    { author: "Ayesha", method: "Found displacement s(t), evaluated sign changes of v to add distances separately.", votes: 8 },
  ],
};

const chatRoomsSeed = {
  General: [ { author: "Moderator", text: "Welcome! Keep it respectful and on-topic 🙌", time: "9:00 AM" }, { author: "Tanvi", text: "Anyone up for a quick Physics revision call tonight?", time: "6:20 PM" } ],
  "Physics Doubts": [ { author: "Rohan", text: "Stuck on a friction problem, will post shortly.", time: "4:10 PM" } ],
  "Chemistry Doubts": [],
  "Math Doubts": [ { author: "Simran", text: "Does anyone have a clean proof for AM-GM?", time: "8:30 PM" } ],
};

const notificationsSeed = [
  { id: "n1", text: "Aman S. marked as Best Answer on your rotational motion question.", read: false },
  { id: "n2", text: "Priya M. replied to a thread you're following.", read: false },
  { id: "n3", text: "Your mole concept answer received 5 new upvotes.", read: true },
  { id: "n4", text: "Karthik R. mentioned you in JEE Advanced Warriors.", read: true },
];

/* ================================================================
   SMALL PRIMITIVES
================================================================ */
const SubjectBadge = ({ subject }) => (
  <span className="text-xs font-semibold px-2 py-1 rounded-md jsh-display"
    style={{ background: `var(${subjectTintVar(subject)})`, color: `var(${subjectColorVar(subject)})` }}>
    {subject}
  </span>
);
const DifficultyBadge = ({ level }) => {
  const hardish = level === "Hard" || level === "JEE Advanced";
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-md"
      style={{ background: hardish ? "var(--red-tint)" : "var(--amber-tint)", color: hardish ? "var(--red)" : "var(--amber)" }}>
      {level}
    </span>
  );
};
const Avatar = ({ name, size = 32, color = "#2452E8" }) => {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0 jsh-display"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
};
const Toast = ({ message, onClose }) => !message ? null : (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium jsh-card jsh-fade-in flex items-center gap-2 jsh-no-print">
    <CheckCircle2 size={16} style={{ color: "var(--blue)" }} />
    {message}
    <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X size={14} /></button>
  </div>
);
const SectionHeading = ({ eyebrow, title, sub }) => (
  <div className="mb-6">
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--blue)" }}>{eyebrow}</p>}
    <h2 className="jsh-display font-bold text-2xl sm:text-3xl">{title}</h2>
    {sub && <p className="text-sm mt-2 max-w-2xl" style={{ color: "var(--ink-soft)" }}>{sub}</p>}
  </div>
);

/* ================================================================
   HOME PAGE
================================================================ */
function Home({ go }) {
  return (
    <div className="jsh-fade-in">
      <section className="text-center py-14 sm:py-20 px-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>
          <GraduationCap size={13} /> Made by a Class 11 JEE student, for JEE students
        </div>
        <h1 className="jsh-display font-extrabold text-4xl sm:text-5xl leading-tight max-w-3xl mx-auto">
          JEE Study Hub
        </h1>
        <p className="jsh-display text-lg sm:text-xl font-medium mt-3" style={{ color: "var(--blue)" }}>
          Learn Smart. Practice Daily. Crack JEE.
        </p>
        <p className="text-sm sm:text-base max-w-xl mx-auto mt-5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Welcome to JEE Study Hub. I am a Class 11 JEE student. I share my self-made notes, important points,
          formulas, and practice questions to help fellow JEE aspirants. My goal is to make JEE preparation
          easier and more organized.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button onClick={() => go("physics")} className="jsh-btn-primary text-sm font-semibold px-5 py-3 rounded-xl">Start Learning</button>
          <button onClick={() => go("physics")} className="jsh-chip text-sm font-semibold px-5 py-3 rounded-xl">View Notes</button>
          <button onClick={() => go("practice")} className="jsh-chip text-sm font-semibold px-5 py-3 rounded-xl">Practice Questions</button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-4 pb-14">
        {SUBJECTS.map((s) => {
          const Icon = subjectIcon[s];
          return (
            <button key={s} onClick={() => go(s.toLowerCase())} className="jsh-card rounded-2xl p-5 text-left jsh-tab-notch hover:-translate-y-0.5 transition-transform" style={{ "--tab-color": `var(${subjectColorVar(s)})` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `var(${subjectTintVar(s)})` }}>
                <Icon size={18} style={{ color: `var(${subjectColorVar(s)})` }} />
              </div>
              <p className="jsh-display font-semibold text-[15px]">{s}</p>
              <p className="text-xs mt-1" style={{ color: "var(--ink-faint)" }}>{CHAPTERS_BY_SUBJECT[s].length} chapters · notes, formulas & tips</p>
            </button>
          );
        })}
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="jsh-card rounded-2xl p-6 grid sm:grid-cols-4 gap-4 text-center">
          {[
            ["Chapter-wise Notes", BookOpen], ["Practice Questions", ListChecks],
            ["Formula Sheets", FileText], ["Student Community", Users],
          ].map(([label, Icon]) => (
            <div key={label}>
              <Icon size={20} className="mx-auto mb-2" style={{ color: "var(--blue)" }} />
              <p className="text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   SUBJECT PAGE
================================================================ */
function SubjectPage({ subject, chapters, bookmarks, toggleBookmark, showToast }) {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(chapters[0]?.id || null);
  const color = `var(${subjectColorVar(subject)})`;

  const filtered = chapters.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.notesText.toLowerCase().includes(q) ||
      c.keyConcepts.some((k) => k.toLowerCase().includes(q)) ||
      c.formulas.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="jsh-fade-in max-w-4xl mx-auto">
      <SectionHeading eyebrow={`${subject} · Class 11 & 12`} title={`${subject} Notes`} sub="Chapter-wise handwritten-style notes, formulas, common mistakes, and exam tips — built for quick revision." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search within ${subject} notes…`}
            className="jsh-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
        </div>
        <button onClick={() => { window.print(); }} className="jsh-chip text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap">
          <Download size={15} /> Download PDF
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isOpen = openId === c.id;
          const bookmarked = bookmarks.includes(c.id);
          return (
            <div key={c.id} className="jsh-card rounded-2xl overflow-hidden jsh-tab-notch" style={{ "--tab-color": color }}>
              <button onClick={() => setOpenId(isOpen ? null : c.id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="jsh-display font-semibold text-[15px]">{c.title}</span>
                <div className="flex items-center gap-2">
                  <span onClick={(e) => { e.stopPropagation(); toggleBookmark(c.id); showToast(bookmarked ? "Removed bookmark" : "Bookmarked for quick access"); }}
                    className="p-1.5 rounded-lg jsh-chip cursor-pointer" style={bookmarked ? { color, borderColor: color } : {}}>
                    {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  </span>
                  <ChevronDown size={18} style={{ color: "var(--ink-faint)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 jsh-fade-in">
                  <p className="text-sm leading-relaxed mb-4 p-3 rounded-xl jsh-ruled" style={{ color: "var(--ink)" }}>{c.notesText}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color }}><Lightbulb size={13} /> Key concepts</p>
                      <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                        {c.keyConcepts.map((k, i) => <li key={i}>• {k}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color }}><Calculator size={13} /> Key formulas</p>
                      <ul className="text-sm space-y-1.5 jsh-mono" style={{ color: "var(--ink)" }}>
                        {c.formulas.map((f, i) => <li key={i} className="px-2 py-1 rounded-md" style={{ background: "var(--bg-soft)" }}>{f}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--red)" }}><AlertTriangle size={13} /> Common mistakes</p>
                      <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                        {c.mistakes.map((m, i) => <li key={i}>• {m}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--green)" }}><Target size={13} /> Exam tips</p>
                      <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                        {c.examTips.map((t, i) => <li key={i}>• {t}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--blue)" }}><Repeat size={13} /> Revision points</p>
                    <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                      {c.revision.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="jsh-card rounded-2xl text-center py-14">
            <p className="text-sm" style={{ color: "var(--ink-faint)" }}>No notes match "{search}" yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   PRACTICE QUESTIONS
================================================================ */
function Practice({ questions, setQuestions }) {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});

  const TYPES = ["Topic-wise", "Daily Practice", "Previous Year"];
  const DIFFS = ["Easy", "Medium", "Hard"];

  const filtered = questions.filter((q) => {
    const s = search.toLowerCase();
    return (
      (subjectFilter === "All" || q.subject === subjectFilter) &&
      (difficultyFilter === "All" || q.difficulty === difficultyFilter) &&
      (typeFilter === "All" || q.type === typeFilter) &&
      (!s || q.question.toLowerCase().includes(s) || q.chapter.toLowerCase().includes(s))
    );
  });

  const toggleComplete = (id) => setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, completed: !q.completed } : q));
  const doneCount = questions.filter((q) => q.completed).length;

  return (
    <div className="jsh-fade-in max-w-4xl mx-auto">
      <SectionHeading eyebrow="Practice" title="Practice Questions" sub="Easy, Medium, Hard, Previous Year and Daily Practice Questions — with full explanations." />

      <div className="jsh-card rounded-xl p-3 mb-5 flex items-center justify-between">
        <span className="text-sm font-medium">{doneCount} / {questions.length} completed</span>
        <div className="w-40 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-soft)" }}>
          <div className="h-full" style={{ width: `${(doneCount / questions.length) * 100}%`, background: "var(--green)" }} />
        </div>
      </div>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions by topic or chapter…" className="jsh-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {["All", ...SUBJECTS].map((s) => (
          <button key={s} data-active={subjectFilter === s} onClick={() => setSubjectFilter(s)} className="jsh-chip text-xs font-medium px-2.5 py-1.5 rounded-full">{s}</button>
        ))}
        <span className="w-px h-4 self-center" style={{ background: "var(--border)" }} />
        {["All", ...DIFFS].map((d) => (
          <button key={d} data-active={difficultyFilter === d} onClick={() => setDifficultyFilter(d)} className="jsh-chip text-xs font-medium px-2.5 py-1.5 rounded-full">{d}</button>
        ))}
        <span className="w-px h-4 self-center" style={{ background: "var(--border)" }} />
        {["All", ...TYPES].map((t) => (
          <button key={t} data-active={typeFilter === t} onClick={() => setTypeFilter(t)} className="jsh-chip text-xs font-medium px-2.5 py-1.5 rounded-full">{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="jsh-card rounded-2xl p-4 jsh-tab-notch" style={{ "--tab-color": `var(${subjectColorVar(q.subject)})`, opacity: q.completed ? 0.75 : 1 }}>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <SubjectBadge subject={q.subject} />
              <DifficultyBadge level={q.difficulty} />
              <span className="text-xs px-2 py-1 rounded-md jsh-chip flex items-center gap-1"><Hash size={11} />{q.chapter}</span>
              <span className="text-xs px-2 py-1 rounded-md jsh-chip">{q.type}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3">{q.question}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))} className="jsh-btn-primary text-xs font-semibold px-3 py-1.5 rounded-lg">
                {revealed[q.id] ? "Hide answer" : "Show answer & explanation"}
              </button>
              <button onClick={() => toggleComplete(q.id)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5" data-active={q.completed}>
                <CheckCircle2 size={13} /> {q.completed ? "Completed" : "Mark as Completed"}
              </button>
            </div>
            {revealed[q.id] && (
              <div className="mt-3 pt-3 border-t jsh-fade-in" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--green)" }}>Answer: {q.answer}</p>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="jsh-card rounded-2xl text-center py-14"><p className="text-sm" style={{ color: "var(--ink-faint)" }}>No questions match these filters.</p></div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   QUESTION STRATEGY
================================================================ */
function Strategy() {
  const steps = [
    ["Read twice, decide once", "Read the full question before touching a formula — many JEE questions hide the key condition in the last line."],
    ["Identify the concept family", "Ask: is this kinematics, energy conservation, or rotational? The right family narrows down which formulas apply."],
    ["Estimate before calculating", "A rough estimate catches silly errors — if your final answer is 1000× off from your estimate, recheck."],
    ["Solve, then simplify late", "Keep expressions symbolic as long as possible; substitute numbers only in the final step to avoid compounding rounding errors."],
  ];
  return (
    <div className="jsh-fade-in max-w-3xl mx-auto space-y-8">
      <SectionHeading eyebrow="Strategy" title="Question Strategy" sub="How to approach JEE questions, manage time, and steadily improve accuracy and speed." />

      <div>
        <p className="jsh-display font-semibold text-lg mb-3 flex items-center gap-2"><Target size={17} style={{ color: "var(--blue)" }} /> Step-by-step problem-solving</p>
        <div className="space-y-2">
          {steps.map(([title, desc], i) => (
            <div key={i} className="jsh-card rounded-xl p-4 flex gap-3">
              <span className="jsh-display font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>{i + 1}</span>
              <div><p className="text-sm font-semibold">{title}</p><p className="text-sm mt-0.5" style={{ color: "var(--ink-soft)" }}>{desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="jsh-card rounded-xl p-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Timer size={15} style={{ color: "var(--blue)" }} /> Time management</p>
          <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
            <li>• Allocate roughly 2 minutes per question on the first pass — skip and flag anything longer.</li>
            <li>• Do a second pass only for flagged/skipped questions.</li>
            <li>• Reserve the last 10 minutes purely for review, not new questions.</li>
          </ul>
        </div>
        <div className="jsh-card rounded-xl p-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle size={15} style={{ color: "var(--red)" }} /> Common mistakes to avoid</p>
          <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
            <li>• Skipping units, leading to wrong final magnitude.</li>
            <li>• Sign errors from an unclear reference direction.</li>
            <li>• Rushing MCQs by "answer matching" without solving fully.</li>
          </ul>
        </div>
        <div className="jsh-card rounded-xl p-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Target size={15} style={{ color: "var(--green)" }} /> Improving accuracy</p>
          <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
            <li>• Re-derive formulas instead of memorizing blindly — you'll catch misapplication faster.</li>
            <li>• Keep an error log of mistakes by type and review it weekly.</li>
          </ul>
        </div>
        <div className="jsh-card rounded-xl p-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Flame size={15} style={{ color: "var(--amber)" }} /> Increasing speed</p>
          <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
            <li>• Practice mental math for common calculations (squares, roots, fractions).</li>
            <li>• Time yourself on topic-wise sets to build calibrated pacing.</li>
          </ul>
        </div>
      </div>

      <div className="jsh-card rounded-2xl p-5">
        <p className="jsh-display font-semibold text-lg mb-3">Daily practice routine</p>
        <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
          <li>• 1 new chapter's worth of notes + key formulas revised.</li>
          <li>• 10–15 practice questions across difficulty levels.</li>
          <li>• 1 previous year question solved under timed conditions.</li>
        </ul>
        <p className="jsh-display font-semibold text-lg mt-5 mb-3">Weekly revision plan</p>
        <ul className="text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
          <li>• One day fully dedicated to revising the week's formulas from the Formula Sheet.</li>
          <li>• One mixed practice set spanning all three subjects.</li>
          <li>• Review your error log and re-attempt previously wrong questions.</li>
        </ul>
      </div>
    </div>
  );
}

/* ================================================================
   FORMULA SHEET
================================================================ */
function FormulaSheetPage() {
  const [subject, setSubject] = useState("Physics");
  const [search, setSearch] = useState("");
  const data = formulaSheet[subject].map((g) => ({
    ...g,
    items: g.items.filter((i) => !search || i.toLowerCase().includes(search.toLowerCase()) || g.topic.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="jsh-fade-in max-w-3xl mx-auto">
      <SectionHeading eyebrow="Quick revision" title="Formula Sheet" sub="Physics, Chemistry and Mathematics formulas in one printable page." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5 jsh-no-print">
        <div className="flex gap-2">
          {SUBJECTS.map((s) => (
            <button key={s} data-active={subject === s} onClick={() => setSubject(s)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-full">{s}</button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search formulas…" className="jsh-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
        </div>
        <button onClick={() => window.print()} className="jsh-chip text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"><Printer size={15} /> Print / PDF</button>
      </div>

      <div className="jsh-card rounded-2xl p-6 space-y-5" style={{ "--tab-color": `var(${subjectColorVar(subject)})` }}>
        {data.map((g) => (
          <div key={g.topic}>
            <p className="jsh-display font-semibold text-sm mb-2" style={{ color: `var(${subjectColorVar(subject)})` }}>{g.topic}</p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {g.items.map((f, i) => (
                <li key={i} className="jsh-mono text-sm px-3 py-2 rounded-lg" style={{ background: "var(--bg-soft)" }}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-center py-8" style={{ color: "var(--ink-faint)" }}>No formulas match your search.</p>}
      </div>
    </div>
  );
}

/* ================================================================
   NOTES EDITOR (owner CRUD)
================================================================ */
function NotesEditor({ subjectData, setSubjectData, showToast }) {
  const [subject, setSubject] = useState("Physics");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const fileRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const chapters = subjectData[subject];

  const startNew = () => {
    setEditingId("new");
    setForm({ id: "n" + Date.now(), title: "", keyConcepts: [""], formulas: [""], mistakes: [""], examTips: [""], revision: [""], notesText: "" });
    setAttachedFiles([]);
  };
  const startEdit = (ch) => { setEditingId(ch.id); setForm({ ...ch }); setAttachedFiles([]); };
  const cancel = () => { setEditingId(null); setForm(null); };

  const updateListField = (field, idx, value) => {
    setForm((f) => { const arr = [...f[field]]; arr[idx] = value; return { ...f, [field]: arr }; });
  };
  const addListItem = (field) => setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  const removeListItem = (field, idx) => setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  const save = () => {
    if (!form.title.trim()) return;
    const clean = { ...form, keyConcepts: form.keyConcepts.filter(Boolean), formulas: form.formulas.filter(Boolean), mistakes: form.mistakes.filter(Boolean), examTips: form.examTips.filter(Boolean), revision: form.revision.filter(Boolean) };
    setSubjectData((prev) => {
      const exists = prev[subject].some((c) => c.id === clean.id);
      const list = exists ? prev[subject].map((c) => (c.id === clean.id ? clean : c)) : [clean, ...prev[subject]];
      return { ...prev, [subject]: list };
    });
    showToast(editingId === "new" ? "Note added" : "Note updated");
    cancel();
  };
  const remove = (id) => {
    setSubjectData((prev) => ({ ...prev, [subject]: prev[subject].filter((c) => c.id !== id) }));
    showToast("Note deleted");
  };

  const fields = [
    ["keyConcepts", "Key concepts"], ["formulas", "Formulas"], ["mistakes", "Common mistakes"], ["examTips", "Exam tips"], ["revision", "Revision points"],
  ];

  return (
    <div className="jsh-fade-in max-w-4xl mx-auto">
      <SectionHeading eyebrow="Owner tools" title="Notes Editor" sub="Add, edit, or delete notes — upload images, diagrams, and PDFs, and highlight key points." />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {SUBJECTS.map((s) => (
            <button key={s} data-active={subject === s} onClick={() => { setSubject(s); cancel(); }} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-full">{s}</button>
          ))}
        </div>
        <button onClick={startNew} className="jsh-btn-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"><Plus size={15} /> Add note</button>
      </div>

      {form && (
        <div className="jsh-card rounded-2xl p-5 mb-5 jsh-fade-in">
          <p className="text-sm font-semibold mb-3">{editingId === "new" ? "New chapter note" : "Editing note"}</p>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Chapter title" className="jsh-input w-full rounded-lg px-3 py-2 text-sm outline-none mb-3" />
          <textarea value={form.notesText} onChange={(e) => setForm((f) => ({ ...f, notesText: e.target.value }))} rows={3} placeholder="Main note content…" className="jsh-input w-full rounded-lg px-3 py-2 text-sm outline-none resize-none mb-4" />

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {fields.map(([field, label]) => (
              <div key={field}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>{label}</p>
                {form[field].map((val, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                    <input value={val} onChange={(e) => updateListField(field, idx, e.target.value)} className="jsh-input flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none" placeholder={`${label} item`} />
                    <button onClick={() => removeListItem(field, idx)} className="p-1.5 rounded-lg jsh-chip"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addListItem(field)} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--blue)" }}><Plus size={12} /> Add item</button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Upload images, diagrams, or PDF</p>
            <button onClick={() => fileRef.current?.click()} className="jsh-chip text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"><ImageIcon size={13} /> Choose files</button>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => setAttachedFiles(Array.from(e.target.files || []).map((f) => f.name))} />
            {attachedFiles.length > 0 && (
              <ul className="mt-2 space-y-1">{attachedFiles.map((n, i) => <li key={i} className="text-xs jsh-mono" style={{ color: "var(--ink-soft)" }}>📎 {n}</li>)}</ul>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={cancel} className="jsh-chip text-sm font-medium px-4 py-2 rounded-lg">Cancel</button>
            <button onClick={save} className="jsh-btn-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"><Save size={14} /> Save note</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {chapters.map((c) => (
          <div key={c.id} className="jsh-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div><p className="text-sm font-semibold">{c.title}</p><p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>{c.keyConcepts.length} key concepts · {c.formulas.length} formulas</p></div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(c)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"><PenLine size={12} /> Edit</button>
              <button onClick={() => remove(c.id)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ color: "var(--red)" }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   ABOUT / CONTACT
================================================================ */
function About() {
  return (
    <div className="jsh-fade-in max-w-2xl mx-auto">
      <SectionHeading eyebrow="About" title="About JEE Study Hub" />
      <div className="jsh-card rounded-2xl p-6">
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          I am a Class 11 JEE student who enjoys learning Physics, Chemistry, and Mathematics. I created this
          website to share my self-written notes, important concepts, and practice questions with other JEE
          aspirants. Everything on this website is organized to help students revise quickly and prepare effectively.
        </p>
      </div>
      <div className="jsh-card rounded-2xl p-6 mt-4">
        <p className="text-sm font-semibold mb-3">Coming soon</p>
        <div className="flex flex-wrap gap-2">
          {["User accounts", "Login & signup", "Progress tracking", "Daily quizzes", "Mock tests", "Leaderboard", "AI study assistant", "Flashcards", "Revision reminders"].map((f) => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-full jsh-chip">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact({ showToast }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [sent, setSent] = useState(false);
  return (
    <div className="jsh-fade-in max-w-lg mx-auto">
      <SectionHeading eyebrow="Contact" title="Get in touch" sub="Questions, feedback, or suggestions for the site — I'd love to hear them." />
      <div className="jsh-card rounded-2xl p-6">
        {sent ? (
          <p className="text-sm flex items-center gap-2" style={{ color: "var(--green)" }}><CheckCircle2 size={16} /> Thanks — your message has been sent!</p>
        ) : (
          <>
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="jsh-input w-full mt-1 mb-3 rounded-lg px-3 py-2 text-sm outline-none" />
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="jsh-input w-full mt-1 mb-3 rounded-lg px-3 py-2 text-sm outline-none" />
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Feedback / suggestion</label>
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="jsh-input w-full mt-1 mb-4 rounded-lg px-3 py-2 text-sm outline-none resize-none" placeholder="What can be improved, or what would you like to see next?" />
            <button disabled={!name || !email || !message} onClick={() => { setSent(true); showToast("Message sent — thank you!"); }} className="jsh-btn-primary w-full text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 flex items-center justify-center gap-1.5"><Mail size={15} /> Send message</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   COMMUNITY — Forum, Groups, Challenge, Chat, Profile
================================================================ */
function NewDiscussionModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState(""); const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState(CHAPTERS_BY_SUBJECT["Physics"][0]); const [difficulty, setDifficulty] = useState("Medium");
  const [body, setBody] = useState(""); const [imageNames, setImageNames] = useState([]); const fileRef = useRef(null);
  const insertSymbol = (sym) => setBody((b) => b + sym);
  const handleFiles = (e) => setImageNames((prev) => [...prev, ...Array.from(e.target.files || []).map((f) => f.name)]);
  const canPost = title.trim().length > 4 && body.trim().length > 4;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="jsh-card w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto jsh-scroll jsh-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="jsh-display font-semibold text-lg">Start a new discussion</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--ink-soft)" }}><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Question title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Why does the electric field inside a conductor vanish?" className="jsh-input w-full mt-1 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Subject</label>
              <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(CHAPTERS_BY_SUBJECT[e.target.value][0]); }} className="jsh-input w-full mt-1 rounded-lg px-2 py-2 text-sm outline-none">
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Chapter</label>
              <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="jsh-input w-full mt-1 rounded-lg px-2 py-2 text-sm outline-none">
                {CHAPTERS_BY_SUBJECT[subject].map((c) => <option key={c}>{c}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="jsh-input w-full mt-1 rounded-lg px-2 py-2 text-sm outline-none">
                {DIFFICULTIES_FORUM.map((d) => <option key={d}>{d}</option>)}
              </select></div>
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Your question or solution</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Describe what you've tried and where you're stuck." className="jsh-input w-full mt-1 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {["∫", "∑", "√", "π", "θ", "Δ", "≤", "≥", "→", "±", "x²", "dy/dx"].map((sym) => (
                <button key={sym} onClick={() => insertSymbol(sym)} className="jsh-chip jsh-mono text-xs px-2 py-1 rounded-md hover:opacity-80">{sym}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Attach images (handwritten solution, diagram, or graph)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => fileRef.current?.click()} className="jsh-chip text-sm px-3 py-2 rounded-lg flex items-center gap-1.5"><ImageIcon size={15} /> Upload image</button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              {imageNames.length > 0 && <span className="text-xs" style={{ color: "var(--ink-faint)" }}>{imageNames.length} file(s) attached</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-lg jsh-chip">Cancel</button>
          <button disabled={!canPost} onClick={() => canPost && onSubmit({ title, subject, chapter, difficulty, body, images: imageNames })} className="jsh-btn-primary text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40">Post discussion</button>
        </div>
      </div>
    </div>
  );
}

function ThreadDetail({ thread, onBack, onUpvoteThread, onReport, onAddReply, onUpvoteReply, onMarkBest }) {
  const [replyText, setReplyText] = useState("");
  const isOwner = thread.author === "You";
  const sortedReplies = [...thread.replies].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0) || b.upvotes - a.upvotes);
  return (
    <div className="jsh-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium mb-4" style={{ color: "var(--blue)" }}><ChevronLeft size={16} /> Back to discussions</button>
      <div className="jsh-card rounded-2xl p-5 jsh-tab-notch" style={{ "--tab-color": `var(${subjectColorVar(thread.subject)})` }}>
        <div className="flex flex-wrap gap-2 mb-3">
          <SubjectBadge subject={thread.subject} /><DifficultyBadge level={thread.difficulty} />
          <span className="text-xs px-2 py-1 rounded-md jsh-chip flex items-center gap-1"><Hash size={11} />{thread.chapter}</span>
        </div>
        <h2 className="jsh-display font-bold text-xl mb-3">{thread.title}</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-soft)" }}>{thread.body}</p>
        {thread.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.images.map((img, i) => (
              <div key={i} className="rounded-lg border flex items-center gap-2 px-3 py-2 text-xs jsh-mono" style={{ borderColor: "var(--border)", background: "var(--bg-soft)", color: "var(--ink-soft)" }}><ImageIcon size={14} /> {img}</div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Avatar name={thread.author} color={thread.author === "You" ? CURRENT_USER.avatarColor : "#7C4FE0"} size={28} />
            <div><p className="text-sm font-medium">{thread.author}</p><p className="text-xs" style={{ color: "var(--ink-faint)" }}>{thread.cls} · {thread.createdAt}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onUpvoteThread} className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg jsh-chip" data-active={thread.upvotedByMe}><ThumbsUp size={14} /> {thread.upvotes}</button>
            <button onClick={onReport} title="Report" className="p-1.5 rounded-lg jsh-chip" style={{ color: "var(--ink-faint)" }}><Flag size={14} /></button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--ink-soft)" }}>{thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"}</p>
        <div className="space-y-3">
          {sortedReplies.map((r) => (
            <div key={r.id} className="jsh-card rounded-xl p-4" style={r.isBest ? { borderColor: "var(--blue)", boxShadow: "0 0 0 1px var(--blue)" } : {}}>
              {r.isBest && <div className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: "var(--blue)" }}><CheckCircle2 size={14} /> Best Answer</div>}
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={r.author} size={26} color={r.author === "You" ? CURRENT_USER.avatarColor : "#0E9F8E"} />
                <div><p className="text-sm font-medium">{r.author}</p><p className="text-xs" style={{ color: "var(--ink-faint)" }}>{r.cls} · {r.createdAt}</p></div>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--ink-soft)" }}>{r.text}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpvoteReply(r.id)} data-active={r.upvotedByMe} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg jsh-chip"><ThumbsUp size={12} /> {r.upvotes}</button>
                {isOwner && !r.isBest && <button onClick={() => onMarkBest(r.id)} className="text-xs font-medium px-2.5 py-1 rounded-lg jsh-chip">Mark best answer</button>}
                <button className="p-1.5 rounded-lg jsh-chip ml-auto" style={{ color: "var(--ink-faint)" }}><Flag size={12} /></button>
              </div>
            </div>
          ))}
          {thread.replies.length === 0 && <p className="text-sm text-center py-6" style={{ color: "var(--ink-faint)" }}>No replies yet — be the first to help out.</p>}
        </div>
        <div className="jsh-card rounded-xl p-4 mt-4">
          <p className="text-sm font-semibold mb-2">Write a reply</p>
          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} placeholder="Explain your method, or ask a follow-up question…" className="jsh-input w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" />
          <div className="flex justify-end mt-2">
            <button disabled={replyText.trim().length < 3} onClick={() => { onAddReply(replyText); setReplyText(""); }} className="jsh-btn-primary text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40 flex items-center gap-1.5"><Send size={14} /> Post reply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Forum({ threads, setThreads, openThreadId, setOpenThreadId, showToast }) {
  const [search, setSearch] = useState(""); const [subjectFilter, setSubjectFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState("All"); const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [showNew, setShowNew] = useState(false); const [sortBy, setSortBy] = useState("recent");
  const chapterOptions = subjectFilter === "All" ? Object.values(CHAPTERS_BY_SUBJECT).flat() : CHAPTERS_BY_SUBJECT[subjectFilter];

  const filtered = useMemo(() => {
    let list = threads.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.chapter.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
      return matchesSearch && (subjectFilter === "All" || t.subject === subjectFilter) && (chapterFilter === "All" || t.chapter === chapterFilter) && (difficultyFilter === "All" || t.difficulty === difficultyFilter);
    });
    if (sortBy === "upvotes") list = [...list].sort((a, b) => b.upvotes - a.upvotes);
    if (sortBy === "replies") list = [...list].sort((a, b) => b.replies.length - a.replies.length);
    return list;
  }, [threads, search, subjectFilter, chapterFilter, difficultyFilter, sortBy]);

  const openThread = threads.find((t) => t.id === openThreadId);
  const updateThread = (id, updater) => setThreads((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));

  if (openThread) {
    return (
      <ThreadDetail thread={openThread} onBack={() => setOpenThreadId(null)}
        onUpvoteThread={() => updateThread(openThread.id, (t) => ({ ...t, upvotes: t.upvotedByMe ? t.upvotes - 1 : t.upvotes + 1, upvotedByMe: !t.upvotedByMe }))}
        onReport={() => showToast("Thanks — this post has been reported to moderators.")}
        onAddReply={(text) => updateThread(openThread.id, (t) => ({ ...t, replies: [...t.replies, { id: "r" + Date.now(), author: "You", cls: CURRENT_USER.cls, text, upvotes: 0, upvotedByMe: false, isBest: false, createdAt: "just now" }] }))}
        onUpvoteReply={(rid) => updateThread(openThread.id, (t) => ({ ...t, replies: t.replies.map((r) => r.id === rid ? { ...r, upvotes: r.upvotedByMe ? r.upvotes - 1 : r.upvotes + 1, upvotedByMe: !r.upvotedByMe } : r) }))}
        onMarkBest={(rid) => updateThread(openThread.id, (t) => ({ ...t, replies: t.replies.map((r) => ({ ...r, isBest: r.id === rid })) }))} />
    );
  }

  return (
    <div className="jsh-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by topic, chapter, keyword, or formula…" className="jsh-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
        </div>
        <button onClick={() => setShowNew(true)} className="jsh-btn-primary text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"><Plus size={16} /> New discussion</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        <Filter size={14} style={{ color: "var(--ink-faint)" }} />
        {["All", ...SUBJECTS].map((s) => <button key={s} data-active={subjectFilter === s} onClick={() => { setSubjectFilter(s); setChapterFilter("All"); }} className="jsh-chip text-xs font-medium px-2.5 py-1.5 rounded-full">{s}</button>)}
        <span className="w-px h-4" style={{ background: "var(--border)" }} />
        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className="jsh-input text-xs font-medium px-2.5 py-1.5 rounded-full outline-none">
          <option>All chapters</option>{chapterOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="jsh-input text-xs font-medium px-2.5 py-1.5 rounded-full outline-none">
          <option>All</option>{DIFFICULTIES_FORUM.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: "var(--ink-faint)" }}>Sort:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="jsh-input text-xs px-2 py-1.5 rounded-full outline-none ml-1">
            <option value="recent">Most recent</option><option value="upvotes">Most upvoted</option><option value="replies">Most replies</option>
          </select>
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--ink-faint)" }}>{filtered.length} discussion{filtered.length !== 1 && "s"}</p>
      <div className="space-y-3">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => setOpenThreadId(t.id)} className="jsh-card w-full text-left rounded-xl p-4 jsh-tab-notch hover:-translate-y-0.5 transition-transform" style={{ "--tab-color": `var(${subjectColorVar(t.subject)})` }}>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <SubjectBadge subject={t.subject} /><DifficultyBadge level={t.difficulty} />
              <span className="text-xs px-2 py-1 rounded-md jsh-chip flex items-center gap-1"><Hash size={11} />{t.chapter}</span>
              {t.replies.some((r) => r.isBest) && <span className="text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}><CheckCircle2 size={11} /> Solved</span>}
            </div>
            <h3 className="jsh-display font-semibold text-[15px] mb-1.5">{t.title}</h3>
            <div className="flex items-center justify-between text-xs" style={{ color: "var(--ink-faint)" }}>
              <span>{t.author} · {t.createdAt}</span>
              <span className="flex items-center gap-3"><span className="flex items-center gap-1"><ThumbsUp size={12} /> {t.upvotes}</span><span className="flex items-center gap-1"><MessageSquare size={12} /> {t.replies.length}</span></span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 jsh-card rounded-xl"><p className="text-sm" style={{ color: "var(--ink-faint)" }}>No discussions match your filters yet.</p></div>}
      </div>
      {showNew && <NewDiscussionModal onClose={() => setShowNew(false)} onSubmit={(data) => {
        setThreads((prev) => [{ id: "t" + Date.now(), title: data.title, subject: data.subject, chapter: data.chapter, difficulty: data.difficulty, author: "You", cls: CURRENT_USER.cls, createdAt: "just now", body: data.body, images: data.images, upvotes: 0, upvotedByMe: false, reported: false, replies: [] }, ...prev]);
        setShowNew(false); showToast("Your discussion has been posted!");
      }} />}
    </div>
  );
}

function StudyGroups({ groups, setGroups, showToast }) {
  const [levelFilter, setLevelFilter] = useState("All"); const [openGroupId, setOpenGroupId] = useState(null);
  const [msg, setMsg] = useState(""); const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState(""); const [newLevel, setNewLevel] = useState("Class 11");
  const levels = ["All", "Class 11", "Class 12", "JEE Main", "JEE Advanced"];
  const filtered = groups.filter((g) => levelFilter === "All" || g.level === levelFilter);
  const openGroup = groups.find((g) => g.id === openGroupId);
  const toggleJoin = (id) => setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, joined: !g.joined, members: g.members + (g.joined ? -1 : 1) } : g)));

  if (openGroup) {
    return (
      <div className="jsh-fade-in">
        <button onClick={() => setOpenGroupId(null)} className="flex items-center gap-1 text-sm font-medium mb-4" style={{ color: "var(--blue)" }}><ChevronLeft size={16} /> Back to study groups</button>
        <div className="jsh-card rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>{openGroup.level}</span>
              <h2 className="jsh-display font-bold text-xl mt-2">{openGroup.name}</h2>
              <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>{openGroup.description}</p>
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--ink-faint)" }}><Users size={12} /> {openGroup.members} members</p>
            </div>
            <button onClick={() => toggleJoin(openGroup.id)} className={openGroup.joined ? "jsh-chip text-sm font-semibold px-4 py-2 rounded-lg" : "jsh-btn-primary text-sm font-semibold px-4 py-2 rounded-lg"}>{openGroup.joined ? "Joined ✓" : "Join group"}</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 jsh-card rounded-2xl p-4 flex flex-col h-[420px]">
            <p className="text-sm font-semibold mb-3 flex items-center gap-1.5"><MessageCircle size={15} /> Group chat</p>
            <div className="flex-1 overflow-y-auto jsh-scroll space-y-3 pr-1">
              {openGroup.chat.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Avatar name={m.author} size={26} color={m.author === "You" ? CURRENT_USER.avatarColor : "#0E9F8E"} />
                  <div><p className="text-xs font-medium">{m.author} <span className="font-normal" style={{ color: "var(--ink-faint)" }}>· {m.time}</span></p><p className="text-sm" style={{ color: "var(--ink-soft)" }}>{m.text}</p></div>
                </div>
              ))}
              {openGroup.chat.length === 0 && <p className="text-sm text-center py-8" style={{ color: "var(--ink-faint)" }}>No messages yet — say hello!</p>}
            </div>
            {openGroup.joined ? (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && msg.trim()) { setGroups((prev) => prev.map((g) => g.id === openGroup.id ? { ...g, chat: [...g.chat, { author: "You", text: msg, time: "now" }] } : g)); setMsg(""); } }} placeholder="Message the group…" className="jsh-input flex-1 rounded-lg px-3 py-2 text-sm outline-none" />
                <button onClick={() => { if (!msg.trim()) return; setGroups((prev) => prev.map((g) => g.id === openGroup.id ? { ...g, chat: [...g.chat, { author: "You", text: msg, time: "now" }] } : g)); setMsg(""); }} className="jsh-btn-primary p-2.5 rounded-lg"><Send size={15} /></button>
              </div>
            ) : <p className="text-xs text-center pt-3 border-t mt-3" style={{ borderColor: "var(--border)", color: "var(--ink-faint)" }}>Join this group to chat with members.</p>}
          </div>
          <div className="space-y-4">
            <div className="jsh-card rounded-2xl p-4"><p className="text-sm font-semibold mb-2">Shared notes</p><ul className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}><li className="flex items-center gap-2"><BookOpen size={13} /> Rotational Motion — quick revision</li><li className="flex items-center gap-2"><BookOpen size={13} /> Mole Concept formula sheet</li></ul></div>
            <div className="jsh-card rounded-2xl p-4"><p className="text-sm font-semibold mb-2">Shared practice</p><ul className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}><li className="flex items-center gap-2"><CheckCircle2 size={13} /> Weekly DPP set #12</li><li className="flex items-center gap-2"><CheckCircle2 size={13} /> PYQ pack — Kinematics</li></ul></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jsh-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-2 flex-1">{levels.map((l) => <button key={l} data-active={levelFilter === l} onClick={() => setLevelFilter(l)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-full">{l}</button>)}</div>
        <button onClick={() => setShowCreate(true)} className="jsh-btn-primary text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap"><Plus size={16} /> Create group</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((g) => (
          <div key={g.id} className="jsh-card rounded-2xl p-4 flex flex-col">
            <span className="text-xs font-semibold px-2 py-1 rounded-md self-start" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>{g.level}</span>
            <h3 className="jsh-display font-semibold text-[15px] mt-2">{g.name}</h3>
            <p className="text-sm mt-1 flex-1" style={{ color: "var(--ink-soft)" }}>{g.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs flex items-center gap-1" style={{ color: "var(--ink-faint)" }}><Users size={12} /> {g.members} members</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpenGroupId(g.id)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg">View</button>
                <button onClick={() => toggleJoin(g.id)} className={g.joined ? "jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg" : "jsh-btn-primary text-xs font-semibold px-3 py-1.5 rounded-lg"}>{g.joined ? "Joined ✓" : "Join"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="jsh-card w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 jsh-fade-in">
            <div className="flex items-center justify-between mb-4"><h3 className="jsh-display font-semibold text-lg">Create a study group</h3><button onClick={() => setShowCreate(false)}><X size={20} style={{ color: "var(--ink-soft)" }} /></button></div>
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Group name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Chemistry Equilibrium Squad" className="jsh-input w-full mt-1 mb-3 rounded-lg px-3 py-2 text-sm outline-none" />
            <label className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Level</label>
            <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)} className="jsh-input w-full mt-1 mb-4 rounded-lg px-3 py-2 text-sm outline-none">{["Class 11", "Class 12", "JEE Main", "JEE Advanced"].map((l) => <option key={l}>{l}</option>)}</select>
            <button disabled={!newName.trim()} onClick={() => { setGroups((prev) => [{ id: "g" + Date.now(), name: newName, level: newLevel, members: 1, joined: true, description: "A brand-new study group — invite your friends!", chat: [] }, ...prev]); setShowCreate(false); setNewName(""); showToast("Study group created!"); }} className="jsh-btn-primary w-full text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40">Create group</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DailyChallenge({ showToast }) {
  const [answer, setAnswer] = useState(""); const [submissions, setSubmissions] = useState(dailyChallenge.submissions); const [submitted, setSubmitted] = useState(false);
  return (
    <div className="jsh-fade-in max-w-2xl">
      <div className="jsh-card rounded-2xl p-5 jsh-tab-notch" style={{ "--tab-color": "var(--amber)" }}>
        <div className="flex items-center gap-2 mb-2"><Flame size={16} style={{ color: "var(--amber)" }} /><span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--amber)" }}>Daily Challenge · {dailyChallenge.date}</span></div>
        <div className="flex gap-2 mb-3"><SubjectBadge subject={dailyChallenge.subject} /><DifficultyBadge level={dailyChallenge.difficulty} /></div>
        <p className="text-sm leading-relaxed jsh-mono">{dailyChallenge.question}</p>
      </div>
      <div className="jsh-card rounded-2xl p-5 mt-4">
        <p className="text-sm font-semibold mb-2">Submit your approach</p>
        {submitted ? <p className="text-sm flex items-center gap-2" style={{ color: "var(--blue)" }}><CheckCircle2 size={16} /> Submitted — see how others solved it below.</p> : (
          <>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} placeholder="Outline your method — you don't need the full calculation." className="jsh-input w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            <button disabled={answer.trim().length < 3} onClick={() => { setSubmissions((prev) => [{ author: "You", method: answer, votes: 0 }, ...prev]); setSubmitted(true); showToast("Nice work — your approach has been posted!"); }} className="jsh-btn-primary mt-2 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40">Submit</button>
          </>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><TrendingUp size={15} /> Compare methods ({submissions.length})</p>
        <div className="space-y-2">
          {submissions.map((s, i) => (
            <div key={i} className="jsh-card rounded-xl p-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2"><Avatar name={s.author} size={26} color={s.author === "You" ? CURRENT_USER.avatarColor : "#0E9F8E"} /><div><p className="text-sm font-medium">{s.author}</p><p className="text-sm mt-0.5" style={{ color: "var(--ink-soft)" }}>{s.method}</p></div></div>
              <button onClick={() => setSubmissions((prev) => prev.map((x, xi) => xi === i ? { ...x, votes: x.votes + 1 } : x))} className="jsh-chip text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"><ThumbsUp size={12} /> {s.votes}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveChat() {
  const [rooms, setRooms] = useState(chatRoomsSeed); const [activeRoom, setActiveRoom] = useState("General"); const [msg, setMsg] = useState("");
  const send = () => { if (!msg.trim()) return; setRooms((prev) => ({ ...prev, [activeRoom]: [...prev[activeRoom], { author: "You", text: msg, time: "now" }] })); setMsg(""); };
  return (
    <div className="jsh-fade-in grid md:grid-cols-4 gap-4">
      <div className="jsh-card rounded-2xl p-3 md:col-span-1 h-fit">
        <p className="text-xs font-semibold px-1 mb-2" style={{ color: "var(--ink-faint)" }}>ROOMS</p>
        {Object.keys(rooms).map((room) => (
          <button key={room} onClick={() => setActiveRoom(room)} className="w-full text-left text-sm px-3 py-2 rounded-lg mb-1 flex items-center justify-between" style={{ background: activeRoom === room ? "var(--blue-tint)" : "transparent", color: activeRoom === room ? "var(--blue)" : "var(--ink)" }}>
            <span className="flex items-center gap-2"><MessageCircle size={14} /> {room}</span>{rooms[room].length > 0 && <span className="text-xs" style={{ color: "var(--ink-faint)" }}>{rooms[room].length}</span>}
          </button>
        ))}
      </div>
      <div className="jsh-card rounded-2xl p-4 md:col-span-3 flex flex-col h-[500px]">
        <p className="text-sm font-semibold mb-3 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} /> {activeRoom} · live</p>
        <div className="flex-1 overflow-y-auto jsh-scroll space-y-3 pr-1">
          {rooms[activeRoom].map((m, i) => (
            <div key={i} className="flex items-start gap-2"><Avatar name={m.author} size={26} color={m.author === "You" ? CURRENT_USER.avatarColor : "#7C4FE0"} /><div><p className="text-xs font-medium">{m.author} <span className="font-normal" style={{ color: "var(--ink-faint)" }}>· {m.time}</span></p><p className="text-sm" style={{ color: "var(--ink-soft)" }}>{m.text}</p></div></div>
          ))}
          {rooms[activeRoom].length === 0 && <p className="text-sm text-center py-10" style={{ color: "var(--ink-faint)" }}>No messages yet — start the conversation.</p>}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Message #${activeRoom}`} className="jsh-input flex-1 rounded-lg px-3 py-2 text-sm outline-none" />
          <button onClick={send} className="jsh-btn-primary p-2.5 rounded-lg"><Send size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function CommunityProfile({ threads }) {
  const myThreads = threads.filter((t) => t.author === "You");
  const myReplies = threads.flatMap((t) => t.replies.filter((r) => r.author === "You").map((r) => ({ ...r, threadTitle: t.title })));
  return (
    <div className="jsh-fade-in max-w-3xl space-y-5">
      <div className="jsh-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar name={CURRENT_USER.name} size={64} color={CURRENT_USER.avatarColor} />
        <div className="flex-1"><h2 className="jsh-display font-bold text-xl">{CURRENT_USER.name}</h2><p className="text-sm" style={{ color: "var(--ink-faint)" }}>{CURRENT_USER.cls} · JEE Aspirant</p></div>
        <div className="text-right"><p className="jsh-display font-bold text-2xl" style={{ color: "var(--blue)" }}>{CURRENT_USER.reputation}</p><p className="text-xs" style={{ color: "var(--ink-faint)" }}>reputation points</p></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[["Questions asked", CURRENT_USER.questionsAsked], ["Answers posted", CURRENT_USER.answersPosted], ["Best answers", CURRENT_USER.bestAnswers], ["Helpful votes", CURRENT_USER.helpfulVotes]].map(([label, val]) => (
          <div key={label} className="jsh-card rounded-xl p-3.5 text-center"><p className="jsh-display font-bold text-lg">{val}</p><p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>{label}</p></div>
        ))}
      </div>
      <div className="jsh-card rounded-2xl p-5">
        <p className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Award size={15} /> Badges</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_BADGES.map((b) => { const earned = CURRENT_USER.badges.includes(b.name); const Icon = b.icon; return (
            <div key={b.name} className="rounded-xl p-3 text-center border" style={{ borderColor: "var(--border)", opacity: earned ? 1 : 0.4, background: earned ? "var(--blue-tint)" : "transparent" }}>
              <Icon size={20} style={{ color: earned ? "var(--blue)" : "var(--ink-faint)", margin: "0 auto" }} />
              <p className="text-xs font-semibold mt-1.5">{b.name}</p><p className="text-[10px] mt-0.5" style={{ color: "var(--ink-faint)" }}>{b.desc}</p>
            </div>
          ); })}
        </div>
      </div>
      <div className="jsh-card rounded-2xl p-5">
        <p className="text-sm font-semibold mb-3">Your questions</p>
        <div className="space-y-2">
          {myThreads.map((t) => <div key={t.id} className="flex items-center justify-between text-sm py-1.5"><span>{t.title}</span><span className="text-xs flex items-center gap-1" style={{ color: "var(--ink-faint)" }}><ThumbsUp size={11} /> {t.upvotes}</span></div>)}
          {myThreads.length === 0 && <p className="text-sm" style={{ color: "var(--ink-faint)" }}>You haven't asked any questions yet.</p>}
        </div>
      </div>
      <div className="jsh-card rounded-2xl p-5">
        <p className="text-sm font-semibold mb-3">Your answers</p>
        <div className="space-y-2">
          {myReplies.map((r) => <div key={r.id} className="text-sm py-1.5"><p style={{ color: "var(--ink-faint)" }} className="text-xs mb-0.5">on "{r.threadTitle}"</p><p className="flex items-center gap-2">{r.text.slice(0, 70)}{r.text.length > 70 && "…"} {r.isBest && <CheckCircle2 size={13} style={{ color: "var(--blue)" }} />}</p></div>)}
          {myReplies.length === 0 && <p className="text-sm" style={{ color: "var(--ink-faint)" }}>You haven't answered any questions yet.</p>}
        </div>
      </div>
    </div>
  );
}

function GuidelinesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="jsh-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 jsh-fade-in">
        <div className="flex items-center justify-between mb-3"><h3 className="jsh-display font-semibold text-lg flex items-center gap-2"><Shield size={18} style={{ color: "var(--blue)" }} /> Community guidelines</h3><button onClick={onClose}><X size={20} style={{ color: "var(--ink-soft)" }} /></button></div>
        <ul className="text-sm space-y-2" style={{ color: "var(--ink-soft)" }}>
          <li>• Be respectful — no personal attacks or discouraging comments.</li>
          <li>• Keep posts on-topic and JEE-relevant.</li>
          <li>• Don't post spam, ads, or repeated links.</li>
          <li>• Cite your method when sharing solutions — help others learn, not just copy.</li>
          <li>• Report content that breaks these rules; moderators can edit or remove it.</li>
        </ul>
        <button onClick={onClose} className="jsh-btn-primary w-full text-sm font-semibold py-2.5 rounded-lg mt-4">Got it</button>
      </div>
    </div>
  );
}

function Community({ threads, setThreads, groups, setGroups, showToast }) {
  const [ctab, setCtab] = useState("forum");
  const [openThreadId, setOpenThreadId] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const ctabs = [
    { id: "forum", label: "Forum", icon: MessageSquare },
    { id: "groups", label: "Study Groups", icon: Users },
    { id: "challenge", label: "Daily Challenge", icon: Flame },
    { id: "chat", label: "Live Chat", icon: MessageCircle },
    { id: "profile", label: "My Profile", icon: User },
  ];
  return (
    <div className="jsh-fade-in max-w-5xl mx-auto">
      <SectionHeading eyebrow="Community" title="Discussion & Collaboration" sub="Ask questions, share solutions, join study groups, and learn together with fellow JEE aspirants." />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex flex-wrap gap-1">
          {ctabs.map((t) => { const Icon = t.icon; return (
            <button key={t.id} onClick={() => { setCtab(t.id); setOpenThreadId(null); }} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg" style={{ background: ctab === t.id ? "var(--blue-tint)" : "transparent", color: ctab === t.id ? "var(--blue)" : "var(--ink-soft)" }}>
              <Icon size={15} /> {t.label}
            </button>
          ); })}
        </div>
        <button onClick={() => setShowGuidelines(true)} className="jsh-chip text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Shield size={13} /> Guidelines</button>
      </div>
      {ctab === "forum" && <Forum threads={threads} setThreads={setThreads} openThreadId={openThreadId} setOpenThreadId={setOpenThreadId} showToast={showToast} />}
      {ctab === "groups" && <StudyGroups groups={groups} setGroups={setGroups} showToast={showToast} />}
      {ctab === "challenge" && <DailyChallenge showToast={showToast} />}
      {ctab === "chat" && <LiveChat />}
      {ctab === "profile" && <CommunityProfile threads={threads} />}
      {showGuidelines && <GuidelinesModal onClose={() => setShowGuidelines(false)} />}
    </div>
  );
}

/* ================================================================
   APP SHELL
================================================================ */
export default function JEEStudyHub() {
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("home");
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [ownerMode, setOwnerMode] = useState(false);

  const [subjectData, setSubjectData] = useState(initialSubjectData);
  const [questions, setQuestions] = useState(initialQuestions);
  const [threads, setThreads] = useState(seedThreads);
  const [groups, setGroups] = useState(seedGroups);
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [showNotifs, setShowNotifs] = useState(false);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2800); };
  const toggleBookmark = (id) => setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "physics", label: "Physics", icon: Atom },
    { id: "chemistry", label: "Chemistry", icon: FlaskConical },
    { id: "mathematics", label: "Mathematics", icon: Calculator },
    { id: "practice", label: "Practice Questions", icon: ListChecks },
    { id: "strategy", label: "Question Strategy", icon: Target },
    { id: "formulas", label: "Formula Sheet", icon: FileText },
    { id: "community", label: "Community", icon: Users },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const go = (id) => { setPage(id); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="jsh-root" data-theme={theme}>
      <ThemeStyles />

      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 jsh-no-print" style={{ background: "var(--border)" }}>
        <div className="h-full transition-[width]" style={{ width: `${progress}%`, background: "var(--blue)" }} />
      </div>

      <header className="sticky top-0.5 z-40 border-b jsh-no-print" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button onClick={() => go("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--blue)" }}>
              <GraduationCap size={16} color="#fff" />
            </div>
            <div className="text-left">
              <p className="jsh-display font-bold text-sm leading-tight">JEE Study Hub</p>
              <p className="text-[10px] leading-tight" style={{ color: "var(--ink-faint)" }}>Learn Smart. Practice Daily.</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="text-sm font-medium px-2.5 py-2 rounded-lg" style={{ background: page === n.id ? "var(--blue-tint)" : "transparent", color: page === n.id ? "var(--blue)" : "var(--ink-soft)" }}>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setOwnerMode((o) => !o)} title="Toggle owner / editor mode" className="hidden sm:flex jsh-chip text-xs font-medium px-2.5 py-2 rounded-lg items-center gap-1" data-active={ownerMode}>
              <PenLine size={13} /> Editor
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifs((s) => !s)} className="p-2 rounded-lg jsh-chip relative">
                <Bell size={16} />
                {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white" style={{ background: "var(--red)" }}>{unread}</span>}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-72 jsh-card rounded-xl p-2 jsh-fade-in max-h-80 overflow-y-auto jsh-scroll">
                  <p className="text-xs font-semibold px-2 py-1" style={{ color: "var(--ink-faint)" }}>NOTIFICATIONS</p>
                  {notifications.map((n) => (
                    <button key={n.id} onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))} className="w-full text-left text-sm px-2 py-2 rounded-lg mb-0.5" style={{ background: n.read ? "transparent" : "var(--blue-tint)" }}>{n.text}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))} className="p-2 rounded-lg jsh-chip">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
            <button className="lg:hidden p-2 rounded-lg jsh-chip" onClick={() => setMobileNav((s) => !s)}><Menu size={16} /></button>
          </div>
        </div>

        {mobileNav && (
          <div className="lg:hidden px-4 pb-3 flex flex-wrap gap-2 jsh-fade-in">
            {nav.map((n) => <button key={n.id} onClick={() => go(n.id)} className="jsh-chip text-sm font-medium px-3 py-2 rounded-lg" data-active={page === n.id}>{n.label}</button>)}
            <button onClick={() => setOwnerMode((o) => !o)} className="jsh-chip text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1" data-active={ownerMode}><PenLine size={13} /> Editor</button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {page === "home" && <Home go={go} />}
        {page === "physics" && <SubjectPage subject="Physics" chapters={subjectData.Physics} bookmarks={bookmarks} toggleBookmark={toggleBookmark} showToast={showToast} />}
        {page === "chemistry" && <SubjectPage subject="Chemistry" chapters={subjectData.Chemistry} bookmarks={bookmarks} toggleBookmark={toggleBookmark} showToast={showToast} />}
        {page === "mathematics" && <SubjectPage subject="Mathematics" chapters={subjectData.Mathematics} bookmarks={bookmarks} toggleBookmark={toggleBookmark} showToast={showToast} />}
        {page === "practice" && <Practice questions={questions} setQuestions={setQuestions} />}
        {page === "strategy" && <Strategy />}
        {page === "formulas" && <FormulaSheetPage />}
        {page === "community" && <Community threads={threads} setThreads={setThreads} groups={groups} setGroups={setGroups} showToast={showToast} />}
        {page === "about" && <About />}
        {page === "contact" && <Contact showToast={showToast} />}
        {ownerMode && page !== "community" && (
          <div className="max-w-4xl mx-auto mt-10 pt-8 border-t jsh-no-print" style={{ borderColor: "var(--border)" }}>
            <NotesEditor subjectData={subjectData} setSubjectData={setSubjectData} showToast={showToast} />
          </div>
        )}
      </main>

      <footer className="border-t mt-6 jsh-no-print" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "var(--ink-faint)" }}>
          <span>JEE Study Hub — self-made notes, formulas & practice for JEE Main & Advanced aspirants. Learn Smart. Practice Daily. Crack JEE.</span>
          <span className="flex items-center gap-3">
            {bookmarks.length > 0 && <span className="flex items-center gap-1"><Bookmark size={12} /> {bookmarks.length} bookmarked</span>}
            <button onClick={() => go("contact")} className="underline">Contact</button>
          </span>
        </div>
      </footer>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
