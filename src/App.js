import { useState, useEffect, useCallback } from "react";
 
const ETAPAS = [
  { id: 1, clave: "idea", titulo: "Idea inicial del proyecto", icono: "💡", descripcion: "Cuéntanos con tus propias palabras de qué trata tu proyecto. No hay respuesta incorrecta; lo importante es que te expreses con libertad.", preguntas: ["¿Qué quieres hacer o lograr con este proyecto?", "¿Qué tema o situación te interesa o llamó tu atención?", "¿Qué quisieras mejorar, resolver, analizar, diseñar o desarrollar?", "¿A quién le serviría o beneficiaría?", "¿En qué lugar o contexto ocurriría?", "¿Por qué te parece importante hacerlo?"], placeholder: "Escribe aquí tu idea con tus propias palabras. Puedes escribir de manera informal; después la transformaremos en lenguaje académico...", labelSalida: "Narrativa inicial del proyecto" },
  { id: 2, clave: "delimitacion", titulo: "Delimitación del tema", icono: "🎯", descripcion: "Una buena investigación no puede abarcar todo. Aquí precisamos exactamente de qué trata tu proyecto: qué aspecto, a quién involucra, dónde y cuándo.", preguntas: ["¿Cuál es el tema general de tu proyecto?", "¿Qué aspecto específico de ese tema abordarás?", "¿A quiénes involucra o afecta?", "¿Dónde ocurre o se aplicará?", "¿En qué periodo de tiempo?", "¿Qué vas a producir, analizar o desarrollar concretamente?"], placeholder: "Describe con precisión el alcance de tu proyecto: tema, subtema, quiénes, dónde y qué vas a producir...", labelSalida: "Tema delimitado" },
  { id: 3, clave: "problema", titulo: "Detección del problema", icono: "🔍", descripcion: "El problema es la situación que justifica tu proyecto. Es algo real que existe y que tu proyecto puede ayudar a atender.", preguntas: ["¿Qué situación no está funcionando bien o puede mejorar?", "¿Qué necesidad existe actualmente?", "¿Qué dificultad enfrentan las personas involucradas?", "¿Qué proceso es lento, ineficiente, confuso o limitado?", "¿Qué evidencia muestra que esa situación existe?", "¿Qué consecuencias puede haber si no se atiende?"], placeholder: "Describe la situación problemática que observaste o identificaste...", labelSalida: "Problema central identificado" },
  { id: 4, clave: "planteamiento", titulo: "Planteamiento del problema", icono: "📋", descripcion: "El planteamiento del problema desarrolla en tres partes la situación que quieres atender. Las tres partes son obligatorias.", preguntas: ["PARTE 1 — Contexto general: panorama amplio del tema, relevancia actual, antecedentes", "PARTE 2 — Problema específico: qué ocurre, dónde, a quién afecta, evidencia", "PARTE 3 — Consecuencias: qué puede pasar si el problema no se atiende"], placeholder: "Escribe la información para las tres partes. Puedes usar los encabezados: PARTE 1 / PARTE 2 / PARTE 3...", labelSalida: "Planteamiento del problema (tres fases)" },
  { id: 5, clave: "titulo", titulo: "Título del proyecto", icono: "📌", descripcion: "El título debe ser afirmativo, claro y académico. No se redacta como pregunta. Debe decir qué vas a hacer, sobre qué y con qué propósito.", preguntas: ["¿Qué acción realizarás: diseñarás, analizarás, desarrollarás, evaluarás?", "¿Sobre qué fenómeno, proceso, sistema o tecnología?", "¿Para quién o en qué contexto?"], placeholder: "Puedes proponer un título o esperar a que la IA lo genere con el prompt...", labelSalida: "Título del proyecto" },
  { id: 6, clave: "pregunta", titulo: "Pregunta de investigación", icono: "❓", descripcion: "La pregunta lleva al plano interrogativo lo que el título plantea en afirmación. Debe poder responderse con el proyecto.", preguntas: ["¿Tu pregunta inicia con: Cómo, De qué manera, Qué impacto, En qué medida...?", "¿Es lo suficientemente específica para poder responderse?", "¿Está alineada con el título y con el problema?"], placeholder: "Escribe tu propuesta de pregunta de investigación...", labelSalida: "Pregunta de investigación" },
  { id: 7, clave: "objetivo_general", titulo: "Objetivo general", icono: "🎯", descripcion: "El objetivo general responde directamente a la pregunta de investigación e inicia con un verbo en infinitivo.", preguntas: ["¿El verbo describe lo que harás: Diseñar, Analizar, Desarrollar, Evaluar?", "¿Puede lograrse en el tiempo y con los recursos que tienes?", "¿Coincide exactamente con lo que propone el título?"], placeholder: "Escribe tu propuesta de objetivo general...", labelSalida: "Objetivo general" },
  { id: 8, clave: "objetivos_especificos", titulo: "Objetivos específicos", icono: "📊", descripcion: "Son los pasos metodológicos para lograr el objetivo general. No son funciones del sistema.", preguntas: ["¿Tienes uno para diagnosticar la situación actual?", "¿Tienes uno para analizar necesidades?", "¿Tienes uno para diseñar o proponer?", "¿Tienes uno para desarrollar o implementar?", "¿Tienes uno para evaluar o validar?"], placeholder: "Escribe los objetivos específicos numerados, uno por línea...", labelSalida: "Objetivos específicos" },
  { id: 9, clave: "justificacion", titulo: "Justificación", icono: "⚖️", descripcion: "Responde por qué vale la pena realizar este proyecto. No repite el problema; argumenta el valor y el beneficio.", preguntas: ["¿Por qué es importante realizarlo ahora?", "¿A quién beneficia directamente y cómo?", "¿Qué valor académico, social, técnico o institucional aporta?", "¿Qué ofrece frente a lo que ya existe?"], placeholder: "Argumenta por qué tu proyecto vale la pena...", labelSalida: "Justificación" },
  { id: 10, clave: "viabilidad", titulo: "Viabilidad", icono: "✅", descripcion: "Demuestra que el proyecto puede realizarse con los recursos disponibles: tiempo, conocimiento, herramientas, acceso y presupuesto.", preguntas: ["¿Cuentas con los conocimientos técnicos necesarios?", "¿Tienes acceso a las herramientas o software requeridos?", "¿Puedes completarlo en el tiempo del semestre?", "¿Tienes acceso a los usuarios o datos que necesitas?"], placeholder: "Describe los recursos con los que cuentas...", labelSalida: "Viabilidad del proyecto" },
  { id: 11, clave: "alcances", titulo: "Alcances", icono: "📏", descripcion: "Indica qué sí se realizará, qué se construirá y hasta dónde llegará el proyecto. Son compromisos concretos.", preguntas: ["¿Qué producto o resultado concreto entregarás?", "¿Cuáles son los aspectos principales que cubrirás?", "¿A quiénes considerarás como usuarios?", "¿Qué tipo de prueba o validación realizarás?"], placeholder: "Describe concretamente qué entregarás y qué cubrirá...", labelSalida: "Alcances del proyecto" },
  { id: 12, clave: "limitaciones", titulo: "Limitaciones", icono: "⚠️", descripcion: "Son restricciones reales del proyecto. Son delimitaciones honestas que muestran claridad metodológica.", preguntas: ["¿Qué no podrás cubrir por falta de tiempo?", "¿Qué restricciones técnicas o de recursos tienes?", "¿El acceso a usuarios o datos tiene algún límite?", "¿Tu proyecto es un prototipo, una propuesta o un sistema completo?"], placeholder: "Describe honestamente qué no podrá cubrir este proyecto y por qué...", labelSalida: "Limitaciones del proyecto" }
];
 
const SK = "cmv2";
const A = "#1A3A5C", T = "#1B8EA6", G = "#F5F6F8", B = "#E2E5EA", M = "#6B7280", W = "#FFFFFF";
const EX = "#15803D", EXC = "#DCFCE7", WN = "#B45309", WNC = "#FEF3C7", ER = "#B91C1C", ERC = "#FEE2E2", TC = "#E8F6FA";
 
// Genera el prompt listo para copiar y pegar en Claude.ai, con los datos del alumno ya incluidos
function generarPrompt(etapa, inp, prevDatos) {
  const ctx = [];
  if (prevDatos.idea?.borrador) ctx.push(`IDEA DEL PROYECTO: ${prevDatos.idea.borrador}`);
  if (prevDatos.delimitacion?.borrador) ctx.push(`TEMA DELIMITADO: ${prevDatos.delimitacion.borrador}`);
  if (prevDatos.problema?.borrador) ctx.push(`PROBLEMA CENTRAL: ${prevDatos.problema.borrador}`);
  if (prevDatos.planteamiento?.borrador) ctx.push(`PLANTEAMIENTO: ${prevDatos.planteamiento.borrador}`);
  if (prevDatos.titulo?.borrador) ctx.push(`TÍTULO: ${prevDatos.titulo.borrador}`);
  if (prevDatos.pregunta?.borrador) ctx.push(`PREGUNTA: ${prevDatos.pregunta.borrador}`);
  if (prevDatos.objetivo_general?.borrador) ctx.push(`OBJETIVO GENERAL: ${prevDatos.objetivo_general.borrador}`);
  const c = ctx.join("\n\n");
 
  const prompts = {
    idea: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal. No uses markdown, asteriscos ni encabezados con #. Solo párrafos bien estructurados.\n\nUn estudiante universitario describió su idea de proyecto con estas palabras:\n\n"${inp}"\n\nRedacta una narrativa inicial del proyecto en 2-3 párrafos académicos. Refleja fielmente lo que dijo sin inventar datos. Empieza con el contexto general, describe qué quiere hacer y para quién, y finaliza con la relevancia que señala el estudiante.`,
    delimitacion: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal. No uses markdown ni encabezados.\n\n${c}\n\nEl estudiante proporcionó esta información para delimitar su tema:\n\n"${inp}"\n\nRedacta un párrafo que delimite el tema usando este formato: "El presente proyecto se orienta al [análisis/diseño/desarrollo/evaluación] de [qué] en [dónde], dirigido a [quiénes], con el propósito de [para qué]." Sé específico con los datos del estudiante.`,
    problema: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal. No uses markdown ni encabezados.\n\n${c}\n\nEl estudiante describió el problema así:\n\n"${inp}"\n\nRedacta un párrafo que identifique el problema central con este formato: "El problema central identificado consiste en [descripción], debido a [causas], lo cual afecta a [quiénes] en [dónde]." No inventes datos.`,
    planteamiento: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal. No uses markdown ni encabezados con #.\n\n${c}\n\nEl estudiante proporcionó esta información:\n\n"${inp}"\n\nRedacta el planteamiento del problema en tres partes con estos subtítulos exactos (sin #, sin negritas):\n\nContexto general\n[Párrafo con panorama amplio y relevancia actual]\n\nProblema actual específico\n[Párrafo con qué ocurre, dónde, a quién afecta y evidencia]\n\nConsecuencias de no resolverlo\n[Párrafo con riesgos y efectos negativos]\n\nUsa solo los datos del estudiante. No inventes estadísticas ni fuentes.`,
    titulo: () => `Eres un asistente académico especializado en metodología de investigación universitaria.\n\n${c}\n\nInformación adicional del estudiante:\n\n"${inp}"\n\nGenera UN título formal y académico para el proyecto de investigación. El título debe:\n- Ser afirmativo (nunca en forma de pregunta)\n- Contener qué se hará (diseñar, analizar, desarrollar, evaluar, implementar)\n- Mencionar el sistema, proceso o fenómeno\n- Indicar el contexto o población\n\nEscribe solo el título, sin explicaciones ni signos adicionales.`,
    pregunta: () => `Eres un asistente académico especializado en metodología de investigación universitaria.\n\n${c}\n\nEl estudiante propone o comenta sobre la pregunta:\n\n"${inp}"\n\nGenera UNA pregunta de investigación que:\n- Sea el equivalente interrogativo del título\n- Inicie con ¿Cómo...?, ¿De qué manera...?, ¿Qué impacto...? o ¿En qué medida...?\n- Sea específica y delimitada\n- No se responda con sí o no\n\nEscribe solo la pregunta entre signos de interrogación, sin explicaciones.`,
    objetivo_general: () => `Eres un asistente académico especializado en metodología de investigación universitaria.\n\n${c}\n\nEl estudiante plantea:\n\n"${inp}"\n\nRedacta el objetivo general del proyecto. Debe:\n- Iniciar con verbo en infinitivo (Diseñar, Analizar, Desarrollar, Evaluar, Implementar, Proponer)\n- Responder directamente a la pregunta de investigación\n- Coincidir con el título\n- Ser realizable con los recursos de un estudiante universitario\n\nEscribe solo el objetivo, sin explicaciones.`,
    objetivos_especificos: () => `Eres un asistente académico especializado en metodología de investigación universitaria.\n\n${c}\n\nEl estudiante describe:\n\n"${inp}"\n\nRedacta exactamente 5 objetivos específicos que sean pasos metodológicos (no funciones del sistema) con esta progresión:\n1) Diagnosticar o identificar la situación actual\n2) Analizar necesidades o requerimientos\n3) Diseñar la propuesta o sistema\n4) Desarrollar o implementar\n5) Evaluar o validar resultados\n\nCada uno debe iniciar con verbo en infinitivo. Numéralos del 1 al 5. Un objetivo por línea.`,
    justificacion: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal, sin markdown.\n\n${c}\n\nEl estudiante argumenta la justificación así:\n\n"${inp}"\n\nRedacta la justificación del proyecto en 3 párrafos:\n1. Por qué es importante (valor académico, social, técnico o institucional)\n2. A quién beneficia directamente y cómo\n3. Qué aportación concreta hace frente a la situación actual\n\nNo repitas el planteamiento del problema. No uses lenguaje emocional sin sustento.`,
    viabilidad: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal, sin markdown.\n\n${c}\n\nEl estudiante describe los recursos disponibles:\n\n"${inp}"\n\nRedacta la viabilidad del proyecto cubriendo las dimensiones que apliquen: viabilidad técnica, humana, económica, temporal y acceso a información. Sé honesto. Si el proyecto parece muy ambicioso para los recursos descritos, señálalo con una nota al final.`,
    alcances: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal, sin markdown.\n\n${c}\n\nEl estudiante describe qué cubrirá el proyecto:\n\n"${inp}"\n\nRedacta los alcances especificando: qué producto o resultado concreto se entregará (prototipo, sistema funcional, propuesta, análisis), funciones o aspectos principales, a quiénes va dirigido, tipo de validación y nivel de profundidad. Sé concreto y no prometas más de lo que la viabilidad permite.`,
    limitaciones: () => `Eres un asistente académico especializado en metodología de investigación universitaria. Escribe en español académico formal, sin markdown.\n\n${c}\n\nEl estudiante describe las restricciones de su proyecto:\n\n"${inp}"\n\nRedacta las limitaciones indicando honestamente: restricciones de tiempo, limitaciones técnicas o de recursos, restricciones de acceso a usuarios o datos, alcance académico real (prototipo, propuesta, análisis preliminar), dependencias externas. Las limitaciones muestran claridad metodológica.`
  };
 
  const fn = prompts[etapa.clave];
  return fn ? fn() : `Genera contenido académico para la sección "${etapa.titulo}" de un proyecto de investigación universitario.\n\nInformación del estudiante: "${inp}"`;
}
 
function Btn({ onClick, disabled, variante = "prim", children, style: s = {} }) {
  const vs = {
    prim: { background: A, color: W, border: "none" },
    sec: { background: W, color: A, border: `1.5px solid ${A}` },
    teal: { background: T, color: W, border: "none" },
    verde: { background: EX, color: W, border: "none" },
  }[variante];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "8px 15px", borderRadius: 7, cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 12.5, fontWeight: 600, opacity: disabled ? 0.6 : 1, ...vs, ...s
    }}>{children}</button>
  );
}
 
function Alrt({ tipo, texto }) {
  const c = { info: [TC, T, "ℹ️"], exito: [EXC, EX, "✅"], advertencia: [WNC, WN, "⚠️"], error: [ERC, ER, "❌"] }[tipo] || [G, M, "ℹ️"];
  return <div style={{ background: c[0], borderLeft: `4px solid ${c[1]}`, padding: "8px 12px", borderRadius: 5, marginBottom: 8, fontSize: 12.5, color: c[1], lineHeight: 1.5 }}>{c[2]} {texto}</div>;
}
 
function ModalPrompt({ prompt, onCerrar }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard.writeText(prompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
      <div style={{ background: W, borderRadius: 12, padding: "1.5rem", maxWidth: 640, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ color: A, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>📋 Prompt listo para copiar</h3>
            <p style={{ color: M, fontSize: 12.5, margin: 0 }}>Copia este texto, ábrelo en Claude.ai o ChatGPT, pégalo y presiona Enter.</p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: M, padding: "0 4px" }}>✕</button>
        </div>
 
        <div style={{ background: G, border: `1px solid ${B}`, borderRadius: 8, padding: "1rem", overflowY: "auto", flex: 1, marginBottom: "1rem" }}>
          <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#1a1a1a", fontFamily: "inherit" }}>{prompt}</pre>
        </div>
 
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn onClick={onCerrar} variante="sec">Cerrar</Btn>
          <Btn onClick={copiar} variante="verde">
            {copiado ? "✅ ¡Copiado!" : "📋 Copiar prompt"}
          </Btn>
        </div>
 
        <p style={{ color: M, fontSize: 11.5, margin: "10px 0 0", textAlign: "center" }}>
          Después de obtener la respuesta de la IA, pégala en el campo de resultado de la derecha.
        </p>
      </div>
    </div>
  );
}
 
function EtapaPanel({ etapa, datos, onUpdate, prevDatos }) {
  const [inp, setInp] = useState(datos?.input || "");
  const [draft, setDraft] = useState(datos?.borrador || "");
  const [alerts, setAlerts] = useState([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptTexto, setPromptTexto] = useState("");
 
  useEffect(() => {
    setInp(datos?.input || "");
    setDraft(datos?.borrador || "");
    setAlerts([]);
    setPromptVisible(false);
  }, [etapa.id]); // eslint-disable-line react-hooks/exhaustive-deps
 
  const mostrarPrompt = () => {
    if (!inp.trim()) {
      setAlerts([{ tipo: "advertencia", texto: "Escribe alguna información antes de generar el prompt." }]);
      return;
    }
    const p = generarPrompt(etapa, inp, prevDatos);
    setPromptTexto(p);
    setPromptVisible(true);
    setAlerts([]);
  };
 
  const mejorarPrompt = () => {
    if (!draft.trim()) {
      setAlerts([{ tipo: "advertencia", texto: "Primero escribe o pega un borrador en el área de resultado." }]);
      return;
    }
    const p = `Eres un asistente académico. Tienes este texto de un proyecto de investigación universitario para la sección "${etapa.titulo}":\n\n"${draft}"\n\nMejora la redacción para que sea más académica, clara y fluida. Mantén exactamente el mismo contenido y datos. No agregues información nueva. No uses markdown. Devuelve solo el texto mejorado.`;
    setPromptTexto(p);
    setPromptVisible(true);
    setAlerts([]);
  };
 
  return (
    <div>
      {promptVisible && <ModalPrompt prompt={promptTexto} onCerrar={() => setPromptVisible(false)} />}
 
      <div style={{ background: `${A}08`, border: `1px solid ${T}25`, borderRadius: 9, padding: "0.9rem 1.1rem", marginBottom: "1.1rem" }}>
        <h2 style={{ color: A, fontSize: 16, fontWeight: 700, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 7 }}>
          <span>{etapa.icono}</span> Etapa {etapa.id} — {etapa.titulo}
        </h2>
        <p style={{ color: M, fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>{etapa.descripcion}</p>
      </div>
 
      <div style={{ background: WNC, border: `1px solid ${WN}30`, borderRadius: 7, padding: "8px 12px", marginBottom: "1rem", fontSize: 12.5, color: WN }}>
        💡 <strong>¿Cómo funciona?</strong> Llena el campo de la izquierda, presiona <em>"Generar prompt"</em>, copia el texto que aparece, pégalo en Claude.ai o ChatGPT, y trae la respuesta al campo de la derecha.
      </div>
 
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
        <div>
          <div style={{ background: TC, border: `1px solid ${T}20`, borderRadius: 7, padding: "0.8rem 0.9rem", marginBottom: "0.8rem" }}>
            <p style={{ color: T, fontWeight: 700, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>Preguntas detonadoras</p>
            {etapa.preguntas.map((p, i) => (
              <p key={i} style={{ color: A, fontSize: 12, lineHeight: 1.5, margin: "0 0 0.35rem" }}>
                <strong style={{ color: T }}>{i + 1}.</strong> {p}
              </p>
            ))}
          </div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: A, marginBottom: 4 }}>Tu información</label>
          <textarea
            value={inp}
            onChange={e => { setInp(e.target.value); onUpdate(etapa.clave, { input: e.target.value, borrador: draft }); }}
            placeholder={etapa.placeholder}
            style={{ width: "100%", minHeight: 145, padding: "9px 11px", border: `1.5px solid ${B}`, borderRadius: 7, fontSize: 12.5, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", outline: "none", color: "#1a1a1a" }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
            <Btn onClick={mostrarPrompt} variante="prim">✨ Generar prompt</Btn>
            <Btn onClick={mejorarPrompt} variante="sec">✍️ Mejorar borrador</Btn>
          </div>
        </div>
 
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: A, marginBottom: 4 }}>
            {etapa.labelSalida} <span style={{ color: M, fontWeight: 400 }}>— pega aquí la respuesta de la IA</span>
          </label>
          <textarea
            value={draft}
            onChange={e => { setDraft(e.target.value); onUpdate(etapa.clave, { input: inp, borrador: e.target.value }); }}
            placeholder="Pega aquí la respuesta que te dio Claude.ai o ChatGPT. También puedes escribir directamente..."
            style={{ width: "100%", minHeight: 220, padding: "9px 11px", border: `1.5px solid ${B}`, borderRadius: 7, fontSize: 12.5, lineHeight: 1.8, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", outline: "none", color: "#1a1a1a", background: draft ? "#FAFFFE" : W }}
          />
          <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 10 }}>
            <Btn onClick={() => { onUpdate(etapa.clave, { input: inp, borrador: draft }); setAlerts([{ tipo: "exito", texto: "Guardado." }]); }} variante="teal" style={{ fontSize: 11.5, padding: "5px 11px" }}>💾 Guardar</Btn>
            {draft && <span style={{ fontSize: 11.5, color: EX }}>✓ {draft.trim().split(/\s+/).length} palabras</span>}
          </div>
        </div>
      </div>
 
      {alerts.length > 0 && <div style={{ marginTop: "0.8rem" }}>{alerts.map((a, i) => <Alrt key={i} {...a} />)}</div>}
    </div>
  );
}
 
function CoherenciaPanel({ datos }) {
  const [promptVisible, setPromptVisible] = useState(false);
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
  const comp = items.filter(i => i.ok).length;
 
  const promptCoherencia = () => {
    const secs = Object.entries({
      "Narrativa inicial": datos.idea?.borrador,
      "Tema delimitado": datos.delimitacion?.borrador,
      "Problema central": datos.problema?.borrador,
      "Planteamiento": datos.planteamiento?.borrador,
      "Título": datos.titulo?.borrador,
      "Pregunta de investigación": datos.pregunta?.borrador,
      "Objetivo general": datos.objetivo_general?.borrador,
      "Objetivos específicos": datos.objetivos_especificos?.borrador,
      "Justificación": datos.justificacion?.borrador,
      "Viabilidad": datos.viabilidad?.borrador,
      "Alcances": datos.alcances?.borrador,
      "Limitaciones": datos.limitaciones?.borrador,
    }).filter(([, v]) => v?.trim()).map(([k, v]) => `${k}:\n${v}`).join("\n\n---\n\n");
 
    return `Analiza la coherencia metodológica de este Capítulo 1 de un proyecto de investigación universitario:\n\n${secs}\n\nRevisa estos puntos:\n1. ¿El título coincide con el problema y el enfoque del proyecto?\n2. ¿La pregunta de investigación es el equivalente interrogativo del título?\n3. ¿El objetivo general responde directamente a la pregunta de investigación?\n4. ¿Los objetivos específicos son pasos metodológicos (no funciones del sistema)?\n5. ¿El planteamiento incluye las tres fases: contexto general, problema específico y consecuencias?\n6. ¿Los alcances son coherentes con la viabilidad?\n7. ¿Las limitaciones son honestas y claras?\n\nPara cada punto señala si está bien, qué debilidades hay y qué mejorar. Sé docente y constructivo. Usa lenguaje claro para estudiantes universitarios. No uses markdown ni asteriscos.`;
  };
 
  return (
    <div>
      {promptVisible && <ModalPrompt prompt={promptCoherencia()} onCerrar={() => setPromptVisible(false)} />}
 
      <div style={{ background: `${A}08`, border: `1px solid ${T}25`, borderRadius: 9, padding: "0.9rem 1.1rem", marginBottom: "1.1rem" }}>
        <h2 style={{ color: A, fontSize: 16, fontWeight: 700, margin: "0 0 3px" }}>🔗 Revisión de coherencia metodológica</h2>
        <p style={{ color: M, fontSize: 12.5, margin: 0 }}>Verifica que todos los elementos estén completos y sean coherentes entre sí.</p>
      </div>
 
      <div style={{ background: comp === 12 ? EXC : WNC, border: `1px solid ${comp === 12 ? EX : WN}30`, borderRadius: 7, padding: "8px 12px", marginBottom: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 12.5, color: comp === 12 ? EX : WN }}>
          {comp === 12 ? "✅ Todas las secciones completadas" : `⚠️ ${comp} de 12 secciones completadas`}
        </span>
        <span style={{ fontSize: 11.5, color: M }}>{12 - comp > 0 ? `Faltan ${12 - comp}` : "Listo"}</span>
      </div>
 
      <div style={{ border: `1px solid ${B}`, borderRadius: 7, overflow: "hidden", marginBottom: "0.9rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: A }}>
              <th style={{ padding: "7px 11px", textAlign: "left", color: W, fontWeight: 600 }}>Elemento</th>
              <th style={{ padding: "7px 11px", textAlign: "center", color: W, fontWeight: 600 }}>Estado</th>
              <th style={{ padding: "7px 11px", textAlign: "left", color: W, fontWeight: 600 }}>Se relaciona con</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? W : G }}>
                <td style={{ padding: "6px 11px", color: A, fontWeight: 500 }}>{f.el}</td>
                <td style={{ padding: "6px 11px", textAlign: "center" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: f.ok ? EXC : ERC, color: f.ok ? EX : ER }}>{f.ok ? "✓ Completo" : "Pendiente"}</span>
                </td>
                <td style={{ padding: "6px 11px", color: M }}>{f.rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <Btn onClick={() => setPromptVisible(true)} variante="prim">🔍 Generar prompt de análisis de coherencia</Btn>
    </div>
  );
}
 
function Cap1Panel({ datos, nombre, estudiante }) {
  const [copiado, setCopiado] = useState(false);
  const b = k => datos[k]?.borrador?.trim() || "";
  const txt = `CAPÍTULO 1. PLANTEAMIENTO DEL PROYECTO\n\nProyecto: ${nombre || "[Sin título]"}\nEstudiante: ${estudiante || "[Sin nombre]"}\n\n1.1 PLANTEAMIENTO DEL PROBLEMA\n\n${b("planteamiento") || "[Pendiente]"}\n\n1.2 PREGUNTA DE INVESTIGACIÓN\n\n${b("pregunta") || "[Pendiente]"}\n\n1.3 JUSTIFICACIÓN\n\n${b("justificacion") || "[Pendiente]"}\n\n1.4 OBJETIVO GENERAL\n\n${b("objetivo_general") || "[Pendiente]"}\n\n1.5 OBJETIVOS ESPECÍFICOS\n\n${b("objetivos_especificos") || "[Pendiente]"}\n\n1.6 VIABILIDAD\n\n${b("viabilidad") || "[Pendiente]"}\n\n1.7 ALCANCES\n\n${b("alcances") || "[Pendiente]"}\n\n1.8 LIMITACIONES\n\n${b("limitaciones") || "[Pendiente]"}`;
 
  const copiar = () => { navigator.clipboard.writeText(txt); setCopiado(true); setTimeout(() => setCopiado(false), 2500); };
  const descargar = () => {
    const bl = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const u = URL.createObjectURL(bl);
    const a = document.createElement("a");
    a.href = u; a.download = `Cap1_${(estudiante || "proyecto").replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(u);
  };
 
  const Sec = ({ num, titulo, clave }) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <h3 style={{ color: A, fontSize: 13.5, fontWeight: 700, borderBottom: `2px solid ${T}`, paddingBottom: 5, marginBottom: 8 }}>{num} {titulo}</h3>
      {b(clave)
        ? <p style={{ fontSize: 13, lineHeight: 1.9, color: "#1a1a1a", margin: 0, whiteSpace: "pre-line" }}>{b(clave)}</p>
        : <p style={{ fontSize: 13, color: M, fontStyle: "italic", margin: 0 }}>Pendiente de completar</p>}
    </div>
  );
 
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ color: A, fontSize: 16, fontWeight: 700, margin: "0 0 3px" }}>📄 Vista previa del Capítulo 1</h2>
          <p style={{ color: M, fontSize: 12.5, margin: 0 }}>Documento final. Puedes copiar el texto o descargarlo.</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn onClick={copiar} variante="sec">{copiado ? "✅ Copiado" : "📋 Copiar texto"}</Btn>
          <Btn onClick={descargar} variante="prim">⬇️ Descargar .txt</Btn>
        </div>
      </div>
      <div style={{ background: W, border: `1px solid ${B}`, borderRadius: 9, padding: "1.5rem 1.75rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem", paddingBottom: "1.1rem", borderBottom: `1px solid ${B}` }}>
          <h1 style={{ color: A, fontSize: 18, fontWeight: 700, margin: "0 0 5px" }}>CAPÍTULO 1. PLANTEAMIENTO DEL PROYECTO</h1>
          <p style={{ color: M, fontSize: 12.5, margin: 0 }}>{nombre || "[Sin título de proyecto]"}<br />{estudiante || "[Sin nombre de estudiante]"}</p>
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
  const [pant, setPant] = useState("inicio");
  const [etapa, setEtapa] = useState(1);
  const [nombre, setNombre] = useState("");
  const [est, setEst] = useState("");
  const [datos, setDatos] = useState({});
 
  useEffect(() => {
    try {
      const s = localStorage.getItem(SK);
      if (s) { const p = JSON.parse(s); setNombre(p.nombre || ""); setEst(p.est || ""); setDatos(p.datos || {}); if (p.pant === "app") { setPant("app"); setEtapa(p.etapa || 1); } }
    } catch {}
  }, []);
 
  useEffect(() => {
    if (pant === "app") try { localStorage.setItem(SK, JSON.stringify({ pant, nombre, est, datos, etapa })); } catch {}
  }, [pant, nombre, est, datos, etapa]);
 
  const upd = useCallback((k, v) => setDatos(p => ({ ...p, [k]: v })), []);
  const comp = ETAPAS.filter(e => datos[e.clave]?.borrador?.trim()).length;
  const pct = Math.round((comp / 12) * 100);
  const etapaObj = ETAPAS.find(e => e.id === etapa);
 
  if (pant === "inicio") return (
    <div style={{ minHeight: "100vh", background: G, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ background: W, borderRadius: 12, padding: "2rem", maxWidth: 520, width: "100%", border: `1px solid ${B}` }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 58, height: 58, borderRadius: 12, background: `linear-gradient(135deg, ${A}, ${T})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 1rem" }}>📚</div>
          <h1 style={{ color: A, fontSize: 21, fontWeight: 700, margin: "0 0 3px" }}>Constructor Metodológico</h1>
          <h2 style={{ color: T, fontSize: 14, fontWeight: 500, margin: 0 }}>Capítulo 1 — Planteamiento del proyecto</h2>
        </div>
        <p style={{ color: M, fontSize: 13, lineHeight: 1.7, marginBottom: "1.5rem", textAlign: "center" }}>
          Herramienta guiada para construir el Capítulo 1 de tu proyecto de investigación paso a paso.
        </p>
        <div style={{ marginBottom: "0.8rem" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: A, marginBottom: 4 }}>Nombre del estudiante</label>
          <input type="text" value={est} onChange={e => setEst(e.target.value)} placeholder="Escribe tu nombre completo" style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1.5px solid ${B}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: A, marginBottom: 4 }}>Título tentativo o tema del proyecto</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Sistema de gestión de inventario para PYMES" style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1.5px solid ${B}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
        </div>
        <Btn onClick={() => setPant("app")} variante="prim" style={{ width: "100%", padding: "10px 15px", fontSize: 13.5 }}>🚀 Comenzar a construir mi Capítulo 1</Btn>
        <p style={{ textAlign: "center", fontSize: 11, color: M, margin: "8px 0 0" }}>Tu avance se guarda automáticamente en este navegador</p>
      </div>
    </div>
  );
 
  return (
    <div style={{ minHeight: "100vh", background: G, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: A, padding: "0.8rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 18 }}>📚</span>
          <div>
            <p style={{ color: W, fontSize: 13, fontWeight: 700, margin: 0 }}>Constructor Metodológico — Capítulo 1</p>
            <p style={{ color: `${W}75`, fontSize: 11, margin: 0 }}>{est || "Estudiante"} · {nombre || "Proyecto de investigación"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: `${W}20`, color: W, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{comp}/12 · {pct}%</span>
          <button onClick={() => { if (window.confirm("¿Reiniciar todo el progreso?")) { localStorage.removeItem(SK); setDatos({}); setPant("inicio"); } }} style={{ background: "transparent", border: `1px solid ${W}30`, color: `${W}70`, padding: "2px 8px", borderRadius: 5, cursor: "pointer", fontSize: 11 }}>↩ Reiniciar</button>
        </div>
      </div>
 
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "1.1rem 1.25rem" }}>
        <div style={{ marginBottom: "0.9rem" }}>
          <div style={{ height: 4, background: B, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T}, ${A})`, borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
 
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "1rem" }}>
          {ETAPAS.map(e => {
            const ok = !!datos[e.clave]?.borrador?.trim();
            const act = etapa === e.id;
            return (
              <button key={e.id} onClick={() => setEtapa(e.id)} title={e.titulo} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: act ? T : ok ? EXC : G, color: act ? W : ok ? EX : M, outline: act ? `2px solid ${T}` : "none", outlineOffset: 2 }}>
                {ok && !act ? "✓" : e.id}
              </button>
            );
          })}
          <button onClick={() => setEtapa(13)} style={{ padding: "0 9px", height: 30, borderRadius: 15, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: etapa === 13 ? A : G, color: etapa === 13 ? W : M }}>🔗 Coherencia</button>
          <button onClick={() => setEtapa(14)} style={{ padding: "0 9px", height: 30, borderRadius: 15, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: etapa === 14 ? A : G, color: etapa === 14 ? W : M }}>📄 Cap. 1</button>
        </div>
 
        <div style={{ background: W, borderRadius: 11, padding: "1.25rem", border: `1px solid ${B}` }}>
          {etapa >= 1 && etapa <= 12 && etapaObj && (
            <div>
              <EtapaPanel etapa={etapaObj} datos={datos[etapaObj.clave] || {}} onUpdate={upd} prevDatos={datos} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem", paddingTop: "1rem", borderTop: `1px solid ${B}` }}>
                <Btn onClick={() => setEtapa(v => Math.max(1, v - 1))} variante="sec" disabled={etapa === 1}>← Anterior</Btn>
                <Btn onClick={() => setEtapa(v => v < 12 ? v + 1 : 13)} variante="prim">{etapa === 12 ? "Ir a coherencia →" : "Siguiente etapa →"}</Btn>
              </div>
            </div>
          )}
          {etapa === 13 && <CoherenciaPanel datos={datos} />}
          {etapa === 14 && <Cap1Panel datos={datos} nombre={nombre} estudiante={est} />}
        </div>
      </div>
    </div>
  );
}