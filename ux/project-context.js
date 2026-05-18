// ─── OneOhm Project Context ───────────────────────────────────────────────
// Shared across all screens. Screens call: getActiveProject() on load.

const PROJECTS = [
  {
    id: 'PROJ-2025-001',
    label: 'Home — Pune',
    address: '42, Green Valley, Pune 411001',
    type: 'Residential',
    systemKw: 5,
    panels: 14,
    status: 'IN_PROGRESS',
    statusLabel: 'In Progress',
    statusColor: '#EAB308',
    phase: 'Phase 2',
    progress: 45,
    totalValue: 285000,
    subsidy: 114000,
    effectivePrice: 171000,
    amountPaid: 85500,
    outstanding: 85500,
    discom: 'MSEDCL',
    consumerNo: 'MSEDCL-2304567',
    startDate: 'Oct 10, 2025',
    nextMilestone: 'Payment 2 — ₹85,500 due Nov 5',
    manager: { name: 'Amit Mehta', initials: 'AM', color: '#76c044' },
    engineer: { name: 'Priya Kulkarni', initials: 'PK', color: '#0d74b8' },
    timeline: [
      { title: 'Quote Accepted', status: 'done', date: 'Oct 10, 2025' },
      {
        title: 'Payment 1 — Advance (30%)',
        status: 'done',
        date: 'Oct 14, 2025',
        amount: '₹85,500',
      },
      { title: 'Design Approved', status: 'done', date: 'Oct 20, 2025' },
      {
        title: 'Payment 2 — Pre-Install',
        status: 'active',
        date: 'Due Nov 5, 2025',
        amount: '₹85,500',
      },
      { title: 'Installation', status: 'locked', date: '' },
      { title: 'Net Metering', status: 'locked', date: '' },
      { title: 'Project Completion', status: 'locked', date: '' },
    ],
  },
  {
    id: 'PROJ-2025-002',
    label: 'Factory — Nashik',
    address: 'MIDC Plot 12, Satpur, Nashik 422007',
    type: 'Commercial',
    systemKw: 25,
    panels: 60,
    status: 'PLANNING',
    statusLabel: 'Planning',
    statusColor: '#0d74b8',
    phase: 'Phase 1',
    progress: 10,
    totalValue: 1200000,
    subsidy: 0,
    effectivePrice: 1200000,
    amountPaid: 360000,
    outstanding: 840000,
    discom: 'MSEDCL',
    consumerNo: 'MSEDCL-8901234',
    startDate: 'Nov 1, 2025',
    nextMilestone: 'Site survey scheduled Nov 20',
    manager: { name: 'Sunil Patil', initials: 'SP', color: '#0d74b8' },
    engineer: { name: 'Meera Joshi', initials: 'MJ', color: '#A855F7' },
    timeline: [
      { title: 'Quote Accepted', status: 'done', date: 'Nov 1, 2025' },
      {
        title: 'Payment 1 — Advance (30%)',
        status: 'active',
        date: 'Nov 5, 2025',
        amount: '₹3,60,000',
      },
      { title: 'Design Approval', status: 'locked', date: '' },
      { title: 'Payment 2 — Pre-Install', status: 'locked', date: '' },
      { title: 'Installation', status: 'locked', date: '' },
      { title: 'Net Metering', status: 'locked', date: '' },
      { title: 'Project Completion', status: 'locked', date: '' },
    ],
  },
  {
    id: 'PROJ-2025-003',
    label: 'Farmhouse — Lonavala',
    address: 'Survey No. 88, Lonavala 410401',
    type: 'Residential',
    systemKw: 3,
    panels: 8,
    status: 'COMPLETED',
    statusLabel: 'Completed',
    statusColor: '#76c044',
    phase: 'Done',
    progress: 100,
    totalValue: 165000,
    subsidy: 78000,
    effectivePrice: 87000,
    amountPaid: 87000,
    outstanding: 0,
    discom: 'MSEDCL',
    consumerNo: 'MSEDCL-5512390',
    startDate: 'Jul 1, 2025',
    nextMilestone: 'System live since Sep 15, 2025',
    manager: { name: 'Amit Mehta', initials: 'AM', color: '#76c044' },
    engineer: { name: 'Rahul Desai', initials: 'RD', color: '#10B981' },
    timeline: [
      { title: 'Quote Accepted', status: 'done', date: 'Jul 1, 2025' },
      {
        title: 'Payment 1 — Advance',
        status: 'done',
        date: 'Jul 5, 2025',
        amount: '₹26,100',
      },
      { title: 'Design Approved', status: 'done', date: 'Jul 12, 2025' },
      {
        title: 'Payment 2 — Pre-Install',
        status: 'done',
        date: 'Aug 1, 2025',
        amount: '₹30,450',
      },
      { title: 'Installation', status: 'done', date: 'Aug 15, 2025' },
      { title: 'Net Metering', status: 'done', date: 'Sep 10, 2025' },
      { title: 'Project Completion', status: 'done', date: 'Sep 15, 2025' },
    ],
  },
];

const ACTIVE_PROJECT_KEY = 'oneohm_active_project_id';

function getActiveProjectId() {
  return localStorage.getItem(ACTIVE_PROJECT_KEY) || PROJECTS[0].id;
}

function setActiveProject(id) {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

function getActiveProject() {
  const id = getActiveProjectId();
  return PROJECTS.find(p => p.id === id) || PROJECTS[0];
}

function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}
