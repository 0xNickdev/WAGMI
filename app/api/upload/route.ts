import { NextResponse } from "next/server";

/* Pins token logos to IPFS via Pinata so they are permanently retrievable.
   Requires PINATA_JWT (server-side env, not NEXT_PUBLIC). */

const MAX_SIZE = 1024 * 1024; // 1 MB, matches the wizard's upload hint
const ALLOWED = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

export async function POST(req: Request) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return NextResponse.json(
      { error: "Logo storage not configured (set PINATA_JWT)" },
      { status: 501 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 1 MB)" }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }

  const body = new FormData();
  body.append("file", file, file.name);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body,
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Pinning failed" }, { status: 502 });
  }
  const { IpfsHash } = (await res.json()) as { IpfsHash: string };
  return NextResponse.json({ uri: `ipfs://${IpfsHash}` });
}
