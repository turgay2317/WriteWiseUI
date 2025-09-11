import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface TeacherLoginRequest {
  username: string;
  password: string;
}

export interface StudentLoginRequest {
  numara: string;
  ad: string;
  soyad: string;
}

export interface TeacherLoginResponse {
  message: string;
  teacher_id: number;
  username: string;
  token: string;
}

export interface StudentLoginResponse {
  message: string;
  student: {
    id: number;
    ad: string;
    soyad: string;
    numara: string;
  };
  token: string;
}

export interface UserProfile {
  id: number;
  username?: string;
  ad: string;
  soyad: string;
  numara?: string;
  role: string;
  kredi?: number;
}

export interface User {
  id: number;
  type: 'teacher' | 'student';
  username?: string;
  ad?: string;
  soyad?: string;
  numara?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Teacher login
  teacherLogin(credentials: TeacherLoginRequest): Observable<TeacherLoginResponse> {
    return this.http.post<TeacherLoginResponse>(`${this.API_BASE_URL}/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            id: response.teacher_id,
            type: 'teacher',
            username: response.username
          };
          this.setCurrentUser(user);
          // JWT token'ı localStorage'a kaydet
          localStorage.setItem('jwt_token', response.token);
        })
      );
  }

  // Student login
  studentLogin(credentials: StudentLoginRequest): Observable<StudentLoginResponse> {
    return this.http.post<StudentLoginResponse>(`${this.API_BASE_URL}/student/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            id: response.student.id,
            type: 'student',
            ad: response.student.ad,
            soyad: response.student.soyad,
            numara: response.student.numara
          };
          this.setCurrentUser(user);
          // JWT token'ı localStorage'a kaydet
          localStorage.setItem('jwt_token', response.token);
        })
      );
  }

  // Logout
  logout(): Observable<any> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }

    const endpoint = currentUser.type === 'teacher' ? '/logout' : '/student/logout';
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, {})
      .pipe(
        tap(() => {
          this.clearCurrentUser();
        })
      );
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Check if current user is teacher
  isTeacher(): boolean {
    return this.currentUserSubject.value?.type === 'teacher';
  }

  // Check if current user is student
  isStudent(): boolean {
    return this.currentUserSubject.value?.type === 'student';
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwt_token');
  }

  getTeacherProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get<UserProfile>(`${this.API_BASE_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  getStudentProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get<UserProfile>(`${this.API_BASE_URL}/student/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    if (this.isTeacher()) {
      return this.getTeacherProfile();
    } else if (this.isStudent()) {
      return this.getStudentProfile();
    } else {
      throw new Error('No user logged in');
    }
  }

  // Student exams methods
  getStudentExams(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/student/exams`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getStudentAttendedExams(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/student/attended-exams`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getStudentExamQuestions(examId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/student/exams/${examId}/questions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Teacher specific methods
  getTeacherDersler(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/teacher/dersler`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getTeacherSiniflar(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/teacher/siniflar`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  startExamAnalysis(data: any, files: File[]): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    const formData = new FormData();
    
    // Add form data
    formData.append('ders_id', data.ders_id.toString());
    formData.append('sinif_id', data.sinif_id.toString());
    formData.append('degerlendirme_hususu', data.degerlendirme_hususu);
    
    // Add files
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    return this.http.post(`${this.API_BASE_URL}/run`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type, let browser set it with boundary
      }
    });
  }

  getSinifDersler(sinifId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.http.get(`${this.API_BASE_URL}/teacher/siniflar/${sinifId}/dersler`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
