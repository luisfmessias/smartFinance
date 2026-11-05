export class ApiRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function api<Result>(path: string, options: { method?: string; body?: unknown } = {}): Promise<Result> {
  const response = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  }).catch(() => {
    throw new ApiRequestError(0, "Sem conexão com o servidor. Tente novamente.");
  });
  const data = await response.json().catch(() => null) as (Result & { error?: string }) | null;
  if (!response.ok) throw new ApiRequestError(response.status, data?.error ?? "Não foi possível concluir a operação.");
  return data as Result;
}

export const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Não foi possível concluir a operação.";
