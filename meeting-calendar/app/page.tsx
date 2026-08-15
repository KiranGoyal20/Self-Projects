"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "accepted" | "pending" | "declined";
type Member = { id: string; name: string; initials: string; color: string; role: string };
type Meeting = { id: number; title: string; date: string; start: string; end: string; color: string; location: string; organizer: string; guests: Record<string, Status> };

const members: Member[] = [
  { id: "alex", name: "Alex Morgan", initials: "AM", color: "#e77954", role: "Product design" },
  { id: "maya", name: "Maya Chen", initials: "MC", color: "#5c7cfa", role: "Engineering" },
  { id: "jon", name: "Jon Bell", initials: "JB", color: "#b56bd6", role: "Marketing" },
  { id: "sam", name: "Sam Rivera", initials: "SR", color: "#2ea77f", role: "Research" },
];

const week = [
  { key: "2026-07-06", day: "MON", date: 6 }, { key: "2026-07-07", day: "TUE", date: 7 },
  { key: "2026-07-08", day: "WED", date: 8 }, { key: "2026-07-09", day: "THU", date: 9 },
  { key: "2026-07-10", day: "FRI", date: 10 }, { key: "2026-07-11", day: "SAT", date: 11 },
  { key: "2026-07-12", day: "SUN", date: 12 },
];

const seed: Meeting[] = [
  { id: 1, title: "Weekly product sync", date: "2026-07-06", start: "09:00", end: "10:00", color: "#e77954", location: "Studio room", organizer: "alex", guests: { maya: "accepted", jon: "accepted" } },
  { id: 2, title: "Research playback", date: "2026-07-07", start: "11:30", end: "12:30", color: "#2ea77f", location: "Meet · Cedar", organizer: "sam", guests: { alex: "accepted", maya: "pending" } },
  { id: 3, title: "Homepage critique", date: "2026-07-08", start: "14:00", end: "15:30", color: "#b56bd6", location: "Design corner", organizer: "alex", guests: { maya: "accepted", sam: "accepted" } },
  { id: 4, title: "Q3 launch planning", date: "2026-07-09", start: "10:00", end: "11:30", color: "#5c7cfa", location: "Meet · Juniper", organizer: "maya", guests: { alex: "accepted", jon: "pending", sam: "accepted" } },
  { id: 5, title: "Deep work", date: "2026-07-10", start: "13:00", end: "15:00", color: "#d1a13b", location: "Focus block", organizer: "alex", guests: {} },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    inbox: <><path d="M4 4h16v16H4z"/><path d="M4 15h5l2 2h2l2-2h5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <path d="M12 5v14M5 12h14"/>, close: <path d="m6 6 12 12M18 6 6 18"/>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icons[name]}</svg>;
}

function Avatar({ id, small = false }: { id: string; small?: boolean }) {
  const member = members.find((m) => m.id === id)!;
  return <span className={`avatar ${small ? "small" : ""}`} style={{ background: member.color }}>{member.initials}</span>;
}

const time = (value: string) => { const [h, m] = value.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };

export default function Calendar() {
  const [user, setUser] = useState("alex");
  const [meetings, setMeetings] = useState(seed);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", date: "2026-07-09", start: "15:00", end: "16:00", location: "Meet · Willow", guests: [] as string[] });
  const me = members.find((m) => m.id === user)!;
  const visible = meetings.filter((m) => m.organizer === user || m.guests[user] === "accepted");
  const pending = meetings.filter((m) => m.guests[user] === "pending");
  const selected = meetings.find((m) => m.id === selectedId);
  const datesWithEvents = useMemo(() => new Set(visible.map((m) => Number(m.date.slice(-2)))), [visible]);

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2500); };
  const respond = (id: number, status: Status) => {
    setMeetings((all) => all.map((m) => m.id === id ? { ...m, guests: { ...m.guests, [user]: status } } : m));
    setSelectedId(status === "accepted" ? id : null);
    flash(status === "accepted" ? "Meeting added to your calendar" : "Invitation declined");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const palette = ["#e77954", "#5c7cfa", "#2ea77f", "#b56bd6"];
    const created: Meeting = { id: Date.now(), ...form, color: palette[meetings.length % 4], organizer: user, guests: Object.fromEntries(form.guests.map((id) => [id, "pending"])) };
    setMeetings((all) => [...all, created]); setSelectedId(created.id); setCreating(false);
    setForm({ title: "", date: "2026-07-09", start: "15:00", end: "16:00", location: "Meet · Willow", guests: [] });
    flash(`Invitations sent to ${form.guests.length} ${form.guests.length === 1 ? "person" : "people"}`);
  };

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><span /></span>Morrow</div>
      <button className="create-button" onClick={() => setCreating(true)}><Icon name="plus"/> Create</button>
      <nav>
        <button className="active"><Icon name="calendar"/> Calendar</button>
        <button><Icon name="inbox"/> Invitations {pending.length > 0 && <b>{pending.length}</b>}</button>
        <button><Icon name="users"/> People</button>
      </nav>
      <section className="mini-calendar">
        <div className="mini-title"><strong>July 2026</strong><span>‹　›</span></div>
        <div className="mini-grid mini-days">{["M","T","W","T","F","S","S"].map((d,i) => <span key={i}>{d}</span>)}</div>
        <div className="mini-grid">{[29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1,2].map((d,i) => <span key={i} className={`${i < 2 || i > 32 ? "muted" : ""} ${d === 4 && i === 5 ? "today" : ""} ${datesWithEvents.has(d) && i > 6 && i < 14 ? "has-event" : ""}`}>{d}</span>)}</div>
      </section>
      <div className="account-switcher">
        <label>Viewing calendar for</label>
        <div><Avatar id={user}/><select value={user} onChange={(e) => { setUser(e.target.value); setSelectedId(null); }} aria-label="Switch calendar owner">{members.map((m) => <option value={m.id} key={m.id}>{m.name}</option>)}</select></div>
        <small>Switch members to manage invitations</small>
      </div>
    </aside>

    <section className="calendar-area">
      <header className="topbar"><div><p className="eyebrow">WORKSPACE CALENDAR</p><h1>July 6–12, 2026</h1></div><div className="top-actions"><button>Today</button><button>‹</button><button>›</button><button>Week　⌄</button></div></header>
      {pending.length > 0 && <div className="invite-strip"><span className="invite-icon"><Icon name="inbox"/></span><div><strong>{pending.length} meeting invitation{pending.length > 1 ? "s" : ""} waiting</strong><small>Review and add them to {me.name.split(" ")[0]}’s calendar.</small></div><button onClick={() => setSelectedId(pending[0].id)}>Review invitation</button></div>}
      <div className="week-header"><div className="timezone">GMT+5:30</div>{week.map((d) => <div key={d.key} className={d.date === 8 ? "focus-day" : ""}><span>{d.day}</span><strong>{d.date}</strong></div>)}</div>
      <div className="calendar-grid">
        <div className="time-column">{[8,9,10,11,12,13,14,15,16,17,18].map((h) => <span key={h} style={{top:(h-8)*68-7}}>{h > 12 ? h-12 : h} {h >= 12 ? "PM" : "AM"}</span>)}</div>
        {week.map((day) => <div className={`day-column ${day.date === 8 ? "focus-column" : ""}`} key={day.key}>{visible.filter((m) => m.date === day.key).map((m) => {
          const [sh,sm] = m.start.split(":").map(Number), [eh,em] = m.end.split(":").map(Number); const top=(sh-8+sm/60)*68, height=Math.max(48,(eh-sh+(em-sm)/60)*68-5);
          const attendees=[m.organizer,...Object.keys(m.guests).filter((id)=>m.guests[id]==="accepted")].slice(0,3);
          return <button className={`event-card ${selectedId === m.id ? "selected" : ""}`} key={m.id} style={{top,height,borderColor:m.color,background:`${m.color}16`}} onClick={() => setSelectedId(m.id)}><strong>{m.title}</strong><span>{time(m.start)}</span><div>{attendees.map((id) => <Avatar id={id} small key={id}/>)}</div></button>;
        })}</div>)}
        <div className="now-line" style={{top:(10.35-8)*68}}><span/></div>
      </div>
    </section>

    <aside className={`details-panel ${selected ? "open" : ""}`}>{selected ? <>
      <button className="details-close" onClick={() => setSelectedId(null)}><Icon name="close"/></button>
      <div className="details-date"><span>{week.find((d)=>d.key===selected.date)?.day}</span><strong>{Number(selected.date.slice(-2))}</strong></div>
      <span className="event-pill" style={{color:selected.color,background:`${selected.color}18`}}>MEETING</span><h2>{selected.title}</h2>
      <div className="details-meta"><p><Icon name="clock"/>{time(selected.start)} – {time(selected.end)}</p><p><Icon name="pin"/>{selected.location}</p></div><hr/>
      <div className="organizer"><Avatar id={selected.organizer}/><div><span>Organized by</span><strong>{members.find((m)=>m.id===selected.organizer)?.name}</strong></div></div>
      <div className="guest-heading"><strong>Guests</strong><span>{Object.keys(selected.guests).length+1}</span></div>
      <div className="guest-list">{[selected.organizer,...Object.keys(selected.guests)].map((id) => { const member=members.find((m)=>m.id===id)!; const status=id===selected.organizer?"accepted":selected.guests[id]; return <div key={id}><Avatar id={id} small/><div><strong>{member.name}{id===user?" (you)":""}</strong><small>{status}</small></div><i className={status}><Icon name={status==="accepted"?"check":"clock"} size={13}/></i></div>; })}</div>
      {selected.guests[user] === "pending" && <div className="response-card"><p>Will you attend?</p><div><button onClick={()=>respond(selected.id,"declined")}>Decline</button><button className="accept" onClick={()=>respond(selected.id,"accepted")}><Icon name="check"/> Accept</button></div></div>}
      {selected.organizer === user && <button className="edit-button">Edit meeting</button>}
    </> : <div className="empty-details"><span><Icon name="calendar" size={25}/></span><h3>Select a meeting</h3><p>Choose an event to see its details and guests.</p></div>}</aside>

    {creating && <div className="modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget&&setCreating(false)}><form className="modal" onSubmit={submit}>
      <div className="modal-heading"><div><p className="eyebrow">NEW EVENT</p><h2>Create a meeting</h2></div><button type="button" onClick={()=>setCreating(false)}><Icon name="close"/></button></div>
      <label>Meeting title<input autoFocus required placeholder="e.g. Project kickoff" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/></label>
      <div className="form-row"><label>Date<input type="date" min="2026-07-06" max="2026-07-12" required value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})}/></label><label>Starts<input type="time" required value={form.start} onChange={(e)=>setForm({...form,start:e.target.value})}/></label><label>Ends<input type="time" required value={form.end} onChange={(e)=>setForm({...form,end:e.target.value})}/></label></div>
      <label>Location<input placeholder="Room or video link" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})}/></label>
      <fieldset><legend>Invite people</legend><div className="member-picker">{members.filter((m)=>m.id!==user).map((m)=><label key={m.id} className={form.guests.includes(m.id)?"checked":""}><input type="checkbox" checked={form.guests.includes(m.id)} onChange={()=>setForm({...form,guests:form.guests.includes(m.id)?form.guests.filter((id)=>id!==m.id):[...form.guests,m.id]})}/><Avatar id={m.id} small/><span><strong>{m.name}</strong><small>{m.role}</small></span><i><Icon name="check" size={14}/></i></label>)}</div></fieldset>
      <div className="modal-actions"><button type="button" onClick={()=>setCreating(false)}>Cancel</button><button type="submit"><Icon name="plus"/> Create & send invites</button></div>
    </form></div>}
    {toast && <div className="toast"><span><Icon name="check" size={15}/></span>{toast}</div>}
  </main>;
}
