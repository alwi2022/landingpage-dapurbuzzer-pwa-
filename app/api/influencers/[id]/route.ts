// app/api/influencers/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabase.from("influencers").update(body).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("influencers").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
