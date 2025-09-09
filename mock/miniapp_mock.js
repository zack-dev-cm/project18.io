import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18";
import { Activity, Apple, Award, BarChart3, Bell, Camera, Check, ChevronRight, Flame, HeartPulse, Medal, Menu, Settings, Sparkles, Star, TimerReset, Trophy, Upload, User } from "https://esm.sh/lucide-react@0.378.0";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid } from "https://esm.sh/recharts@2";
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
    try {
      const v = localStorage.getItem(`${NS}:dev:${key}`);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      console.debug("deviceStore.get error", e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`${NS}:dev:${key}`, JSON.stringify(value));
    } catch (e) {
      console.debug("deviceStore.set error", e);
    }
  }
};
const secureStore = {
  get(key, fallback) {
    try {
      const v = sessionStorage.getItem(`${NS}:sec:${key}`);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      console.debug("secureStore.get error", e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(`${NS}:sec:${key}`, JSON.stringify(value));
    } catch (e) {
      console.debug("secureStore.set error", e);
    }
  }
};

// ------------------------------
// Fake domain services
// ------------------------------
const demoMeals = [{
  id: "m1",
  title: "Greek Yogurt Bowl",
  calories: 320,
  p: 24,
  c: 38,
  f: 8,
  when: "08:40"
}, {
  id: "m2",
  title: "Chicken & Quinoa",
  calories: 560,
  p: 46,
  c: 62,
  f: 14,
  when: "13:10"
}, {
  id: "m3",
  title: "Salmon & Veggies",
  calories: 620,
  p: 44,
  c: 28,
  f: 28,
  when: "19:35"
}];
const demoCalories7d = [{
  d: "Mon",
  kcal: 1720
}, {
  d: "Tue",
  kcal: 1910
}, {
  d: "Wed",
  kcal: 1640
}, {
  d: "Thu",
  kcal: 2100
}, {
  d: "Fri",
  kcal: 1890
}, {
  d: "Sat",
  kcal: 2010
}, {
  d: "Sun",
  kcal: 1780
}];
const exercisesLib = [{
  name: "Squats",
  kcal: 7
}, {
  name: "Push-ups",
  kcal: 6
}, {
  name: "Lunges",
  kcal: 6
}, {
  name: "Plank",
  kcal: 4
}, {
  name: "Burpees",
  kcal: 10
}, {
  name: "Row",
  kcal: 8
}, {
  name: "Bike",
  kcal: 8
}, {
  name: "Run",
  kcal: 11
}];
function fakeRecommendPlan(goal = "general", days = 3) {
  console.log("[debug] generate plan", {
    goal,
    days
  });
  const pick = n => Array.from({
    length: n
  }, () => exercisesLib[Math.random() * exercisesLib.length | 0].name);
  return Array.from({
    length: days
  }, (_, i) => ({
    day: i + 1,
    exercises: pick(3)
  }));
}

// Minimal formatter
const fmt = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0
});

// Telegram theme probe
function useTelegramTheme() {
  const [tgTheme, setTgTheme] = useState({
    colorScheme: "light"
  });
  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready?.();
        setTgTheme({
          colorScheme: tg.colorScheme || "light"
        });
        tg.onEvent?.("themeChanged", () => setTgTheme({
          colorScheme: tg.colorScheme || "light"
        }));
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
function PhoneChrome({
  children,
  title = "Coach"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "w-[390px] h-[780px] rounded-[36px] border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-12 flex items-center justify-between px-4 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-neutral-600 dark:text-neutral-300"
  }, /*#__PURE__*/React.createElement(Menu, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-neutral-600 dark:text-neutral-300"
  }, /*#__PURE__*/React.createElement(Bell, {
    size: 18
  }), /*#__PURE__*/React.createElement(User, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 pt-12 pb-16"
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 inset-x-0 h-16 border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur flex items-center justify-around text-neutral-600 dark:text-neutral-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center text-blue-600"
  }, /*#__PURE__*/React.createElement(Activity, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] mt-1"
  }, "Home")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(Camera, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] mt-1"
  }, "Meals")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(HeartPulse, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] mt-1"
  }, "Workout")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(Trophy, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] mt-1"
  }, "Goals")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(Settings, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] mt-1"
  }, "Profile"))));
}
function Pill({
  children,
  icon,
  tone = "blue"
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${tone === "blue" ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50" : "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"}`
  }, icon, children);
}
function Stat({
  label,
  value,
  unit,
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-4 flex items-center gap-3 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500 dark:text-neutral-400"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold"
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    className: "text-neutral-400 text-sm"
  }, " ", unit))), /*#__PURE__*/React.createElement(ChevronRight, {
    className: "text-neutral-400",
    size: 18
  }));
}
function ProgressBar({
  value,
  max = 100
}) {
  const percent = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-blue-500 to-sky-400",
    style: {
      width: `${percent}%`
    }
  }));
}
function DashboardView() {
  const [target, setTarget] = useState(deviceStore.get("kcalTarget", 2000));
  const today = demoMeals.reduce((s, m) => s + m.calories, 0);
  useEffect(() => deviceStore.set("kcalTarget", target), [target]);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-100/60 dark:border-blue-900/40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium text-blue-700 dark:text-blue-200 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 16
  }), " Today\u2019s Overview"), /*#__PURE__*/React.createElement(Pill, {
    icon: /*#__PURE__*/React.createElement(Flame, {
      size: 14
    })
  }, "Streak 5")), /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold mb-1"
  }, fmt.format(today), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-base font-medium text-neutral-500"
  }, "/ ", fmt.format(target), " kcal")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: today,
    max: target
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-2 text-neutral-500"
  }, "Keep it under your target to stay on track.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Protein",
    value: 120,
    unit: "g",
    icon: /*#__PURE__*/React.createElement(BarChart3, {
      size: 18
    })
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Steps",
    value: 8243,
    unit: "",
    icon: /*#__PURE__*/React.createElement(Activity, {
      size: 18
    })
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Sleep",
    value: 7.2,
    unit: "h",
    icon: /*#__PURE__*/React.createElement(TimerReset, {
      size: 18
    })
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "HRV",
    value: 62,
    unit: "ms",
    icon: /*#__PURE__*/React.createElement(HeartPulse, {
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, "7-day Calories"), /*#__PURE__*/React.createElement("div", {
    className: "h-28 -mx-2"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: demoCalories7d,
    margin: {
      top: 6,
      right: 8,
      left: 8,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "kcalGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#60a5fa",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#60a5fa",
    stopOpacity: 0
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    strokeOpacity: 0.1
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "d",
    tick: {
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    hide: true
  }), /*#__PURE__*/React.createElement(Tooltip, {
    contentStyle: {
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "kcal",
    stroke: "#60a5fa",
    fill: "url(#kcalGrad)",
    strokeWidth: 2
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold"
  }, "Recent Meals"), /*#__PURE__*/React.createElement("button", {
    className: "text-xs text-blue-600"
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, demoMeals.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    className: "flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, m.title), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500"
  }, m.when)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-neutral-700 dark:text-neutral-300"
  }, m.calories, " kcal"))))));
}
function MealsView() {
  const [meals, setMeals] = useState(deviceStore.get("meals", demoMeals));
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => deviceStore.set("meals", meals), [meals]);
  const onUpload = async file => {
    if (!file) return;
    setUploading(true);
    console.log("[debug] uploading file", file.name, file.size);
    // Fake vision+nutrition analysis delay
    await new Promise(r => setTimeout(r, 900));
    const added = {
      id: `m${Date.now()}`,
      title: "Auto-recognized Meal",
      calories: 450 + (Math.random() * 120 | 0),
      p: 28,
      c: 52,
      f: 12,
      when: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMeals([added, ...meals]);
    setUploading(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/40 p-4 bg-blue-50/50 dark:bg-blue-950/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10"
  }, /*#__PURE__*/React.createElement(Camera, {
    className: "text-blue-600",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, "Upload a meal photo to auto-detect calories & macros.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "px-3 py-2 text-sm rounded-xl bg-blue-600 text-white disabled:opacity-50",
    onClick: () => fileRef.current?.click(),
    disabled: uploading
  }, uploading ? "Analyzing…" : "Upload Photo"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: e => onUpload(e.target.files?.[0])
  }), /*#__PURE__*/React.createElement("button", {
    className: "px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10"
  }, "Enter Manually"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, meals.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    className: "flex items-center justify-between p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold"
  }, m.title), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500"
  }, m.p, "P / ", m.c, "C / ", m.f, "F \u2022 ", m.when)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, m.calories, " kcal"), /*#__PURE__*/React.createElement("button", {
    className: "text-xs text-neutral-500"
  }, "Edit"))))));
}
function WorkoutView() {
  const [goal, setGoal] = useState(deviceStore.get("goal", "general"));
  const [days, setDays] = useState(deviceStore.get("days", 3));
  const [plan, setPlan] = useState(deviceStore.get("plan", fakeRecommendPlan(goal, days)));
  useEffect(() => {
    deviceStore.set("goal", goal);
    deviceStore.set("days", days);
  }, [goal, days]);
  useEffect(() => {
    deviceStore.set("plan", plan);
  }, [plan]);
  const regenerate = () => setPlan(fakeRecommendPlan(goal, days));
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, "Plan your week"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 text-xs"
  }, [{
    k: "general",
    label: "General"
  }, {
    k: "strength",
    label: "Strength"
  }, {
    k: "cardio",
    label: "Cardio"
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.k,
    onClick: () => setGoal(opt.k),
    className: `px-2.5 py-2 rounded-xl border ${goal === opt.k ? "bg-blue-600 text-white border-blue-600" : "border-black/10 dark:border-white/10"}`
  }, opt.label))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("span", null, "Days:"), [3, 4, 5, 6].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => setDays(n),
    className: `px-2.5 py-1.5 rounded-lg border ${days === n ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "border-black/10 dark:border-white/10"}`
  }, n)), /*#__PURE__*/React.createElement("button", {
    onClick: regenerate,
    className: "ml-auto px-3 py-1.5 rounded-lg bg-blue-600 text-white"
  }, "Regenerate"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, plan.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.day,
    className: "p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-1"
  }, "Day ", d.day), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, d.exercises.map((e, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800"
  }, e)))))));
}
function GoalsView() {
  const [rank, setRank] = useState(deviceStore.get("rank", 5));
  const [points, setPoints] = useState(deviceStore.get("points", 1240));
  const board = useMemo(() => [{
    name: "Alex",
    score: 1740
  }, {
    name: "Sam",
    score: 1660
  }, {
    name: "Mia",
    score: 1480
  }, {
    name: "You",
    score: points
  }, {
    name: "Leo",
    score: 1170
  }].sort((a, b) => b.score - a.score), [points]);
  useEffect(() => {
    const newRank = board.findIndex(b => b.name === "You") + 1;
    setRank(newRank);
    deviceStore.set("rank", newRank);
    deviceStore.set("points", points);
  }, [board, points]);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100/60 dark:border-emerald-900/40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium text-emerald-700 dark:text-emerald-200 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Medal, {
    size: 16
  }), " Leaderboard"), /*#__PURE__*/React.createElement(Pill, {
    icon: /*#__PURE__*/React.createElement(Trophy, {
      size: 14
    }),
    tone: "green"
  }, "Rank #", rank)), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-3xl font-bold"
  }, fmt.format(points), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-base font-medium text-neutral-500"
  }, "pts")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-1 text-neutral-500"
  }, "Earn points by meeting daily goals."), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white",
    onClick: () => setPoints(p => p + 25)
  }, "+25 Today"), /*#__PURE__*/React.createElement("button", {
    className: "px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10",
    onClick: () => setPoints(p => Math.max(0, p - 25))
  }, "Undo"))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-3 bg-white dark:bg-neutral-900"
  }, board.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.name,
    className: "flex items-center justify-between py-2 first:pt-0 last:pb-0 border-b last:border-0 border-black/5 dark:border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-8 h-8 grid place-items-center rounded-full ${b.name === "You" ? "bg-emerald-600 text-white" : "bg-neutral-100 dark:bg-neutral-800"}`
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, b.name)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, fmt.format(b.score), " pts")))));
}
function ProfileView() {
  const [name, setName] = useState(deviceStore.get("name", "You"));
  const [kcal, setKcal] = useState(deviceStore.get("kcalTarget", 2000));
  const [reminders, setReminders] = useState(deviceStore.get("reminders", true));
  useEffect(() => {
    deviceStore.set("name", name);
    deviceStore.set("kcalTarget", kcal);
    deviceStore.set("reminders", reminders);
  }, [name, kcal, reminders]);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 grid place-items-center text-neutral-600"
  }, name?.[0] || "U"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    className: "flex-1 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent",
    placeholder: "Display name"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white dark:bg-neutral-900 space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500 mb-1"
  }, "Daily calories target"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: kcal,
    onChange: e => setKcal(parseInt(e.target.value || "0", 10)),
    className: "w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, "Reminders"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500"
  }, "Get notified about workouts & meals")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setReminders(r => !r),
    className: `w-11 h-6 rounded-full relative transition ${reminders ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-700"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `absolute top-0.5 ${reminders ? "left-6" : "left-0.5"} w-5 h-5 rounded-full bg-white transition`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-neutral-500"
  }, "Data stored on device using secure & device storage shims (mock). Connectors (calendar, wearables) can be added later."));
}
function MiniApp() {
  const [tab, setTab] = useState(deviceStore.get("tab", "home"));
  useEffect(() => deviceStore.set("tab", tab), [tab]);
  return /*#__PURE__*/React.createElement(PhoneChrome, null, /*#__PURE__*/React.createElement("div", {
    className: "h-full flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto custom-scroll px-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-black/5 dark:border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 text-xs"
  }, [{
    k: "home",
    label: "Home"
  }, {
    k: "meals",
    label: "Meals"
  }, {
    k: "workout",
    label: "Workout"
  }, {
    k: "goals",
    label: "Goals"
  }, {
    k: "profile",
    label: "Profile"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    onClick: () => setTab(t.k),
    className: `py-3 ${tab === t.k ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-500"}`
  }, t.label)))), tab === "home" && /*#__PURE__*/React.createElement(DashboardView, null), tab === "meals" && /*#__PURE__*/React.createElement(MealsView, null), tab === "workout" && /*#__PURE__*/React.createElement(WorkoutView, null), tab === "goals" && /*#__PURE__*/React.createElement(GoalsView, null), tab === "profile" && /*#__PURE__*/React.createElement(ProfileView, null))));
}

// ------------------------------
// Landing Page (CalAI-inspired)
// ------------------------------
function LandingPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full min-h-[720px] bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50"
  }, /*#__PURE__*/React.createElement("section", {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.12),transparent_45%)]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-6 pt-16 pb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row items-center gap-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-sm mb-4"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 16
  }), " Agentic Fitness Coach \u2022 Telegram Mini App"), /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
  }, "Your AI fitness, nutrition & lifestyle coach \u2014 right in Telegram."), /*#__PURE__*/React.createElement("p", {
    className: "mt-4 text-lg text-neutral-600 dark:text-neutral-300"
  }, "Plan workouts, log meals with photos, sync wearables and climb leaderboards. All in a sleek Mini App experience."), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#open",
    className: "px-5 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium inline-flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Apple, {
    size: 18
  }), " Open in Telegram"), /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    className: "px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 font-medium"
  }, "View Demo"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-amber-500 ml-2"
  }, /*#__PURE__*/React.createElement(Star, {
    fill: "currentColor",
    size: 16
  }), /*#__PURE__*/React.createElement(Star, {
    fill: "currentColor",
    size: 16
  }), /*#__PURE__*/React.createElement(Star, {
    fill: "currentColor",
    size: 16
  }), /*#__PURE__*/React.createElement(Star, {
    fill: "currentColor",
    size: 16
  }), /*#__PURE__*/React.createElement(Star, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-neutral-500 ml-1"
  }, "Loved by early users")))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1",
    id: "demo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-[390px]"
  }, /*#__PURE__*/React.createElement(MiniApp, null)))))), /*#__PURE__*/React.createElement("section", {
    className: "container mx-auto px-6 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-6"
  }, [{
    icon: /*#__PURE__*/React.createElement(Camera, null),
    title: "Photo → Macros",
    text: "Snap a meal, get calories & macros instantly."
  }, {
    icon: /*#__PURE__*/React.createElement(HeartPulse, null),
    title: "Smart Workouts",
    text: "Adaptive plans based on your goals & schedule."
  }, {
    icon: /*#__PURE__*/React.createElement(Trophy, null),
    title: "Goals & Leaderboards",
    text: "Stay motivated with streaks and friendly competition."
  }].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-6 bg-white dark:bg-neutral-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl grid place-items-center bg-neutral-100 dark:bg-neutral-800 mb-3 text-neutral-700 dark:text-neutral-200"
  }, f.icon), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold"
  }, f.title), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-neutral-600 dark:text-neutral-400 mt-1"
  }, f.text))))), /*#__PURE__*/React.createElement("section", {
    className: "container mx-auto px-6 pb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl p-6 border border-black/5 dark:border-white/10 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, "Built with agentic AI"), /*#__PURE__*/React.createElement("p", {
    className: "text-neutral-600 dark:text-neutral-400 mt-1"
  }, "GPT\u20115 reasoning + function tools orchestrate nutrition, workouts and integrations."), /*#__PURE__*/React.createElement("ul", {
    className: "mt-3 text-sm space-y-1"
  }, /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Check, {
    className: "text-emerald-500",
    size: 16
  }), " Mini App first UX"), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Check, {
    className: "text-emerald-500",
    size: 16
  }), " Wearables & calendar ready"), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Check, {
    className: "text-emerald-500",
    size: 16
  }), " Privacy by design"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 grid grid-cols-2 gap-3 w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, "Calories trend"), /*#__PURE__*/React.createElement("div", {
    className: "h-28 -mx-2"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: demoCalories7d,
    margin: {
      top: 6,
      right: 8,
      left: 8,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "kcal",
    stroke: "#111827",
    strokeWidth: 2,
    dot: false
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "d",
    hide: true
  }), /*#__PURE__*/React.createElement(YAxis, {
    hide: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-black/5 dark:border-white/10 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, "Leaderboard"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-sm"
  }, [{
    name: "Alex",
    score: 1740
  }, {
    name: "Sam",
    score: 1660
  }, {
    name: "You",
    score: 1240
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 16
  }), " ", r.name), /*#__PURE__*/React.createElement("div", null, r.score, " pts"))))))))), /*#__PURE__*/React.createElement("section", {
    className: "container mx-auto px-6 pb-16",
    id: "open"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl border border-black/5 dark:border-white/10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 text-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl md:text-3xl font-extrabold"
  }, "Ready to try it?"), /*#__PURE__*/React.createElement("p", {
    className: "text-neutral-600 dark:text-neutral-300 mt-2"
  }, "Open the Telegram Mini App and start your streak today."), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex items-center justify-center gap-3"
  }, /*#__PURE__*/React.createElement("a", {
    className: "px-5 py-3 rounded-xl bg-blue-600 text-white font-medium",
    href: "#"
  }, "Open Mini App"), /*#__PURE__*/React.createElement("a", {
    className: "px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 font-medium",
    href: "#"
  }, "Contact")))));
}

// ------------------------------
// Page wrapper (side-by-side landing + phone mock)
// ------------------------------
export default function TelegramFitnessMiniAppMock() {
  const {
    colorScheme
  } = useTelegramTheme();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorScheme === "dark");
  }, [colorScheme]);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen w-full bg-white dark:bg-neutral-950"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-6 py-10"
  }, /*#__PURE__*/React.createElement("header", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white grid place-items-center text-white dark:text-neutral-900 font-bold"
  }, "AI"), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "Coach")), /*#__PURE__*/React.createElement("nav", {
    className: "hidden md:flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#demo"
  }, "Demo"), /*#__PURE__*/React.createElement("a", {
    href: "#features"
  }, "Features"), /*#__PURE__*/React.createElement("a", {
    href: "#open"
  }, "Open")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-sm"
  }, "Get Started")), /*#__PURE__*/React.createElement("main", {
    className: "mt-6 grid lg:grid-cols-2 gap-10 items-start"
  }, /*#__PURE__*/React.createElement(LandingPage, null), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block sticky top-10"
  }, /*#__PURE__*/React.createElement(MiniApp, null))), /*#__PURE__*/React.createElement("footer", {
    className: "mt-10 py-8 text-sm text-neutral-500 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " Coach"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms")))), /*#__PURE__*/React.createElement("style", null, `
        .custom-scroll::-webkit-scrollbar{width:6px;height:6px}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:999px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
      `));
}
