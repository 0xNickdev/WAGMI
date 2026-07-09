/* Token logo storage. Logos are pinned to IPFS (permanent, content-addressed)
   via /api/upload and referenced as ipfs:// URIs so they render forever,
   independent of any single server. */

const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://gateway.pinata.cloud/ipfs/";

export function ipfsToHttp(uri: string): string {
  return uri.startsWith("ipfs://") ? `${IPFS_GATEWAY}${uri.slice(7)}` : uri;
}

/** Upload a logo file; returns a permanent ipfs:// URI, or null if the
    pinning service is not configured / the upload fails. */
export async function uploadLogo(file: File): Promise<string | null> {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    if (!res.ok) return null;
    const { uri } = (await res.json()) as { uri: string };
    return uri;
  } catch {
    return null;
  }
}
