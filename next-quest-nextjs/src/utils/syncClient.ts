export type RemoteProfile = {
  id: string;
  revision: number;
  displayName?: string;
  state: {
    progress?: unknown;
    chat?: unknown;
    settings?: unknown;
    sync?: unknown;
  };
  updatedAt?: string;
};

export type PutResult =
  | { ok: true; revision: number; updatedAt: string }
  | { ok: false; reason: "stale"; server: RemoteProfile }
  | { ok: false; reason: "error"; error: string };

const TIMEOUT_MS = 5000;

async function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await withTimeout(fetch(`${baseUrl}/api/health`));
    if (!res.ok) return false;
    const data = await res.json();
    return data?.ok === true;
  } catch {
    return false;
  }
}

export async function fetchProfile(
  baseUrl: string,
  profileId: string
): Promise<RemoteProfile | null> {
  const res = await withTimeout(
    fetch(`${baseUrl}/api/profile/${profileId}`)
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET profile failed: ${res.status}`);
  return (await res.json()) as RemoteProfile;
}

export async function putProfile(
  baseUrl: string,
  profileId: string,
  body: { revision: number; state: object; displayName?: string }
): Promise<PutResult> {
  let res: Response;
  try {
    res = await withTimeout(
      fetch(`${baseUrl}/api/profile/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  if (res.status === 409) {
    const data = (await res.json()) as { server: RemoteProfile };
    return { ok: false, reason: "stale", server: data.server };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      reason: "error",
      error: `PUT failed (${res.status}) ${text.slice(0, 120)}`,
    };
  }
  const data = (await res.json()) as { revision: number; updatedAt: string };
  return { ok: true, revision: data.revision, updatedAt: data.updatedAt };
}

export async function deleteProfile(
  baseUrl: string,
  profileId: string
): Promise<void> {
  await withTimeout(
    fetch(`${baseUrl}/api/profile/${profileId}`, { method: "DELETE" })
  );
}
