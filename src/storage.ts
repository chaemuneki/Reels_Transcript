import { User, Assignment, Submission } from './types';

const USERS_KEY = 'users';
const ASSIGNMENTS_KEY = 'assignments';
const SUBMISSIONS_KEY = 'submissions';

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAssignments(): Assignment[] {
  const data = localStorage.getItem(ASSIGNMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAssignments(assignments: Assignment[]) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

export function getSubmissions(): Submission[] {
  const data = localStorage.getItem(SUBMISSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSubmissions(submissions: Submission[]) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function initAdmin() {
  const users = getUsers();
  const adminExists = users.some((u) => u.email === 'admin@example.com');
  if (!adminExists) {
    users.push({
      id: Date.now(),
      name: '관리자',
      email: 'admin@example.com',
      password: 'admin',
      phone: '',
      intro: '',
      worry: '',
      career: '',
    });
    saveUsers(users);
  }
}
