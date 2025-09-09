import React, { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Apple, Award, BarChart3, Bell, Camera, Check, ChevronRight, Flame, HeartPulse, Medal, Menu, Settings, Sparkles, Star, TimerReset, Trophy, Upload, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
// v0.0.1 m
/**
 * Telegram Fitness & Nutrition Coach — Figma-like Mock
 * CalAI-inspired landing + Telegram Mini App UX, in one React file.
 *
 * Goals:
 *  - Ready-to-use mock flows/screens for stakeholder reviews and quick iteration
 *  - Visually polished (light theme by default, supports dark) with Tailwind
 *  - Self-contained: fake services, Device/Secure storage shims, debug console
 *  - Mini App screens: Dashboard, Meals, Workout, Goals, Profile
 *  - Landing page: hero, features, social proof, CTA
 *
 * Notes:
 *  - No real backend calls; all data mocked and stored locally
 *  - Safe to host as static page; when opened inside Telegram WebApp, will pick up theme
 *  - Console logs are added for traceability ("debug events")
 */

/** Tailwind utility: container width breakpoints
 *  This file expects Tailwind present in the environment. If you preview
 *  outside Tailwind, components will still render but without styles.
 */

// ------------------------------
// Storage shims (DeviceStorage / SecureStorage mock)
// ------------------------------
const NS = "tgcoach";
const deviceStore = {
  get(key, fallback) {
    try { const v = localStorage.getItem(`${NS}:dev:${key}`); return v ? JSON.parse(v) : fallback; } catch (e) { console.debug("deviceStore.get error", e); return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`${NS}:dev:${key}`, JSON.stringify(value)); } catch (e) { console.debug("deviceStore.set error", e); }
  },
};
const secureStore = {
  get(key, fallback) {
    try { const v = sessionStorage.getItem(`${NS}:sec:${key}`); return v ? JSON.parse(v) : fallback; } catch (e) { console.debug("secureStore.get error", e); return fallback; }
  },
  set(key, value) {
    try { sessionStorage.setItem(`${NS}:sec:${key}`, JSON.stringify(value)); } catch (e) { console.debug("secureStore.set error", e); }
  },
};

// ------------------------------
// Fake domain services
// ------------------------------
const demoMeals = [
  { id: "m1", title: "Greek Yogurt Bowl", calories: 320, p: 24, c: 38, f: 8, when: "08:40" },
  { id: "m2", title: "Chicken & Quinoa", calories: 560, p: 46, c: 62, f: 14, when: "13:10" },
  { id: "m3", title: "Salmon & Veggies", calories: 620, p: 44, c: 28, f: 28, when: "19:35" },
];
const demoCalories7d = [
  { d: "Mon", kcal: 1720 },
  { d: "Tue", kcal: 1910 },
  { d: "Wed", kcal: 1640 },
  { d: "Thu", kcal: 2100 },
  { d: "Fri", kcal: 1890 },
  { d: "Sat", kcal: 2010 },
  { d: "Sun", kcal: 1780 },
];
const exercisesLib = [
  { name: "Squats", kcal: 7 },
  { name: "Push-ups", kcal: 6 },
  { name: "Lunges", kcal: 6 },
  { name: "Plank", kcal: 4 },
  { name: "Burpees", kcal: 10 },
  { name: "Row", kcal: 8 },
  { name: "Bike", kcal: 8 },
  { name: "Run", kcal: 11 },
];

function fakeRecommendPlan(goal = "general", days = 3) {
  console.log("[debug] generate plan", { goal, days });
  const pick = (n) => Array.from({ length: n }, () => exercisesLib[(Math.random() * exercisesLib.length) | 0].name);
  return Array.from({ length: days }, (_, i) => ({ day: i + 1, exercises: pick(3) }));
}

// Minimal formatter
const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

// Telegram theme probe
function useTelegramTheme() {
  const [tgTheme, setTgTheme] = useState({ colorScheme: "light" });
  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready?.();
        setTgTheme({ colorScheme: tg.colorScheme || "light" });
        tg.onEvent?.("themeChanged", () => setTgTheme({ colorScheme: tg.colorScheme || "light" }));
        console.log("[debug] Telegram WebApp detected", tg);
      } catch (e) {
        console.log("[debug] Telegram integration error", e);
      }
    }
  }, []);
  return tgTheme;
}

// ------------------------------
// Mini App Phone Mock
// ------------------------------
function PhoneChrome({ children, title = "Coach" }) {
  return (
    <div className="w-[390px] h-[780px] rounded-[36px] border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden relative">
      <div className="h-12 flex items-center justify-between px-4 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300"><Menu size={18} /><span className="text-sm font-medium">{title}</span></div>
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300"><Bell size={18} /><User size={18} /></div>
      </div>
      <div className="absolute inset-0 pt-12 pb-16">{children}</div>
      <div className="absolute bottom-0 inset-x-0 h-16 border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur flex items-center justify-around text-neutral-600 dark:text-neutral-300">
        <div className="flex flex-col items-center text-blue-600"><Activity size={20} /><span className="text-[11px] mt-1">Home</span></div>
        <div className="flex flex-col items-center"><Camera size={20} /><span className="text-[11px] mt-1">Meals</span></div>
        <div className="flex flex-col items-center"><HeartPulse size={20} /><span className="text-[11px] mt-1">Workout</span></div>
        <div className="flex flex-col items-center"><Trophy size={20} /><span className="text-[11px] mt-1">Goals</span></div>
        <div className="flex flex-col items-center"><Settings size={20} /><span className="text-[11px] mt-1">Profile</span></div>
      </div>
    </div>
  );
}

function Pill({ children, icon, tone = "blue" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${tone === "blue" ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50" : "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"}`}>
      {icon}{children}
    </span>
  );
}

function Stat({ label, value, unit, icon }) {
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4 flex items-center gap-3 bg-white dark:bg-neutral-900">
      <div className="p-2 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
        <div className="text-lg font-semibold">{value}{unit && <span className="text-neutral-400 text-sm"> {unit}</span>}</div>
      </div>
      <ChevronRight className="text-neutral-400" size={18} />
    </div>
  );
}

function ProgressBar({ value, max = 100 }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: `${percent}%` }} />
    </div>
  );
}

function DashboardView() {
  const [target, setTarget] = useState(deviceStore.get("kcalTarget", 2000));
  const today = demoMeals.reduce((s, m) => s + m.calories, 0);
  useEffect(() => deviceStore.set("kcalTarget", target), [target]);
  return (
    <div className="p-4 space-y-4">
      <div className="rounded-3xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-100/60 dark:border-blue-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-200 flex items-center gap-2"><Sparkles size={16} /> Today’s Overview</div>
          <Pill icon={<Flame size={14} />} >Streak 5</Pill>
        </div>
        <div className="text-3xl font-bold mb-1">{fmt.format(today)} <span className="text-base font-medium text-neutral-500">/ {fmt.format(target)} kcal</span></div>
        <ProgressBar value={today} max={target} />
        <div className="text-xs mt-2 text-neutral-500">Keep it under your target to stay on track.</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Protein" value={120} unit="g" icon={<BarChart3 size={18} />} />
        <Stat label="Steps" value={8243} unit="" icon={<Activity size={18} />} />
        <Stat label="Sleep" value={7.2} unit="h" icon={<TimerReset size={18} />} />
        <Stat label="HRV" value={62} unit="ms" icon={<HeartPulse size={18} />} />
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900">
        <div className="text-sm font-semibold mb-2">7-day Calories</div>
        <div className="h-28 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demoCalories7d} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="kcalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="d" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="kcal" stroke="#60a5fa" fill="url(#kcalGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Recent Meals</div>
          <button className="text-xs text-blue-600">See all</button>
        </div>
        <div className="space-y-2">
          {demoMeals.map(m => (
            <div key={m.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <div>
                <div className="text-sm font-medium">{m.title}</div>
                <div className="text-xs text-neutral-500">{m.when}</div>
              </div>
              <div className="text-sm text-neutral-700 dark:text-neutral-300">{m.calories} kcal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MealsView() {
  const [meals, setMeals] = useState(deviceStore.get("meals", demoMeals));
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => deviceStore.set("meals", meals), [meals]);

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    console.log("[debug] uploading file", file.name, file.size);
    // Fake vision+nutrition analysis delay
    await new Promise(r => setTimeout(r, 900));
    const added = { id: `m${Date.now()}`, title: "Auto-recognized Meal", calories: 450 + (Math.random() * 120 | 0), p: 28, c: 52, f: 12, when: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) };
    setMeals([added, ...meals]);
    setUploading(false);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/40 p-4 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10"><Camera className="text-blue-600" size={18} /></div>
          <div className="text-sm">Upload a meal photo to auto-detect calories & macros.</div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="px-3 py-2 text-sm rounded-xl bg-blue-600 text-white disabled:opacity-50" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Analyzing…" : "Upload Photo"}</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          <button className="px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10">Enter Manually</button>
        </div>
      </div>
      <div className="space-y-2">
        {meals.map(m => (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900">
            <div>
              <div className="text-sm font-semibold">{m.title}</div>
              <div className="text-xs text-neutral-500">{m.p}P / {m.c}C / {m.f}F • {m.when}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{m.calories} kcal</span>
              <button className="text-xs text-neutral-500">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutView() {
  const [goal, setGoal] = useState(deviceStore.get("goal", "general"));
  const [days, setDays] = useState(deviceStore.get("days", 3));
  const [plan, setPlan] = useState(deviceStore.get("plan", fakeRecommendPlan(goal, days)));

  useEffect(() => { deviceStore.set("goal", goal); deviceStore.set("days", days); }, [goal, days]);
  useEffect(() => { deviceStore.set("plan", plan); }, [plan]);

  const regenerate = () => setPlan(fakeRecommendPlan(goal, days));

  return (
    <div className="p-4 space-y-3">
      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900">
        <div className="text-sm font-semibold mb-2">Plan your week</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { k: "general", label: "General" },
            { k: "strength", label: "Strength" },
            { k: "cardio", label: "Cardio" },
          ].map(opt => (
            <button key={opt.k} onClick={() => setGoal(opt.k)} className={`px-2.5 py-2 rounded-xl border ${goal === opt.k ? "bg-blue-600 text-white border-blue-600" : "border-black/10 dark:border-white/10"}`}>{opt.label}</button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <span>Days:</span>
          {[3, 4, 5, 6].map(n => (
            <button key={n} onClick={() => setDays(n)} className={`px-2.5 py-1.5 rounded-lg border ${days === n ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "border-black/10 dark:border-white/10"}`}>{n}</button>
          ))}
          <button onClick={regenerate} className="ml-auto px-3 py-1.5 rounded-lg bg-blue-600 text-white">Regenerate</button>
        </div>
      </div>

      <div className="space-y-2">
        {plan.map(d => (
          <div key={d.day} className="p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900">
            <div className="text-sm font-semibold mb-1">Day {d.day}</div>
            <div className="flex flex-wrap gap-2">
              {d.exercises.map((e, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">{e}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsView() {
  const [rank, setRank] = useState(deviceStore.get("rank", 5));
  const [points, setPoints] = useState(deviceStore.get("points", 1240));
  const board = useMemo(() => ([
    { name: "Alex", score: 1740 },
    { name: "Sam", score: 1660 },
    { name: "Mia", score: 1480 },
    { name: "You", score: points },
    { name: "Leo", score: 1170 },
  ].sort((a, b) => b.score - a.score)), [points]);

  useEffect(() => {
    const newRank = board.findIndex(b => b.name === "You") + 1;
    setRank(newRank);
    deviceStore.set("rank", newRank);
    deviceStore.set("points", points);
  }, [board, points]);

  return (
    <div className="p-4 space-y-3">
      <div className="rounded-3xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100/60 dark:border-emerald-900/40">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-emerald-700 dark:text-emerald-200 flex items-center gap-2"><Medal size={16}/> Leaderboard</div>
          <Pill icon={<Trophy size={14} />} tone="green">Rank #{rank}</Pill>
        </div>
        <div className="mt-3 text-3xl font-bold">{fmt.format(points)} <span className="text-base font-medium text-neutral-500">pts</span></div>
        <div className="text-xs mt-1 text-neutral-500">Earn points by meeting daily goals.</div>
        <div className="mt-3 flex items-center gap-2">
          <button className="px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white" onClick={() => setPoints(p => p + 25)}>+25 Today</button>
          <button className="px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10" onClick={() => setPoints(p => Math.max(0, p - 25))}>Undo</button>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900">
        {board.map((b, i) => (
          <div key={b.name} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 border-b last:border-0 border-black/5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 grid place-items-center rounded-full ${b.name === "You" ? "bg-emerald-600 text-white" : "bg-neutral-100 dark:bg-neutral-800"}`}>{i + 1}</div>
              <div className="text-sm font-medium">{b.name}</div>
            </div>
            <div className="text-sm">{fmt.format(b.score)} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView() {
  const [name, setName] = useState(deviceStore.get("name", "You"));
  const [kcal, setKcal] = useState(deviceStore.get("kcalTarget", 2000));
  const [reminders, setReminders] = useState(deviceStore.get("reminders", true));
  useEffect(() => { deviceStore.set("name", name); deviceStore.set("kcalTarget", kcal); deviceStore.set("reminders", reminders); }, [name, kcal, reminders]);

  return (
    <div className="p-4 space-y-3">
      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
        <div className="text-sm font-semibold mb-2">Profile</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 grid place-items-center text-neutral-600">{name?.[0] || "U"}</div>
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent" placeholder="Display name"/>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white dark:bg-neutral-900 space-y-3">
        <div>
          <div className="text-xs text-neutral-500 mb-1">Daily calories target</div>
          <input type="number" value={kcal} onChange={(e) => setKcal(parseInt(e.target.value || "0", 10))} className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Reminders</div>
            <div className="text-xs text-neutral-500">Get notified about workouts & meals</div>
          </div>
          <button onClick={() => setReminders(r => !r)} className={`w-11 h-6 rounded-full relative transition ${reminders ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-700"}`}>
            <span className={`absolute top-0.5 ${reminders ? "left-6" : "left-0.5"} w-5 h-5 rounded-full bg-white transition`}></span>
          </button>
        </div>
      </div>

      <div className="text-xs text-neutral-500">Data stored on device using secure & device storage shims (mock). Connectors (calendar, wearables) can be added later.</div>
    </div>
  );
}

function MiniApp() {
  const [tab, setTab] = useState(deviceStore.get("tab", "home"));
  useEffect(() => deviceStore.set("tab", tab), [tab]);

  return (
    <PhoneChrome>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto custom-scroll px-0">
          {/* Tabs header */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-black/5 dark:border-white/10">
            <div className="grid grid-cols-5 text-xs">
              {[
                { k: "home", label: "Home" },
                { k: "meals", label: "Meals" },
                { k: "workout", label: "Workout" },
                { k: "goals", label: "Goals" },
                { k: "profile", label: "Profile" },
              ].map(t => (
                <button key={t.k} onClick={() => setTab(t.k)} className={`py-3 ${tab === t.k ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-500"}`}>{t.label}</button>
              ))}
            </div>
          </div>
          {/* Views */}
          {tab === "home" && <DashboardView />}
          {tab === "meals" && <MealsView />}
          {tab === "workout" && <WorkoutView />}
          {tab === "goals" && <GoalsView />}
          {tab === "profile" && <ProfileView />}
        </div>
      </div>
    </PhoneChrome>
  );
}

// ------------------------------
// Landing Page (CalAI-inspired)
// ------------------------------
function LandingPage() {
  return (
    <div className="w-full min-h-[720px] bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.12),transparent_45%)]"/>
        <div className="container mx-auto px-6 pt-16 pb-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-sm mb-4">
                <Sparkles size={16}/> Agentic Fitness Coach • Telegram Mini App
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">Your AI fitness, nutrition & lifestyle coach — right in Telegram.</h1>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Plan workouts, log meals with photos, sync wearables and climb leaderboards. All in a sleek Mini App experience.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#open" className="px-5 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium inline-flex items-center gap-2">
                  <Apple size={18}/> Open in Telegram
                </a>
                <a href="#demo" className="px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 font-medium">View Demo</a>
                <div className="flex items-center gap-1 text-amber-500 ml-2">
                  <Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star size={16}/>
                  <span className="text-sm text-neutral-500 ml-1">Loved by early users</span>
                </div>
              </div>
            </div>
            <div className="flex-1" id="demo">
              <div className="mx-auto w-[390px]">
                <MiniApp/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Camera/>, title: "Photo → Macros", text: "Snap a meal, get calories & macros instantly." },
            { icon: <HeartPulse/>, title: "Smart Workouts", text: "Adaptive plans based on your goals & schedule." },
            { icon: <Trophy/>, title: "Goals & Leaderboards", text: "Stay motivated with streaks and friendly competition." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-black/5 dark:border-white/10 p-6 bg-white dark:bg-neutral-900">
              <div className="w-10 h-10 rounded-xl grid place-items-center bg-neutral-100 dark:bg-neutral-800 mb-3 text-neutral-700 dark:text-neutral-200">{f.icon}</div>
              <div className="text-lg font-semibold">{f.title}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="container mx-auto px-6 pb-12">
        <div className="rounded-3xl p-6 border border-black/5 dark:border-white/10 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-2xl font-bold">Built with agentic AI</div>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">GPT‑5 reasoning + function tools orchestrate nutrition, workouts and integrations.</p>
              <ul className="mt-3 text-sm space-y-1">
                <li className="flex items-center gap-2"><Check className="text-emerald-500" size={16}/> Mini App first UX</li>
                <li className="flex items-center gap-2"><Check className="text-emerald-500" size={16}/> Wearables & calendar ready</li>
                <li className="flex items-center gap-2"><Check className="text-emerald-500" size={16}/> Privacy by design</li>
              </ul>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4">
                <div className="text-sm font-semibold mb-2">Calories trend</div>
                <div className="h-28 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoCalories7d} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
                      <Line type="monotone" dataKey="kcal" stroke="#111827" strokeWidth={2} dot={false} />
                      <XAxis dataKey="d" hide />
                      <YAxis hide />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4">
                <div className="text-sm font-semibold mb-2">Leaderboard</div>
                <div className="space-y-2 text-sm">
                  {[{name:"Alex",score:1740},{name:"Sam",score:1660},{name:"You",score:1240}].map((r,i)=> (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Award size={16}/> {r.name}</div>
                      <div>{r.score} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-16" id="open">
        <div className="rounded-3xl border border-black/5 dark:border-white/10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">Ready to try it?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">Open the Telegram Mini App and start your streak today.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium" href="#">Open Mini App</a>
            <a className="px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 font-medium" href="#">Contact</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ------------------------------
// Page wrapper (side-by-side landing + phone mock)
// ------------------------------
export default function TelegramFitnessMiniAppMock() {
  const { colorScheme } = useTelegramTheme();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorScheme === "dark");
  }, [colorScheme]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white grid place-items-center text-white dark:text-neutral-900 font-bold">AI</div>
            <span className="font-semibold">Coach</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="#demo">Demo</a>
            <a href="#features">Features</a>
            <a href="#open">Open</a>
          </nav>
          <a href="#" className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-sm">Get Started</a>
        </header>

        <main className="mt-6 grid lg:grid-cols-2 gap-10 items-start">
          <LandingPage/>
          <div className="hidden lg:block sticky top-10">
            <MiniApp/>
          </div>
        </main>

        <footer className="mt-10 py-8 text-sm text-neutral-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Coach</span>
          <div className="flex items-center gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </footer>
      </div>

      {/* Global styles for mock scrollbars */}
      <style>{`
        .custom-scroll::-webkit-scrollbar{width:6px;height:6px}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:999px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
      `}</style>
    </div>
  );
}
