const FIPE_BASE = process.env.FIPE_API_BASE_URL ?? "https://parallelum.com.br/fipe/api/v1";

async function proxyFipe(path: string): Promise<Response> {
  try {
    const res = await fetch(`${FIPE_BASE}${path}`);
    if (!res.ok) return Response.json({ message: "Erro ao consultar FIPE" }, { status: res.status });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ message: "Serviço FIPE indisponível" }, { status: 503 });
  }
}

export function handleMarcas(tipo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas`);
}

export function handleModelos(tipo: string, marcaCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos`);
}

export function handleAnos(tipo: string, marcaCodigo: string, modeloCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
}

export function handlePreco(tipo: string, marcaCodigo: string, modeloCodigo: string, anoCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`);
}
