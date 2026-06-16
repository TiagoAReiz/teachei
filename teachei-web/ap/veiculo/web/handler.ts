const FIPE_BASE = process.env.FIPE_API_BASE_URL ?? "https://parallelum.com.br/fipe/api/v1";

const TIPO_MAP: Record<string, string> = {
  carro: "carros",
  moto: "motos",
  caminhao: "caminhoes",
};

function toFipeTipo(tipo: string): string {
  const key = tipo.toLowerCase();
  return TIPO_MAP[key] ?? `${key}s`;
}

async function proxyFipe(path: string): Promise<Response> {
  try {
    const res = await fetch(`${FIPE_BASE}${path}`);
    if (!res.ok) return Response.json({ message: "Erro ao consultar FIPE" }, { status: res.status });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[FIPE] fetch falhou:", error);
    return Response.json({ message: "Serviço FIPE indisponível" }, { status: 503 });
  }
}

export function handleMarcas(tipo: string) {
  return proxyFipe(`/${toFipeTipo(tipo)}/marcas`);
}

export function handleModelos(tipo: string, marcaCodigo: string) {
  return proxyFipe(`/${toFipeTipo(tipo)}/marcas/${marcaCodigo}/modelos`);
}

export function handleAnos(tipo: string, marcaCodigo: string, modeloCodigo: string) {
  return proxyFipe(`/${toFipeTipo(tipo)}/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
}

export function handlePreco(tipo: string, marcaCodigo: string, modeloCodigo: string, anoCodigo: string) {
  return proxyFipe(`/${toFipeTipo(tipo)}/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`);
}
