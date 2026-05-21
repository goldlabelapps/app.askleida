// /users/route.ts
// Endpoint for CRUD operations on users
import { NextRequest, NextResponse } from 'next/server';

// Dummy user data for demonstration (replace with DB integration)
const users: Record<string, any> = {
  'user1': { user_id: 'user1', name: 'Alice', email: 'alice@example.com' },
  'user2': { user_id: 'user2', name: 'Bob', email: 'bob@example.com' },
};

// GET /users?user_id=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  const user = users[user_id];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

// POST /users
// Body: { user_id, name, email }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, name, email } = body;
  if (!user_id || !name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (users[user_id]) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  users[user_id] = { user_id, name, email };
  return NextResponse.json(users[user_id], { status: 201 });
}

// PUT /users
// Body: { user_id, name?, email? }
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { user_id, name, email } = body;
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  const user = users[user_id];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  return NextResponse.json(user);
}

// DELETE /users?user_id=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  const user = users[user_id];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  delete users[user_id];
  return NextResponse.json({ success: true });
}
