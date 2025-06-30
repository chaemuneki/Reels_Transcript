import React, { useState, useEffect } from 'react';
import { Assignment, Submission, User } from './types';
import {
  getUsers,
  saveUsers,
  getAssignments,
  saveAssignments,
  getSubmissions,
  saveSubmissions,
  initAdmin,
} from './storage';

initAdmin();

type Page = 'login' | 'register' | 'student' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(getUsers());
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(getSubmissions());

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    saveSubmissions(submissions);
  }, [submissions]);

  const handleRegister = (data: Omit<User, 'id'>) => {
    const id = Date.now();
    const newUser: User = { id, ...data };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setPage('student');
  };

  const handleLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      if (user.email === 'admin@example.com') {
        setCurrentUser(user);
        setPage('admin');
      } else {
        setCurrentUser(user);
        setPage('student');
      }
    } else {
      alert('로그인 실패');
    }
  };

  const addAssignment = (title: string, description: string, dueDate: string) => {
    const newAssign: Assignment = {
      id: Date.now(),
      title,
      description,
      dueDate,
    };
    setAssignments([...assignments, newAssign]);
  };

  const submitAssignment = (assignmentId: number, content: string) => {
    if (!currentUser) return;
    const newSubmission: Submission = {
      id: Date.now(),
      assignmentId,
      userId: currentUser.id,
      content,
      status: 'submitted',
      date: new Date().toISOString(),
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const updateSubmissionStatus = (submissionId: number, status: Submission['status']) => {
    setSubmissions(
      submissions.map((s) => (s.id === submissionId ? { ...s, status } : s))
    );
  };

  if (page === 'register') {
    return <RegisterForm onRegister={handleRegister} onLogin={() => setPage('login')} />;
  }

  if (page === 'login') {
    return <LoginForm onLogin={handleLogin} onRegister={() => setPage('register')} />;
  }

  if (page === 'student' && currentUser) {
    return (
      <StudentDashboard
        user={currentUser}
        assignments={assignments}
        submissions={submissions.filter((s) => s.userId === currentUser.id)}
        onSubmit={submitAssignment}
        onLogout={() => {
          setCurrentUser(null);
          setPage('login');
        }}
      />
    );
  }

  if (page === 'admin' && currentUser) {
    return (
      <AdminDashboard
        assignments={assignments}
        submissions={submissions}
        onAdd={addAssignment}
        onUpdateStatus={updateSubmissionStatus}
        onLogout={() => {
          setCurrentUser(null);
          setPage('login');
        }}
      />
    );
  }

  return null;
}

function LoginForm({ onLogin, onRegister }: { onLogin: (e: string, p: string) => void; onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <div className="flex flex-col gap-2">
        <input className="border p-2" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="border p-2" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={() => onLogin(email, password)}>로그인</button>
        <button className="text-sm mt-2 underline" onClick={onRegister}>회원가입</button>
      </div>
    </div>
  );
}

function RegisterForm({ onRegister, onLogin }: { onRegister: (u: Omit<User, 'id'>) => void; onLogin: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', intro: '', worry: '', career: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <div className="flex flex-col gap-2">
        <input name="name" className="border p-2" placeholder="이름" onChange={handleChange} value={form.name} />
        <input name="email" className="border p-2" placeholder="이메일" onChange={handleChange} value={form.email} />
        <input type="password" name="password" className="border p-2" placeholder="비밀번호" onChange={handleChange} value={form.password} />
        <input name="phone" className="border p-2" placeholder="휴대폰 번호" onChange={handleChange} value={form.phone} />
        <input name="intro" className="border p-2" placeholder="자기소개" onChange={handleChange} value={form.intro} />
        <input name="worry" className="border p-2" placeholder="현재 고민" onChange={handleChange} value={form.worry} />
        <input name="career" className="border p-2" placeholder="경력사항" onChange={handleChange} value={form.career} />
        <button className="bg-blue-500 text-white p-2" onClick={() => onRegister(form)}>가입하기</button>
        <button className="text-sm mt-2 underline" onClick={onLogin}>로그인으로</button>
      </div>
    </div>
  );
}

function StudentDashboard({ user, assignments, submissions, onSubmit, onLogout }: {
  user: User;
  assignments: Assignment[];
  submissions: Submission[];
  onSubmit: (a: number, c: string) => void;
  onLogout: () => void;
}) {
  const [content, setContent] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{user.name}님 환영합니다</h1>
        <button onClick={onLogout} className="underline text-sm">로그아웃</button>
      </div>
      <h2 className="text-lg font-bold mb-2">과제 목록</h2>
      <ul className="mb-4">
        {assignments.map((a) => (
          <li key={a.id} className="border p-2 mb-2" onClick={() => setSelected(a.id)}>
            {a.title} - 마감 {a.dueDate}
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">과제 제출</h3>
          <textarea className="border w-full p-2" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="bg-green-500 text-white p-2 mt-2" onClick={() => { onSubmit(selected, content); setContent(''); }}>
            제출하기
          </button>
        </div>
      )}
      <h2 className="text-lg font-bold mb-2">나의 제출 현황</h2>
      <ul>
        {submissions.map((s) => (
          <li key={s.id} className="border p-2 mb-2">
            과제 {assignments.find((a) => a.id === s.assignmentId)?.title} - 상태 {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminDashboard({ assignments, submissions, onAdd, onUpdateStatus, onLogout }: {
  assignments: Assignment[];
  submissions: Submission[];
  onAdd: (t: string, d: string, due: string) => void;
  onUpdateStatus: (id: number, status: Submission['status']) => void;
  onLogout: () => void;
}) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">관리자 대시보드</h1>
        <button onClick={onLogout} className="underline text-sm">로그아웃</button>
      </div>
      <h2 className="text-lg font-bold mb-2">과제 등록</h2>
      <div className="flex flex-col gap-2 mb-4">
        <input name="title" className="border p-2" placeholder="제목" value={form.title} onChange={handleChange} />
        <textarea name="description" className="border p-2" placeholder="설명" value={form.description} onChange={handleChange} />
        <input name="dueDate" type="date" className="border p-2" value={form.dueDate} onChange={handleChange} />
        <button className="bg-blue-500 text-white p-2" onClick={() => { onAdd(form.title, form.description, form.dueDate); setForm({ title: '', description: '', dueDate: '' }); }}>등록</button>
      </div>
      <h2 className="text-lg font-bold mb-2">제출 현황</h2>
      <ul>
        {submissions.map((s) => (
          <li key={s.id} className="border p-2 mb-2">
            {assignments.find((a) => a.id === s.assignmentId)?.title} - 사용자ID {s.userId}
            <select className="ml-2 border" value={s.status} onChange={(e) => onUpdateStatus(s.id, e.target.value as Submission['status'])}>
              <option value="submitted">제출완료</option>
              <option value="review">검토중</option>
              <option value="feedback">피드백 완료</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
