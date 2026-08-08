// Java 21 Spring Boot Backend REST API Client for Sadi Hub

const JAVA_API_BASE_URL = 'http://localhost:8080/api/v1';

export async function isJavaBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${JAVA_API_BASE_URL}/wedding/family-default`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function javaLogin(email: string, password: String) {
  const res = await fetch(`${JAVA_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || 'Invalid credentials');
  }
  return res.json();
}

export async function javaJoinFamily(data: {
  familyCode: string;
  fullName: string;
  email: string;
  password: string;
  relation?: string;
  mobileNumber?: string;
}) {
  const res = await fetch(`${JAVA_API_BASE_URL}/auth/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to join family' }));
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function javaGetWedding(familyId: string) {
  const res = await fetch(`${JAVA_API_BASE_URL}/wedding/${familyId}`);
  if (!res.ok) throw new Error('Failed to fetch wedding details');
  return res.json();
}

export async function javaGetEvents(familyId: string) {
  const res = await fetch(`${JAVA_API_BASE_URL}/events/${familyId}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function javaGetPhotos(familyId: string) {
  const res = await fetch(`${JAVA_API_BASE_URL}/photos/${familyId}`);
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function javaAddPhoto(familyId: string, photo: { userId: string; photoUrl: string; caption?: string; userName?: string }) {
  const res = await fetch(`${JAVA_API_BASE_URL}/photos/${familyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || 'Could not upload photo');
  }
  return res.json();
}

export async function javaGetWishes(familyId: string) {
  const res = await fetch(`${JAVA_API_BASE_URL}/wishes/${familyId}`);
  if (!res.ok) throw new Error('Failed to fetch wishes');
  return res.json();
}

export async function javaAddWish(familyId: string, wish: { userId: string; senderName: string; relation: string; message: string }) {
  const res = await fetch(`${JAVA_API_BASE_URL}/wishes/${familyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wish),
  });
  if (!res.ok) throw new Error('Could not submit wish');
  return res.json();
}

export async function javaApproveMember(profileId: string) {
  const res = await fetch(`${JAVA_API_BASE_URL}/admin/members/${profileId}/approve`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Could not approve member');
  return res.json();
}
