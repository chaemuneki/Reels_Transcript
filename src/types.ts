export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  intro: string;
  worry: string;
  career: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO date
}

export interface Submission {
  id: number;
  assignmentId: number;
  userId: number;
  content: string;
  status: 'submitted' | 'review' | 'feedback';
  date: string; // ISO date
}
