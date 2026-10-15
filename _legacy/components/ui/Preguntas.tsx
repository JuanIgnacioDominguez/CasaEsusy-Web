"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState } from "react";
import { Plus } from "lucide-react";

type Pregunta = { pregunta: string; respuesta: string };

function Item({ p }: { p: Pregunta }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <li className="border-b border-separator">
      <h3>
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          onClick={() => setAbierto((v) => !v)}
          className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-[1.0625rem] font-medium"
        >
          {p.pregunta}
          <m.span animate={{ rotate: abierto ? 45 : 0 }} className="shrink-0 text-rosa">
            <Plus className="size-5" aria-hidden="true" />
          </m.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {abierto && (
          <m.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <p className="max-w-[62ch] pb-5 text-hilo-2">{p.respuesta}</p>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Preguntas({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <ul className="border-t border-separator">
      {preguntas.map((p) => (
        <Item key={p.pregunta} p={p} />
      ))}
    </ul>
  );
}
