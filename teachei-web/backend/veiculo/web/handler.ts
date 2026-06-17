const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1";

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[FIPE] fetch falhou:", msg);
    return Response.json({ message: "Serviço FIPE indisponível", debug: msg, url: `${FIPE_BASE}${path}` }, { status: 503 });
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
