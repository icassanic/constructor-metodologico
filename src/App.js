import { useState, useEffect, useCallback } from "react";

const ETAPAS = [
  { id: 1, clave: "idea", titulo: "Idea inicial del proyecto", icono: "💡", descripcion: "Cuéntanos con tus propias palabras de qué trata tu proyecto. No hay respuesta incorrecta; lo importante es que te expreses con libertad.", preguntas: ["¿Qué quieres hacer o lograr con este proyecto?", "¿Qué tema o situación te interesa o llamó tu atención?", "¿Qué quisieras mejorar, resolver, analizar, diseñar o desarrollar?", "¿A quién le serviría o beneficiaría?", "¿En qué lugar o contexto ocurriría?", "¿Por qué te parece importante hacerlo?"], placeholder: "Escribe aquí tu idea con tus propias palabras. Puedes escribir de manera informal; después la transformaremos en lenguaje académico...", campoSalida: "narrativa_inicial", labelSalida: "Narrativa inicial del proyecto" },
  { id: 2, clave: "delimitacion", titulo: "Delimitación del tema", icono: "🎯", descripcion: "Una buena investigación no puede abarcar todo. Aquí precisamos exactamente de qué trata tu proyecto: qué aspecto, a quién involucra, dónde y cuándo.", preguntas: ["¿Cuál es el tema general de tu proyecto?", "¿Qué aspecto específico de ese tema abordarás?", "¿A quiénes involucra o afecta?", "¿Dónde ocurre o se aplicará?", "¿En qué periodo de tiempo?", "¿Qué vas a producir, analizar o desarrollar concretamente?"], placeholder: "Describe con precisión el alcance de tu proyecto: tema, subtema, quiénes, dónde y qué vas a producir...", labelSalida: "Tema delimitado" },
  { id: 3, clave: "problema", titulo: "Detección del problema", icono: "🔍", descripcion: "El problema es la situación que justifica tu proyecto. Es algo real que existe y que tu proyecto puede ayudar a atender.", preguntas: ["¿Qué situación no está funcionando bien o puede mejorar?", "¿Qué necesidad existe actualmente?", "¿Qué dificultad enfrentan las personas involucradas?", "¿Qué proceso es lento, ineficiente, confuso o limitado?", "¿Qué evidencia muestra que esa situación existe?", "¿Qué consecuencias puede haber si no se atiende?"], placeholder: "Describe la situación problemática que observaste o identificaste...", labelSalida: "Problema central identificado" },
  { id: 4, clave: "planteamiento", titulo: "Planteamiento del problema", icono: "📋", descripcion: "El planteamiento del problema desarrolla en tres partes la situación que quieres atender. Las tres partes son obligatorias.", preguntas: ["PARTE 1 — Contexto general: panorama amplio del tema, relevancia actual, antecedentes", "PARTE 2 — Problema específico: qué ocurre, dónde, a quién afecta, evidencia", "PARTE 3 — Consecuencias: qué puede pasar si el problema no se atiende"], placeholder: "Escribe la información para las tres partes. Puedes usar los encabezados: PARTE 1 / PARTE 2 / PARTE 3...", labelSalida: "Planteamiento del problema (tres fases)" },
  { id: 5, clave: "titulo", titulo: "Título del proyecto", icono: "📌", descripcion: "El título debe ser afirmativo, claro y académico. No se redacta como pregunta. Debe decir qué vas a hacer, sobre qué y con qué propósito.", preguntas: ["¿Qué acción realizarás: diseñarás, analizarás, desarrollarás, evaluarás?", "¿Sobre qué fenómeno, proceso, sistema o tecnología?", "¿Para quién o en qué contexto?"], placeholder: "Puedes proponer un título o dejar que la IA lo genere...", labelSalida: "Título del proyecto" },
  { id: 6, clave: "pregunta", titulo: "Pregunta de investigación", icono: "❓", descripcion: "La pregunta lleva al plano interrogativo lo que el título plantea en afirmación. Debe poder responderse con el proyecto.", preguntas: ["¿Tu pregunta inicia con: Cómo, De qué manera, Qué impacto, En qué medida...?", "¿Es lo suficientemente específica para poder responderse?", "¿Está alineada con el título y con el problema?"], placeholder: "Escribe tu propuesta de pregunta de investigación o deja que la IA la genere...", labelSalida: "Pregunta de investigación" },
  { id: 7, clave: "objetivo_general", titulo: "Objetivo general", icono: "🎯", descripcion: "El objetivo general responde directamente a la pregunta de investigación e inicia con un verbo en infinitivo.", preguntas: ["¿El verbo describe lo que harás: Diseñar, Analizar, Desarrollar, Evaluar?", "¿Puede lograrse en el tiempo y con los recursos que tienes?", "¿Coincide exactamente con lo que propone el título?"], placeholder: "Escribe tu propuesta de objetivo general...", labelSalida: "Objetivo general" },
  { id: 8, clave: "objetivos_especificos", titulo: "Objetivos específicos", icono: "📊", descripcion: "Son los pasos metodológicos para lograr el objetivo general. No son funciones del sistema.", preguntas: ["¿Tienes uno para diagnosticar la situación actual?", "¿Tienes uno para analizar necesidades?", "¿Tienes uno para diseñar o proponer?", "¿Tienes uno para desarrollar o implementar?", "¿Tienes uno para evaluar o validar?"], placeholder: "Escribe los objetivos específicos numerados, uno por línea...", labelSalida: "Objetivos específicos" },
  { id: 9, clave: "justificacion", titulo: "Justificación", icono: "⚖️", descripcion: "Responde por qué vale la pena realizar este proyecto. No repite el problema; argumenta el valor y el beneficio.", preguntas: ["¿Por qué es importante realizarlo ahora?", "¿A quién beneficia directamente y cómo?", "¿Qué valor académico, social, técnico o institucional aporta?", "¿Qué ofrece frente a lo que ya existe?"], placeholder: "Argumenta por qué tu proyecto vale la pena...", labelSalida: "Justificación" },
  { id: 10, clave: "viabilidad", titulo: "Viabilidad", icono: "✅", descripcion: "Demuestra que el proyecto puede realizarse con los recursos disponibles: tiempo, conocimiento, herramientas, acceso y presupuesto.", preguntas: ["¿Cuentas con los conocimientos técnicos necesarios?", "¿Tienes acceso a las herramientas o software requeridos?", "¿Puedes completarlo en el tiempo del semestre?", "¿Tienes acceso a los usuarios o datos que necesitas?"], placeholder: "Describe los recursos con los que cuentas...", labelSalida: "Viabilidad del proyecto" },
  { id: 11, clave: "alcances", titulo: "Alcances", icono: "📏", descripcion: "Indica qué sí se realizará, qué se construirá y hasta dónde llegará el proyecto. Son compromisos concretos.", preguntas: ["¿Qué producto o resultado concreto entregarás?", "¿Cuáles son las funciones o aspectos principales que cubrirás?", "¿A quiénes considerarás como usuarios?", "¿Qué tipo de prueba o validación realizarás?"], placeholder: "Describe concretamente qué entregarás y qué cubrirá...", labelSalida: "Alcances del proyecto" },
  { id: 12, clave: "limitaciones", titulo: "Limitaciones", icono: "⚠️", descripcion: "Son restricciones reales del proyecto. No son excusas; son delimitaciones honestas que muestran claridad metodológica.", preguntas: ["¿Qué no podrás cubrir por falta de tiempo?", "¿Qué restricciones técnicas o de recursos tienes?", "¿El acceso a usuarios o datos tiene algún límite?", "¿Tu proyecto es un prototipo, una propuesta o un sistema completo?"], placeholder: "Describe honestamente qué no podrá cubrir este proyecto y por qué...", labelSalida: "Limitaciones del proyecto" }
];

const STORAGE_KEY = "constructor_metodologico_v1";
const AZUL = "#1A3A5C";
const TEAL = "#1B8EA6";
const GRIS = "#F5F6F8";
const BORDE = "#E2E5EA";
const MUTED = "#6B7280";
const BLANCO = "#FFFFFF";
const EXITO = "#15803D";
const EXITOCLARO = "#DCFCE7";
const WARN = "#B45309";
const WARNCLARO = "#FEF3C7";
const ERR = "#B91C1C";
const ERRCLARO = "#FEE2E2";
const TEALCLARO = "#E8F6FA";

async function llamarIA(prompt, sistema) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: sistema || "Eres un asistente académico especializado en metodología de investigación para estudiantes universitarios mexicanos. Escribe siempre en español académico formal, claro y comprensible. Usa solo la información que el estudiante proporcionó. No inventes datos. No uses markdown, asteriscos ni títulos con #. Solo párrafos bien estructurados.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

function Btn({ onClick, disabled, loading, variante = "prim", children, style = {} }) {
  const vs = {
    prim: { background: AZUL, color: BLANCO, border: "none" },
    sec: { background: BLANCO, color: AZUL, border: `1.5px solid ${AZUL}` },
    teal: { background: TEAL, color: BLANCO, border: "none" },
  }[variante];
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      padding: "8px 16px", borderRadius: 7, cursor: disabled || loading ? "not-allowed" : "pointer",
      fontSize: 13, fontWeight: 600, opacity: disabled || loading ? 0.6 : 1,
      transition: "all 0.2s", ...vs, ...style
    }}>{loading ? "⏳ Generando..." : children}</button>
  );
}

function Alert({ tipo, texto }) {
  const c = { info: [TEALCLARO, TEAL, "ℹ️"], exito: [EXITOCLARO, EXITO, "✅"], advertencia: [WARNCLARO, WARN, "⚠️"], error: [ERRCLARO, ERR, "❌"] }[tipo] || [GRIS, MUTED, "ℹ️"];
  return <div style={{ background: c[0], borderLeft: `4px solid ${c[1]}`, padding: "9px 13px", borderRadius: 6, marginBottom: 10, fontSize: 13, color: c[1], lineHeight: 1.5 }}>{c[2]} {texto}</div>;
}

function EtapaPanel({ etapa, datos, onUpdate, prevDatos }) {
  const [inp, setInp] = useState(datos?.input || "");
  const [draft, setDraft] = useState(datos?.borrador || "");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => { setInp(datos?.input || ""); setDraft(datos?.borrador || ""); setAlerts([]); }, [etapa.id]);

  const ctx = () => {
    const c = [];
    if (prevDatos.idea?.borrador) c.push(`IDEA: ${prevDatos.idea.borrador}`);
    if (prevDatos.delimitacion?.borrador) c.push(`TEMA DELIMITADO: ${prevDatos.delimitacion.borrador}`);
    if (prevDatos.problema?.borrador) c.push(`PROBLEMA: ${prevDatos.problema.borrador}`);
    if (prevDatos.planteamiento?.borrador) c.push(`PLANTEAMIENTO: ${prevDatos.planteamiento.borrador}`);
    if (prevDatos.titulo?.borrador) c.push(`TÍTULO: ${prevDatos.titulo.borrador}`);
    if (prevDatos.pregunta?.borrador) c.push(`PREGUNTA: ${prevDatos.pregunta.borrador}`);
    if (prevDatos.objetivo_general?.borrador) c.push(`OBJETIVO GENERAL: ${prevDatos.objetivo_general.borrador}`);
    return c.join("\n\n");
  };

  const prompts = {
    idea: (i) => `Un estudiante universitario describió su idea de proyecto: "${i}"\n\nRedacta una narrativa inicial del proyecto en 2-3 párrafos académicos. Refleja fielmente lo que dijo sin inventar datos. Empieza con el contexto general, describe qué quiere hacer y para quién, y finaliza con la relevancia que señala. Solo párrafos fluidos, sin encabezados.`,
    delimitacion: (i, c) => `${c}\n\nEl estudiante delimita su tema: "${i}"\n\nRedacta un párrafo que delimite el tema usando este formato: "El presente proyecto se orienta al [análisis/diseño/desarrollo/evaluación] de [qué] en [dónde], dirigido a [quiénes], con el propósito de [para qué]." Sé específico con los datos del estudiante.`,
    problema: (i, c) => `${c}\n\nEl estudiante describe el problema: "${i}"\n\nRedacta un párrafo que identifique el problema central: "El problema central identificado consiste en [descripción], debido a [causas], lo cual afecta a [quiénes] en [dónde]." No inventes datos.`,
    planteamiento: (i, c) => `${c}\n\nInformación del estudiante: "${i}"\n\nRedacta el planteamiento del problema en tres partes con estos subtítulos exactos:\n\nContexto general\n[Párrafo con panorama amplio y relevancia actual]\n\nProblema actual específico\n[Párrafo con qué ocurre, dónde, a quién afecta y evidencia]\n\nConsecuencias de no resolverlo\n[Párrafo con riesgos y efectos negativos]\n\nUsa solo los datos del estudiante.`,
    titulo: (i, c) => `${c}\n\nInformación adicional: "${i}"\n\nGenera UN título formal y académico para el proyecto. Debe ser afirmativo (nunca en forma de pregunta), contener qué se hará (diseñar/analizar/desarrollar/evaluar), mencionar el sistema o proceso, e indicar el contexto. Solo escribe el título, sin explicaciones.`,
    pregunta: (i, c) => `${c}\n\nEl estudiante propone: "${i}"\n\nGenera UNA pregunta de investigación que sea el equivalente interrogativo del título. Debe iniciar con ¿Cómo...?, ¿De qué manera...?, ¿Qué impacto...? o ¿En qué medida...? Sea específica, delimitada y no se responda con sí/no. Solo la pregunta entre signos de interrogación.`,
    objetivo_general: (i, c) => `${c}\n\nEl estudiante plantea: "${i}"\n\nRedacta el objetivo general. Debe iniciar con verbo en infinitivo (Diseñar/Analizar/Desarrollar/Evaluar/Implementar/Proponer), responder directamente a la pregunta de investigación, coincidir con el título y ser realizable. Solo el objetivo, sin explicaciones.`,
    objetivos_especificos: (i, c) => `${c}\n\nEl estudiante describe: "${i}"\n\nRedacta 4-5 objetivos específicos que sean pasos metodológicos (no funciones del sistema) con esta progresión: 1) Diagnosticar/identificar situación actual, 2) Analizar necesidades, 3) Diseñar propuesta, 4) Desarrollar/implementar, 5) Evaluar/validar. Cada uno con verbo en infinitivo. Numéralos del 1 al 5.`,
    justificacion: (i, c) => `${c}\n\nEl estudiante argumenta: "${i}"\n\nRedacta la justificación en 3 párrafos: 1) Por qué es importante (valor académico, social, técnico o institucional), 2) A quién beneficia y cómo, 3) Qué aportación concreta hace. No repitas el problema. No uses lenguaje emocional sin sustento.`,
    viabilidad: (i, c) => `${c}\n\nEl estudiante describe recursos: "${i}"\n\nRedacta la viabilidad del proyecto en las dimensiones que apliquen: viabilidad técnica, humana, económica, temporal y acceso a información. Sé honesto. Si el proyecto parece muy ambicioso para los recursos, señálalo.`,
    alcances: (i, c) => `${c}\n\nEl estudiante describe lo que cubrirá: "${i}"\n\nRedacta los alcances especificando: qué producto o resultado concreto se entregará (prototipo/sistema/propuesta/análisis), funciones o aspectos principales, a quiénes va dirigido, tipo de validación y nivel de profundidad. Sé concreto.`,
    limitaciones: (i, c) => `${c}\n\nEl estudiante describe restricciones: "${i}"\n\nRedacta las limitaciones indicando honestamente: restricciones de tiempo, limitaciones técnicas, restricciones de acceso a usuarios o datos, alcance académico real, dependencias externas. Las limitaciones muestran claridad metodológica, no son excusas.`
  };

  const generar = async () => {
    if (!inp.trim()) { setAlerts([{ tipo: "advertencia", texto: "Escribe alguna información antes de generar el borrador." }]); return; }
    setLoading(true); setAlerts([]);
    try {
      const fn = prompts[etapa.clave];
      const result = await llamarIA(fn ? fn(inp, ctx()) : `Genera contenido para ${etapa.titulo}: ${inp}`);
      setDraft(result);
      onUpdate(etapa.clave, { input: inp, borrador: result });
      setAlerts([{ tipo: "exito", texto: "Borrador generado. Revísalo y edita lo que necesites." }]);
    } catch (e) { setAlerts([{ tipo: "error", texto: `Error al conectar con la IA: ${e.message}` }]); }
    setLoading(false);
  };

  const mejorar = async () => {
    if (!draft.trim()) { setAlerts([{ tipo: "advertencia", texto: "Primero genera un borrador o escribe algo en el área de resultado." }]); return; }
    setLoading(true); setAlerts([]);
    try {
      const result = await llamarIA(`Mejora la redacción de este texto académico para la sección "${etapa.titulo}" de un proyecto de investigación universitario:\n\n"${draft}"\n\nMantén exactamente el mismo contenido. Solo mejora claridad y fluidez académica. Devuelve solo el texto mejorado, sin explicaciones.`);
      setDraft(result);
      onUpdate(etapa.clave, { input: inp, borrador: result });
      setAlerts([{ tipo: "exito", texto: "Redacción mejorada." }]);
    } catch (e) { setAlerts([{ tipo: "error", texto: `Error: ${e.message}` }]); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: `${AZUL}08`, border: `1px solid ${TEAL}25`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <h2 style={{ color: AZUL, fontSize: 18, fontWeight: 700, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
          <span>{etapa.icono}</span> Etapa {etapa.id} — {etapa.titulo}
        </h2>
        <p style={{ color: MUTED, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{etapa.descripcion}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div>
          <div style={{ background: TEALCLARO, border: `1px solid ${TEAL}25`, borderRadius: 8, padding: "0.9rem 1rem", marginBottom: "0.9rem" }}>
            <p style={{ color: TEAL, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.6rem" }}>Preguntas detonadoras</p>
            {etapa.preguntas.map((p, i) => (
              <p key={i} style={{ color: AZUL, fontSize: 12.5, lineHeight: 1.5, margin: "0 0 0.4rem" }}>
                <strong style={{ color: TEAL }}>{i + 1}.</strong> {p}
              </p>
            ))}
          </div>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: AZUL, marginBottom: 5 }}>Tu información</label>
          <textarea value={inp} onChange={e => { setInp(e.target.value); onUpdate(etapa.clave, { input: e.target.value, borrador: draft }); }}
            placeholder={etapa.placeholder}
            style={{ width: "100%", minHeight: 160, padding: "10px 12px", border: `1.5px solid ${BORDE}`, borderRadius: 7, fontSize: 13, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", outline: "none", color: "#1a1a1a" }} />
          <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
            <Btn onClick={generar} loading={loading} variante="prim">✨ Generar borrador</Btn>
            <Btn onClick={mejorar} loading={loading} variante="sec">✍️ Mejorar redacción</Btn>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: AZUL, marginBottom: 5 }}>
            {etapa.labelSalida} <span style={{ color: MUTED, fontWeight: 400 }}>— editable</span>
          </label>
          <textarea value={draft} onChange={e => { setDraft(e.target.value); onUpdate(etapa.clave, { input: inp, borrador: e.target.value }); }}
            placeholder="El borrador aparecerá aquí. También puedes escribir directamente..."
            style={{ width: "100%", minHeight: 240, padding: "10px 12px", border: `1.5px solid ${BORDE}`, borderRadius: 7, fontSize: 13, lineHeight: 1.8, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", outline: "none", color: "#1a1a1a", background: draft ? "#FAFFFE" : BLANCO }} />
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <Btn onClick={() => { onUpdate(etapa.clave, { input: inp, borrador: draft }); setAlerts([{ tipo: "exito", texto: "Guardado." }]); }} variante="teal" style={{ fontSize: 12, padding: "6px 12px" }}>💾 Guardar</Btn>
            {draft && <span style={{ fontSize: 12, color: EXITO }}>✓ {draft.trim().split(/\s+/).length} palabras</span>}
          </div>
        </div>
      </div>

      {alerts.length > 0 && <div style={{ marginTop: "0.9rem" }}>{alerts.map((a, i) => <Alert key={i} tipo={a.tipo} texto={a.texto} />)}</div>}
    </div>
  );
}

function CoherenciaPanel({ datos }) {
  const [analisis, setAnalisis] = useState("");
  const [loading, setLoading] = useState(false);
  const tiene = k => !!datos[k]?.borrador?.trim();
  const items = [
    { el: "Idea inicial / narrativa", ok: tiene("idea"), rel: "Tema delimitado" },
    { el: "Tema delimitado", ok: tiene("delimitacion"), rel: "Problema central" },
    { el: "Problema central", ok: tiene("problema"), rel: "Planteamiento" },
    { el: "Planteamiento del problema", ok: tiene("planteamiento"), rel: "Título" },
    { el: "Título del proyecto", ok: tiene("titulo"), rel: "Pregunta" },
    { el: "Pregunta de investigación", ok: tiene("pregunta"), rel: "Objetivo general" },
    { el: "Objetivo general", ok: tiene("objetivo_general"), rel: "Objetivos específicos" },
    { el: "Objetivos específicos", ok: tiene("objetivos_especificos"), rel: "Justificación" },
    { el: "Justificación", ok: tiene("justificacion"), rel: "Viabilidad" },
    { el: "Viabilidad", ok: tiene("viabilidad"), rel: "Alcances" },
    { el: "Alcances", ok: tiene("alcances"), rel: "Limitaciones" },
    { el: "Limitaciones", ok: tiene("limitaciones"), rel: "—" },
  ];
  const completas = items.filter(i => i.ok).length;

  const analizar = async () => {
    const secs = Object.entries({ "Narrativa inicial": datos.idea?.borrador, "Tema delimitado": datos.delimitacion?.borrador, "Problema central": datos.problema?.borrador, "Planteamiento": datos.planteamiento?.borrador, "Título": datos.titulo?.borrador, "Pregunta de investigación": datos.pregunta?.borrador, "Objetivo general": datos.objetivo_general?.borrador, "Objetivos específicos": datos.objetivos_especificos?.borrador, "Justificación": datos.justificacion?.borrador, "Viabilidad": datos.viabilidad?.borrador, "Alcances": datos.alcances?.borrador, "Limitaciones": datos.limitaciones?.borrador }).filter(([, v]) => v?.trim()).map(([k, v]) => `${k}:\n${v}`).join("\n\n---\n\n");
    if (!secs) { setAnalisis("Completa al menos las primeras 5 etapas para poder analizar la coherencia."); return; }
    setLoading(true);
    try {
      const result = await llamarIA(`Analiza la coherencia metodológica de este Capítulo 1:\n\n${secs}\n\nRevisa: 1) ¿El título coincide con el problema y enfoque? 2) ¿La pregunta es el equivalente interrogativo del título? 3) ¿El objetivo general responde la pregunta? 4) ¿Los objetivos específicos son pasos metodológicos, no funciones del sistema? 5) ¿El planteamiento tiene las tres fases? 6) ¿Los alcances son coherentes con la viabilidad? 7) ¿Las limitaciones son honestas?\n\nPara cada punto señala si está bien, qué debilidades hay y qué mejorar. Sé docente y constructivo. Usa lenguaje claro para estudiantes universitarios. No uses markdown.`, "Eres un asesor académico experto en metodología de investigación. Tu análisis es constructivo, específico y orientador.");
      setAnalisis(result);
    } catch (e) { setAnalisis(`Error: ${e.message}`); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: `${AZUL}08`, border: `1px solid ${TEAL}25`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <h2 style={{ color: AZUL, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>🔗 Revisión de coherencia metodológica</h2>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Verifica que todos los elementos estén completos y sean coherentes entre sí.</p>
      </div>

      <div style={{ background: completas === 12 ? EXITOCLARO : WARNCLARO, border: `1px solid ${completas === 12 ? EXITO : WARN}30`, borderRadius: 8, padding: "10px 14px", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: completas === 12 ? EXITO : WARN }}>
          {completas === 12 ? "✅ Todas las secciones completadas" : `⚠️ ${completas} de 12 secciones completadas`}
        </span>
        <span style={{ fontSize: 12, color: MUTED }}>{12 - completas > 0 ? `Faltan ${12 - completas}` : "Listo"}</span>
      </div>

      <div style={{ border: `1px solid ${BORDE}`, borderRadius: 8, overflow: "hidden", marginBottom: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: AZUL }}>
              <th style={{ padding: "8px 12px", textAlign: "left", color: BLANCO, fontWeight: 600 }}>Elemento</th>
              <th style={{ padding: "8px 12px", textAlign: "center", color: BLANCO, fontWeight: 600 }}>Estado</th>
              <th style={{ padding: "8px 12px", textAlign: "left", color: BLANCO, fontWeight: 600 }}>Se relaciona con</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? BLANCO : GRIS }}>
                <td style={{ padding: "7px 12px", color: AZUL, fontWeight: 500 }}>{f.el}</td>
                <td style={{ padding: "7px 12px", textAlign: "center" }}>
                  <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: f.ok ? EXITOCLARO : ERRCLARO, color: f.ok ? EXITO : ERR }}>{f.ok ? "✓ Completo" : "Pendiente"}</span>
                </td>
                <td style={{ padding: "7px 12px", color: MUTED }}>{f.rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Btn onClick={analizar} loading={loading} variante="prim">🔍 Analizar coherencia con IA</Btn>

      {analisis && (
        <div style={{ marginTop: "1rem", background: TEALCLARO, border: `1px solid ${TEAL}30`, borderRadius: 8, padding: "1rem 1.25rem" }}>
          <p style={{ color: TEAL, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.6rem" }}>Análisis de coherencia</p>
          <p style={{ color: "#1a1a1a", fontSize: 13.5, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{analisis}</p>
        </div>
      )}
    </div>
  );
}

function Cap1Panel({ datos, nombreProyecto, nombreEstudiante }) {
  const [copiado, setCopiado] = useState(false);
  const b = k => datos[k]?.borrador?.trim() || "";

  const texto = `CAPÍTULO 1. PLANTEAMIENTO DEL PROYECTO\n\nProyecto: ${nombreProyecto || "[Sin título]"}\nEstudiante: ${nombreEstudiante || "[Sin nombre]"}\n\n1.1 PLANTEAMIENTO DEL PROBLEMA\n\n${b("planteamiento") || "[Pendiente]"}\n\n1.2 PREGUNTA DE INVESTIGACIÓN\n\n${b("pregunta") || "[Pendiente]"}\n\n1.3 JUSTIFICACIÓN\n\n${b("justificacion") || "[Pendiente]"}\n\n1.4 OBJETIVO GENERAL\n\n${b("objetivo_general") || "[Pendiente]"}\n\n1.5 OBJETIVOS ESPECÍFICOS\n\n${b("objetivos_especificos") || "[Pendiente]"}\n\n1.6 VIABILIDAD\n\n${b("viabilidad") || "[Pendiente]"}\n\n1.7 ALCANCES\n\n${b("alcances") || "[Pendiente]"}\n\n1.8 LIMITACIONES\n\n${b("limitaciones") || "[Pendiente]"}`;

  const copiar = async () => { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 2500); };
  const descargar = () => {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Cap1_${(nombreEstudiante || "proyecto").replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const Sec = ({ num, titulo, clave }) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ color: AZUL, fontSize: 14, fontWeight: 700, borderBottom: `2px solid ${TEAL}`, paddingBottom: 6, marginBottom: 10 }}>{num} {titulo}</h3>
      {b(clave) ? <p style={{ fontSize: 13.5, lineHeight: 1.9, color: "#1a1a1a", margin: 0, whiteSpace: "pre-line" }}>{b(clave)}</p>
        : <p style={{ fontSize: 13, color: MUTED, fontStyle: "italic", margin: 0 }}>Pendiente de completar</p>}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ color: AZUL, fontSize: 18, fontWeight: 700, margin: "0 0 3px" }}>📄 Vista previa del Capítulo 1</h2>
          <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Documento final. Puedes copiar el texto o descargarlo.</p>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <Btn onClick={copiar} variante="sec">{copiado ? "✅ Copiado" : "📋 Copiar texto"}</Btn>
          <Btn onClick={descargar} variante="prim">⬇️ Descargar .txt</Btn>
        </div>
      </div>

      <div style={{ background: BLANCO, border: `1px solid ${BORDE}`, borderRadius: 10, padding: "1.75rem 2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${BORDE}` }}>
          <h1 style={{ color: AZUL, fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>CAPÍTULO 1. PLANTEAMIENTO DEL PROYECTO</h1>
          <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>{nombreProyecto || "[Sin título de proyecto]"}<br />{nombreEstudiante || "[Sin nombre de estudiante]"}</p>
        </div>
        <Sec num="1.1" titulo="Planteamiento del problema" clave="planteamiento" />
        <Sec num="1.2" titulo="Pregunta de investigación" clave="pregunta" />
        <Sec num="1.3" titulo="Justificación" clave="justificacion" />
        <Sec num="1.4" titulo="Objetivo general" clave="objetivo_general" />
        <Sec num="1.5" titulo="Objetivos específicos" clave="objetivos_especificos" />
        <Sec num="1.6" titulo="Viabilidad" clave="viabilidad" />
        <Sec num="1.7" titulo="Alcances" clave="alcances" />
        <Sec num="1.8" titulo="Limitaciones" clave="limitaciones" />
      </div>
    </div>
  );
}

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [etapa, setEtapa] = useState(1);
  const [nombre, setNombre] = useState("");
  const [estudiante, setEstudiante] = useState("");
  const [datos, setDatos] = useState({});

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const p = JSON.parse(s);
        setNombre(p.nombre || ""); setEstudiante(p.estudiante || ""); setDatos(p.datos || {});
        if (p.pantalla === "app") { setPantalla("app"); setEtapa(p.etapa || 1); }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (pantalla === "app") try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ pantalla, nombre, estudiante, datos, etapa })); } catch {}
  }, [pantalla, nombre, estudiante, datos, etapa]);

  const update = useCallback((clave, val) => setDatos(prev => ({ ...prev, [clave]: val })), []);
  const completadas = ETAPAS.filter(e => datos[e.clave]?.borrador?.trim()).length;
  const pct = Math.round((completadas / 12) * 100);
  const etapaObj = ETAPAS.find(e => e.id === etapa);

  if (pantalla === "inicio") return (
    <div style={{ minHeight: "100vh", background: GRIS, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ background: BLANCO, borderRadius: 14, padding: "2.5rem", maxWidth: 580, width: "100%", border: `1px solid ${BORDE}`, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: 66, height: 66, borderRadius: 14, background: `linear-gradient(135deg, ${AZUL}, ${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 1.25rem" }}>📚</div>
          <h1 style={{ color: AZUL, fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Constructor Metodológico</h1>
          <h2 style={{ color: TEAL, fontSize: 15, fontWeight: 500, margin: 0 }}>Capítulo 1 — Planteamiento del proyecto</h2>
        </div>
        <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.7, marginBottom: "1.75rem", textAlign: "center" }}>
          Herramienta guiada para construir el Capítulo 1 de tu proyecto de investigación paso a paso, con asistencia de inteligencia artificial.
        </p>
        <div style={{ marginBottom: "0.9rem" }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: AZUL, marginBottom: 5 }}>Nombre del estudiante</label>
          <input type="text" value={estudiante} onChange={e => setEstudiante(e.target.value)} placeholder="Escribe tu nombre completo" style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1.5px solid ${BORDE}`, fontSize: 13.5, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: AZUL, marginBottom: 5 }}>Título tentativo o tema del proyecto</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Sistema de gestión de inventario para PYMES" style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1.5px solid ${BORDE}`, fontSize: 13.5, boxSizing: "border-box", outline: "none" }} />
        </div>
        <Btn onClick={() => setPantalla("app")} variante="prim" style={{ width: "100%", padding: "11px 18px", fontSize: 14 }}>🚀 Comenzar a construir mi Capítulo 1</Btn>
        <p style={{ textAlign: "center", fontSize: 11.5, color: MUTED, margin: "10px 0 0" }}>Tu avance se guarda automáticamente en este navegador</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: GRIS, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <div style={{ background: AZUL, padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📚</span>
          <div>
            <p style={{ color: BLANCO, fontSize: 14, fontWeight: 700, margin: 0 }}>Constructor Metodológico — Capítulo 1</p>
            <p style={{ color: `${BLANCO}80`, fontSize: 11.5, margin: 0 }}>{estudiante || "Estudiante"} · {nombre || "Proyecto de investigación"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: `${BLANCO}20`, color: BLANCO, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>{completadas}/12 · {pct}%</span>
          <button onClick={() => { if (window.confirm("¿Reiniciar todo el progreso?")) { localStorage.removeItem(STORAGE_KEY); setDatos({}); setPantalla("inicio"); } }} style={{ background: "transparent", border: `1px solid ${BLANCO}35`, color: `${BLANCO}80`, padding: "3px 9px", borderRadius: 5, cursor: "pointer", fontSize: 11.5 }}>↩ Reiniciar</button>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "1.25rem 1.5rem" }}>
        {/* Barra de progreso */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ height: 5, background: BORDE, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${TEAL}, ${AZUL})`, borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Nav etapas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "1.25rem" }}>
          {ETAPAS.map(e => {
            const ok = !!datos[e.clave]?.borrador?.trim();
            const act = etapa === e.id;
            return (
              <button key={e.id} onClick={() => setEtapa(e.id)} title={e.titulo} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, background: act ? TEAL : ok ? EXITOCLARO : GRIS, color: act ? BLANCO : ok ? EXITO : MUTED, outline: act ? `2px solid ${TEAL}` : "none", outlineOffset: 2 }}>
                {ok && !act ? "✓" : e.id}
              </button>
            );
          })}
          <button onClick={() => setEtapa(13)} style={{ padding: "0 10px", height: 32, borderRadius: 16, border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, background: etapa === 13 ? AZUL : GRIS, color: etapa === 13 ? BLANCO : MUTED }}>🔗 Coherencia</button>
          <button onClick={() => setEtapa(14)} style={{ padding: "0 10px", height: 32, borderRadius: 16, border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, background: etapa === 14 ? AZUL : GRIS, color: etapa === 14 ? BLANCO : MUTED }}>📄 Capítulo 1</button>
        </div>

        <div style={{ background: BLANCO, borderRadius: 12, padding: "1.5rem", border: `1px solid ${BORDE}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {etapa >= 1 && etapa <= 12 && etapaObj && (
            <>
              <EtapaPanel etapa={etapaObj} datos={datos[etapaObj.clave] || {}} onUpdate={update} prevDatos={datos} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: `1px solid ${BORDE}` }}>
                <Btn onClick={() => setEtapa(v => Math.max(1, v - 1))} variante="sec" disabled={etapa === 1}>← Etapa anterior</Btn>
                <Btn onClick={() => setEtapa(v => v < 12 ? v + 1 : 13)} variante="prim">{etapa === 12 ? "Ir a coherencia →" : "Siguiente etapa →"}</Btn>
              </div>
            </>
          )}
          {etapa === 13 && <CoherenciaPanel datos={datos} />}
          {etapa === 14 && <Cap1Panel datos={datos} nombreProyecto={nombre} nombreEstudiante={estudiante} />}
        </div>
      </div>
    </div>
  );
}
