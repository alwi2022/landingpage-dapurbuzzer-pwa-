"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, User, AtSign, Hash, Image as ImgIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, useDebounce } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UploadToCloudinary from "@/components/UploadToCloudinary";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/custom/card";
import { PAGE_SIZE } from "@/app/data/data";
import { InfluencerType } from "@/app/types/type";

export default function AdminInfluencersPage() {
  const [items, setItems] = useState<InfluencerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortFollowers, setSortFollowers] = useState<"desc" | "asc">("desc");
  const dSearch = useDebounce(search, 300);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<InfluencerType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InfluencerType | null>(null);

  const [cform, setCform] = useState<Partial<InfluencerType>>({
    name: "",
    username: "",
    followers: undefined,
    img: "",
  });
  const [eform, setEform] = useState<Partial<InfluencerType>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/influencers", { cache: "no-store" });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        const data: InfluencerType[] = Array.isArray(j) ? j : j.data ?? [];
        setItems(data);
        // clamp page
        const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
        setPage((p) => Math.min(p, totalPages));
      } catch (e) {
        console.error(e);
        alert("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = dSearch.trim().toLowerCase();
    const base = q
      ? items.filter((i) =>
        [i.name, i.username, i.followers?.toString()]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
      : items;

    const factor = sortFollowers === "asc" ? 1 : -1;
    return [...base].sort((a, b) => ((a.followers ?? 0) - (b.followers ?? 0)) * factor);
  }, [items, dSearch, sortFollowers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);


  useEffect(() => {
    setPage(1);
  }, [dSearch, sortFollowers]);


  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);


  async function onCreate() {
    const body = {
      name: (cform.name || "").trim(),
      username: (cform.username || "").trim(),
      followers: Number(cform.followers) || 0,
      img: (cform.img || "").trim(),
    };
    if (!body.name) return;

    const r = await fetch("/api/influencers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      alert("Gagal menambah data");
      return;
    }
    const created = await r.json();
    const createdRow: InfluencerType = Array.isArray(created) ? created[0] : created;

    setItems((prev) => [createdRow, ...prev]);
    setCreateOpen(false);
    setCform({ name: "", username: "", followers: undefined, img: "" });
    setPage(1);
  }

  function openEdit(row: InfluencerType) {
    setEditOpen(row);
    setEform({
      name: row.name || "",
      username: row.username || "",
      followers: Number(row.followers || 0),
      img: row.img || "",
    });
  }

  async function onSaveEdit() {
    if (!editOpen) return;
    const r = await fetch(`/api/influencers/${editOpen.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eform),
    });
    if (!r.ok) {
      alert("Gagal menyimpan");
      return;
    }
    const updated = await r.json();
    setItems((prev) => prev.map((x) => (x.id === editOpen.id ? { ...x, ...updated } : x)));
    setEditOpen(null);
  }

  async function onDelete() {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    const r = await fetch(`/api/influencers/${id}`, { method: "DELETE" });
    if (!r.ok) {
      alert("Gagal menghapus");
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
    setConfirmDelete(null);


    const after = filtered.length - 1;
    const afterPages = Math.max(1, Math.ceil(after / PAGE_SIZE));
    setPage((p) => Math.min(p, afterPages));
  }


  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl p-4">
        {/* Toolbar */}
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Cari nama / username…"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  className="h-10"
                  aria-label="Cari influencer"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                <select
                  value={sortFollowers}
                  onChange={(e) => setSortFollowers(e.target.value as "asc" | "desc")}
                  className="h-10 w-full sm:w-[200px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6f2dbd]"
                  aria-label="Urutkan followers"
                >
                  <option value="desc">Followers High → Low</option>
                  <option value="asc">Followers Low → High</option>
                </select>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 rounded-full px-4 bg-[#6f2dbd] hover:bg-[#5a23a1] w-full sm:w-auto justify-center">
                      <Plus className="h-4 w-4 mr-2" /> Tambah Influencer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[520px] max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle>Tambah Influencer</DialogTitle>
                      <DialogDescription>Isi data singkat di bawah lalu simpan.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mt-2">
                      <Field icon={<User className="h-4 w-4 text-muted-foreground" />}>
                        <Input
                          placeholder="Nama"
                          value={cform.name || ""}
                          onChange={(e) => setCform((f) => ({ ...f, name: e.target.value }))}
                        />
                      </Field>

                      <Field icon={<AtSign className="h-4 w-4 text-muted-foreground" />}>
                        <Input
                          placeholder="Username (tanpa @)"
                          value={cform.username || ""}
                          onChange={(e) => setCform((f) => ({ ...f, username: e.target.value }))}
                        />
                      </Field>

                      <Field icon={<Hash className="h-4 w-4 text-muted-foreground" />}>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="Followers"
                          value={
                            cform.followers === undefined || cform.followers === null ? "" : cform.followers
                          }
                          onChange={(e) =>
                            setCform((f) => ({
                              ...f,
                              followers: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                        />
                      </Field>

                      <Field icon={<ImgIcon className="h-4 w-4 text-muted-foreground" />}>
                        <UploadToCloudinary
                          onUploaded={(url) => setCform((f) => ({ ...f, img: url }))}
                          label="Upload Foto"
                        />
                        {cform.img ? (
                          <div className="mt-2">
                            <img
                              src={cform.img}
                              alt="preview"
                              className="h-24 w-24 rounded-lg object-cover border"
                            />
                          </div>
                        ) : null}
                      </Field>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button variant="outline" className="rounded-full" onClick={() => setCreateOpen(false)}>
                        Batal
                      </Button>
                      <Button
                        className="rounded-full bg-[#6f2dbd] hover:bg-[#5a23a1]"
                        disabled={!cform.name?.trim()}
                        onClick={onCreate}
                      >
                        Simpan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop: Table (md+) */}
        <div className="mt-4 hidden md:block">
          <Card className="rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[12px] font-medium text-gray-600 bg-muted/40">
                <div className="col-span-5 lg:col-span-5">Influencer</div>
                <div className="col-span-3 lg:col-span-3">Username</div>
                <div className="col-span-2 lg:col-span-2 text-right lg:text-left">Followers</div>
                <div className="col-span-2 lg:col-span-2 text-right">Aksi</div>
              </div>
              <Separator />

              {loading ? (
                <div className="p-6 text-sm text-muted-foreground">Memuat…</div>
              ) : paged.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">Tidak ada data.</div>
              ) : (
                paged.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0">
                    <div className="col-span-5 lg:col-span-5 flex items-center gap-3 min-w-0">
                      <img
                        src={it.img || "https://placehold.co/64x64?text=IMG"}
                        alt={it.name}
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate">{it.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {it.created_at?.slice(0, 10)}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 lg:col-span-3 flex items-center">
                      <span className="text-[12px] truncate">@{it.username}</span>
                    </div>

                    <div className="col-span-2 lg:col-span-2 flex items-center justify-end lg:justify-start">
                      <span className="text-[12px]">{Number(it.followers || 0).toLocaleString("id-ID")}</span>
                    </div>

                    <div className="col-span-2 lg:col-span-2 flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 px-2 rounded-full text-[12px]" onClick={() => openEdit(it)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 rounded-full text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmDelete(it)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Cards (sm-) */}
        <div className="mt-4 md:hidden">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Memuat…</div>
          ) : paged.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Tidak ada data.</div>
          ) : (
            <div className="space-y-2">
              {paged.map((it) => (
                <Card key={it.id} className="rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={it.img || "https://placehold.co/80x80?text=IMG"}
                        alt={it.name}
                        className="h-16 w-16 rounded-xl object-cover border"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold truncate">{it.name}</div>
                        <div className="text-[12px] text-muted-foreground truncate">@{it.username}</div>
                        <div className="text-[12px] text-muted-foreground">
                          {Number(it.followers || 0).toLocaleString("id-ID")} followers
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 rounded-full text-[12px]" onClick={() => openEdit(it)}>
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-full text-red-600 hover:bg-red-50 text-[12px]"
                            onClick={() => setConfirmDelete(it)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-[12px] text-muted-foreground">
            Page <b>{page}</b> of <b>{totalPages}</b> • Total <b>{filtered.length}</b>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 rounded-full text-[12px]"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              className="h-8 rounded-full text-[12px]"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* EDIT DIALOG */}
      <Dialog open={!!editOpen} onOpenChange={(o) => !o && setEditOpen(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Influencer</DialogTitle>
            <DialogDescription>Perbarui data, lalu simpan.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <Field icon={<User className="h-4 w-4 text-muted-foreground" />}>
              <Input
                placeholder="Nama"
                value={eform.name || ""}
                onChange={(e) => setEform((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>

            <Field icon={<AtSign className="h-4 w-4 text-muted-foreground" />}>
              <Input
                placeholder="Username"
                value={eform.username || ""}
                onChange={(e) => setEform((f) => ({ ...f, username: e.target.value }))}
              />
            </Field>

            <Field icon={<Hash className="h-4 w-4 text-muted-foreground" />}>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Followers"
                value={eform.followers ?? ""}
                onChange={(e) => setEform((f) => ({ ...f, followers: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </Field>

            <Field icon={<ImgIcon className="h-4 w-4 text-muted-foreground" />}>
              <UploadToCloudinary onUploaded={(url) => setEform((f) => ({ ...f, img: url }))} label="Ganti Foto" />
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={eform.img || editOpen?.img || "https://placehold.co/96x96?text=IMG"}
                  alt="preview"
                  className="h-24 w-24 rounded-lg object-cover border"
                />
              </div>
            </Field>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" className="rounded-full" onClick={() => setEditOpen(null)}>
              Batal
            </Button>
            <Button className="rounded-full bg-[#6f2dbd] hover:bg-[#5a23a1]" onClick={onSaveEdit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Hapus data?</DialogTitle>
            <DialogDescription>
              Aksi ini tidak dapat dibatalkan. Data <b>{confirmDelete?.name}</b> akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" className="rounded-full" onClick={() => setConfirmDelete(null)}>
              Batal
            </Button>
            <Button className="rounded-full bg-red-600 hover:bg-red-700" onClick={onDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


