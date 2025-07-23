# Master Plan: Deducción Automática de Personajes, Eventos y Relaciones

## 1. Objetivo General y Visión
Crear un sistema donde la IA analiza el texto de los capítulos y deduce automáticamente personajes, eventos y relaciones, permitiendo al usuario aceptar, editar o descartar sugerencias, sin requerir input manual inicial. El objetivo es maximizar la fluidez creativa y minimizar la fricción, integrando la magia de la IA en el proceso de escritura.

## 2. Flujo de Usuario (UX)
- El usuario escribe normalmente en el editor de capítulos.
- Al hacer click en el botón de *"Magic Deduction"*, la IA analiza el texto y genera sugerencias de:
  - Personajes (nuevos o ampliaciones de existentes)
  - Eventos canónicos
  - Relaciones entre personajes
- Las sugerencias aparecen en una "bandeja de revisión" donde el usuario puede:
  - Aceptar, editar o descartar cada sugerencia
  - Ver el contexto textual de donde se dedujo cada ítem
- Las sugerencias aceptadas se integran a la base de datos de la novela.
- El usuario puede, opcionalmente, crear personajes/eventos manualmente o marcar texto para forzar la deducción.

## 3. Arquitectura General del Sistema
- **Frontend:**
  - Editor basado en Tiptap con menús contextuales y panel lateral de sugerencias.
  - UI reactiva para revisión/aceptación de sugerencias.
- **Backend/Server Actions:**
  - Endpoint/acción que recibe el texto del capítulo y devuelve un JSON estructurado con sugerencias.
  - Lógica para guardar en la base de datos solo lo aceptado.
- **Base de Datos:**
  - Tablas para personajes, eventos y relaciones.
  - Relación con novelas, capítulos y entre personajes.
- **IA:**
  - Prompting y parsing para extraer entidades, eventos y relaciones del texto.
  - Sistema de confianza/confianza para priorizar sugerencias.

## 4. Integración IA: Deducción y Sugerencias
- Al guardar/autosavear, se envía el texto a la IA.
- La IA responde con un JSON del tipo:
  ```json
  {
    "personajes": [ { ... } ],
    "eventos": [ { ... } ],
    "relaciones": [ { ... } ]
  }
  ```
- Cada sugerencia incluye:
  - Descripción
  - Contexto textual
  - Si es ampliación de un ítem existente, solo los cambios
  - Nivel de confianza
- El sistema debe poder comparar con la base de datos para evitar duplicados.

## 5. UI/UX: Revisión y Aceptación de Sugerencias
- Panel lateral o modal con lista de sugerencias agrupadas por tipo.
- Cada sugerencia muestra:
  - Resumen y detalles
  - Contexto (fragmento de texto)
  - Botones: Aceptar, Editar, Descartar
- Opción de ver/editar ficha completa al aceptar.
- Historial de sugerencias aceptadas/descartadas.

## 6. Menús Contextuales en el Editor (Tiptap)
- Al seleccionar texto o hacer hover sobre nombres/eventos:
  - Mostrar menú contextual con opciones:
    - "Ver personaje"
    - "Crear personaje"
    - "Agregar como evento"
    - "Relacionar con..."
- Tooltips con info rápida al hover sobre nombres reconocidos.
- Permitir marcar texto para forzar deducción manual.

## 7. Modelo de Datos a Implementar (resumido)
- **Personaje:** nombre, descripción, imagen, novela/capítulo, etc.
- **Evento:** título, descripción, fecha, personajes involucrados, capítulo, etc.
- **Relación:** personaje_a, personaje_b, tipo, descripción, contexto.

## 8. Pasos Técnicos y Milestones
1. Definir modelos de datos y relaciones (en archivo de migración separado)
2. Implementar función IA para deducción y formato de respuesta JSON
3. Crear UI de sugerencias y revisión en el editor
4. Integrar menús contextuales en Tiptap
5. Lógica de guardado en base de datos solo para sugerencias aceptadas
6. Testing y feedback de usuarios
7. Iterar sobre UX y precisión de la IA

## 9. Referencias y Links Útiles
- [Tiptap Bubble Menu](https://tiptap.dev/api/extensions/bubble-menu)
- [Tiptap Custom Extensions](https://tiptap.dev/guide/custom-extensions)
- [Sudowrite Story Engine](https://www.sudowrite.com/)
- [NovelAI](https://novelai.net/)
- [Campfire](https://www.campfirewriting.com/)
- [World Anvil](https://www.worldanvil.com/) 