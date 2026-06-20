// Deterministic mock data generator for OctaForce 360 demo

let seed = 42;
const rand = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const firstNames = ["Aarav", "Ananya", "Rohan", "Priya", "Vikram", "Sneha", "Arjun", "Diya", "Kabir", "Isha", "Aditya", "Riya", "Karan", "Meera", "Nikhil", "Pooja", "Rahul", "Sara", "Tanvi", "Yash", "Neha", "Manish", "Kavya", "Dev", "Anjali", "Siddharth", "Tara", "Vivek", "Aisha", "Raj"];
const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Singh", "Gupta", "Iyer", "Mehta", "Nair", "Joshi", "Kapoor", "Khanna", "Malhotra", "Rao", "Bhatia", "Chopra", "Desai", "Pillai", "Saxena", "Trivedi"];
const departments = ["Sales", "HR", "Engineering", "Operations", "Field Force", "Finance", "Marketing", "Support"];
const designations = ["Manager", "Senior Executive", "Executive", "Team Lead", "Field Agent", "Analyst", "Coordinator", "Specialist"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
const companies = ["Tata Steel", "Reliance Retail", "Infosys", "Wipro", "HDFC Bank", "Airtel", "ITC Foods", "Mahindra Logistics", "Bajaj Finance", "Asian Paints", "Maruti Suzuki", "Larsen & Toubro", "Adani Ports", "Hindustan Unilever", "Britannia"];
const sources = ["Website", "Facebook", "Instagram", "Google Ads", "WhatsApp", "Referral", "Manual Entry"];
const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;
const statuses = ["Online", "Working", "Traveling", "Idle", "Offline"] as const;

export type Employee = ReturnType<typeof makeEmployee>;
function makeEmployee(i: number) {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const dept = pick(departments);
  return {
    id: `EMP${(1000 + i).toString()}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@octaforce.in`,
    phone: `+91 ${int(70000, 99999)} ${int(10000, 99999)}`,
    department: dept,
    designation: pick(designations),
    location: pick(cities),
    avatar: `${first[0]}${last[0]}`,
    salary: int(35, 180) * 1000,
    status: pick(["Active", "Active", "Active", "Active", "On Leave", "Inactive"]),
    joinedAt: `${int(2018, 2024)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    presentToday: rand() > 0.18,
    isField: dept === "Field Force" || dept === "Sales",
  };
}

export type Lead = ReturnType<typeof makeLead>;
function makeLead(i: number, emps: Employee[]) {
  const stage = pick(stages as unknown as string[]) as typeof stages[number];
  return {
    id: `LD${(20000 + i).toString()}`,
    name: pick(firstNames) + " " + pick(lastNames),
    company: pick(companies),
    source: pick(sources),
    stage,
    value: int(25, 800) * 1000,
    owner: pick(emps.filter((e) => e.department === "Sales")).name,
    city: pick(cities),
    score: int(20, 98),
    createdAt: `2025-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
  };
}

export type Customer = ReturnType<typeof makeCustomer>;
function makeCustomer(i: number) {
  return {
    id: `CUS${(5000 + i).toString()}`,
    company: pick(companies) + " " + pick(["Pvt Ltd", "Industries", "& Co", "Group", "Solutions"]),
    contact: pick(firstNames) + " " + pick(lastNames),
    city: pick(cities),
    industry: pick(["Retail", "Manufacturing", "IT", "BFSI", "FMCG", "Logistics"]),
    revenue: int(200, 9500) * 1000,
    orders: int(2, 48),
    lastVisit: `2025-${String(int(9, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
  };
}

export type Invoice = ReturnType<typeof makeInvoice>;
function makeInvoice(i: number, customers: Customer[]) {
  const status = pick(["Paid", "Paid", "Paid", "Pending", "Pending", "Overdue", "Cancelled"]);
  const sub = int(15, 450) * 1000;
  return {
    id: `INV-2025-${(1000 + i).toString()}`,
    customer: pick(customers).company,
    issuedAt: `2025-${String(int(6, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    dueAt: `2025-${String(int(10, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    subtotal: sub,
    gst: Math.round(sub * 0.18),
    total: Math.round(sub * 1.18),
    status,
  };
}

export type Visit = ReturnType<typeof makeVisit>;
function makeVisit(i: number, emps: Employee[], customers: Customer[]) {
  return {
    id: `VST${(7000 + i)}`,
    agent: pick(emps.filter((e) => e.isField)).name,
    customer: pick(customers).company,
    checkIn: `${int(8, 11)}:${String(int(0, 59)).padStart(2, "0")}`,
    checkOut: `${int(12, 18)}:${String(int(0, 59)).padStart(2, "0")}`,
    duration: `${int(20, 180)}m`,
    distance: `${int(2, 48)} km`,
    status: pick(["Completed", "Completed", "Ongoing", "Cancelled"]),
    notes: pick(["Discussed renewal", "Demo delivered", "Order placed", "Follow up next week", "Negotiation in progress"]),
  };
}

const employees = Array.from({ length: 100 }, (_, i) => makeEmployee(i));
const fieldAgents = employees.filter((e) => e.isField).slice(0, 50);
const customers = Array.from({ length: 60 }, (_, i) => makeCustomer(i));
const leads = Array.from({ length: 120 }, (_, i) => makeLead(i, employees));
const invoices = Array.from({ length: 80 }, (_, i) => makeInvoice(i, customers));
const visits = Array.from({ length: 60 }, (_, i) => makeVisit(i, employees, customers));

// Live field positions (mock map coords on a 0-100 grid)
const liveAgents = fieldAgents.slice(0, 18).map((e, i) => ({
  ...e,
  x: 8 + ((i * 37) % 84),
  y: 10 + ((i * 53) % 75),
  liveStatus: pick(statuses as unknown as string[]) as typeof statuses[number],
  lastSeen: `${int(0, 12)} min ago`,
  battery: int(15, 98),
}));

export const mock = {
  employees,
  fieldAgents,
  customers,
  leads,
  invoices,
  visits,
  liveAgents,
  // KPIs
  totalEmployees: employees.length,
  activeEmployees: employees.filter((e) => e.status === "Active").length,
  presentToday: employees.filter((e) => e.presentToday).length,
  absentToday: employees.filter((e) => !e.presentToday).length,
  totalLeads: leads.length,
  openLeads: leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length,
  wonLeads: leads.filter((l) => l.stage === "Won").length,
  lostLeads: leads.filter((l) => l.stage === "Lost").length,
  monthlyRevenue: invoices.filter((i) => i.status === "Paid").reduce((a, b) => a + b.total, 0),
  pendingInvoices: invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").length,
  activeFieldAgents: fieldAgents.length,
  gpsActiveUsers: liveAgents.filter((a) => a.liveStatus !== "Offline").length,
};

export const revenueSeries = [
  { m: "Apr", revenue: 1240000, target: 1100000 },
  { m: "May", revenue: 1480000, target: 1300000 },
  { m: "Jun", revenue: 1320000, target: 1400000 },
  { m: "Jul", revenue: 1690000, target: 1500000 },
  { m: "Aug", revenue: 1820000, target: 1600000 },
  { m: "Sep", revenue: 2010000, target: 1750000 },
  { m: "Oct", revenue: 2240000, target: 1900000 },
  { m: "Nov", revenue: 2480000, target: 2100000 },
  { m: "Dec", revenue: 2710000, target: 2300000 },
];

export const attendanceSeries = Array.from({ length: 14 }, (_, i) => ({
  d: `${i + 1}`,
  present: int(72, 96),
  absent: int(4, 18),
  late: int(2, 9),
}));

export const funnel = [
  { stage: "Lead", count: 320, fill: "var(--color-chart-1)" },
  { stage: "Qualified", count: 184, fill: "var(--color-chart-2)" },
  { stage: "Proposal", count: 96, fill: "var(--color-chart-3)" },
  { stage: "Negotiation", count: 52, fill: "var(--color-chart-4)" },
  { stage: "Won", count: 28, fill: "var(--color-chart-5)" },
];

export const activityFeed = [
  { who: "Aarav Sharma", what: "checked in at HDFC Bank, Andheri branch", when: "2 min ago", type: "visit" },
  { who: "Priya Verma", what: "marked lead Reliance Retail as Won — ₹4.8L", when: "12 min ago", type: "win" },
  { who: "Rahul Patel", what: "GPS signal lost — last seen Mumbai BKC", when: "18 min ago", type: "alert" },
  { who: "Sneha Reddy", what: "submitted expense claim — Travel ₹2,340", when: "31 min ago", type: "expense" },
  { who: "Vikram Singh", what: "raised invoice INV-2025-1042 — ₹1.2L", when: "44 min ago", type: "invoice" },
  { who: "Diya Iyer", what: "applied for Casual Leave (2 days)", when: "1 hr ago", type: "leave" },
  { who: "Arjun Mehta", what: "completed 6 customer visits today", when: "2 hr ago", type: "visit" },
  { who: "Kavya Nair", what: "AI flagged 3 leads as high-conversion", when: "3 hr ago", type: "ai" },
];

export const notifications = [
  { id: 1, title: "GPS Disabled", body: "Rahul Patel — Mumbai zone", time: "2m", severity: "danger" },
  { id: 2, title: "New Lead Assigned", body: "Tata Steel — ₹3.4L potential", time: "8m", severity: "info" },
  { id: 3, title: "Invoice Paid", body: "INV-2025-1031 — Asian Paints", time: "22m", severity: "success" },
  { id: 4, title: "Attendance Missing", body: "4 employees not checked in", time: "1h", severity: "warning" },
  { id: 5, title: "Expense Approved", body: "Sneha Reddy — ₹2,340", time: "2h", severity: "success" },
];

export const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L`
  : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K`
  : `₹${n}`;
