# Acervo Documental - Manual de Usuario

Sistema de gestion documental para la Oficina de Formulacion de Proyectos de Inversion Publica, Municipalidad Distrital de Challhuahuacho, Apurimac, Peru.

---

## Indice

1. [Descripcion del sistema](#descripcion-del-sistema)
2. [Instalacion](#instalacion)
3. [Despliegue en GitHub Pages](#despliegue-en-github-pages)
4. [Guia de uso por modulo](#guia-de-uso-por-modulo)
5. [Roles y permisos](#roles-y-permisos)
6. [Base de datos](#base-de-datos)
7. [Seguridad](#seguridad)
8. [Glosario](#glosario)

---

## Descripcion del sistema

Acervo organiza toda la documentacion de la oficina alrededor del Codigo Unico de Inversion (CUI). Garantiza integridad en la numeracion correlativa, trazabilidad de correspondencia y visibilidad operativa en tiempo real.

### Problemas que resuelve

| Problema | Solucion |
|----------|----------|
| Numeracion de informes discontinua | Deteccion automatica de brechas en secuencias |
| Correspondencia sin seguimiento | Hilos que vinculan documentos externos con sus respuestas |
| Documentos sin proyecto asignado | Todo documento se vincula a un CUI |
| Sin historial de cambios | Auditoria inmutable de operaciones |
| Eliminacion irreversible de archivos | Eliminacion logica con razon y responsable |

### Funcionalidades principales

- Busqueda global con Ctrl+K usando coincidencia difusa
- Numeracion predictiva: el sistema sugiere el siguiente numero disponible
- Deteccion de brechas en series numericas en tiempo real
- Nomenclatura automatica de archivos (formato: 2026_INF_001_CUI2642054.pdf)
- Dashboard con graficos de actividad y alertas operativas
- Modo oscuro y claro configurable por usuario

---

## Instalacion

### Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Proyecto activo en Supabase (https://supabase.com)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/TU_USUARIO/acervo.git
cd acervo
```

**2. Instalar dependencias**

```bash
npm install --legacy-peer-deps
```

**3. Configurar variables de entorno**

Copiar el archivo de ejemplo y completar con las credenciales de Supabase:

```bash
cp .env.example .env
```

Contenido del archivo `.env`:

```
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

El archivo `.env` esta en `.gitignore`. No subirlo al repositorio.

**4. Crear el primer administrador**

En Supabase ir a Authentication > Users, crear el usuario y luego ejecutar en el SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'UUID_DEL_USUARIO';
```

**5. Iniciar en modo desarrollo**

```bash
npm run dev
```

Disponible en: http://localhost:5173/acervo/

**6. Compilar para produccion**

```bash
npm run build
```

Archivos generados en la carpeta `dist/`.

---

## Despliegue en GitHub Pages

El repositorio incluye un workflow de GitHub Actions que despliega automaticamente en cada push a `main`.

**Paso 1 - Habilitar GitHub Pages**

En el repositorio ir a Settings > Pages y en Source seleccionar "GitHub Actions".

**Paso 2 - Agregar Secrets**

En Settings > Secrets and variables > Actions, crear los siguientes secrets:

| Secret | Valor |
|--------|-------|
| VITE_SUPABASE_URL | URL del proyecto Supabase |
| VITE_SUPABASE_ANON_KEY | Anon key del proyecto Supabase |

**Paso 3 - Publicar**

```bash
git add .
git commit -m "deploy: version inicial"
git push origin main
```

El sitio queda disponible en `https://TU_USUARIO.github.io/acervo/` en aproximadamente 2 minutos.

---

## Guia de uso por modulo

### Inicio de sesion

Al acceder al sistema se presenta la pantalla de autenticacion. Solo usuarios registrados por el administrador pueden ingresar. La sesion persiste entre visitas.

---

### Dashboard

Ruta: `/#/dashboard`

Vista ejecutiva del estado del acervo.

| Indicador | Descripcion |
|-----------|-------------|
| Proyectos Activos | Total de proyectos CUI registrados |
| Docs. Internos | Informes, memorandums y oficios emitidos |
| Docs. Externos | Correspondencia recibida |
| Brechas Detectadas | Numeros de secuencia faltantes |

**Panel de Brechas**

Si existen INF-018-2026 e INF-020-2026 pero no el INF-019-2026, el sistema muestra una alerta. Esto es critico ante fiscalizaciones de la Contraloria General de la Republica.

**Pendientes de Respuesta**

| Estado | Criterio |
|--------|----------|
| Normal | Menos de 10 dias desde la recepcion |
| Urgente | Mas de 10 dias sin respuesta |
| Vencido | La fecha limite de respuesta paso |

---

### Proyectos CUI

Ruta: `/#/proyectos`

Todo documento debe vincularse a un proyecto CUI.

**Crear un proyecto**

1. Hacer clic en "Nuevo proyecto"
2. Completar los campos:

| Campo | Obligatorio |
|-------|:-----------:|
| CUI (unico en el sistema) | Si |
| Nombre completo del proyecto | Si |
| Etapa (Pre-Inversion / Inversion / Post-Inversion / Cerrado) | Si |
| Costo de inversion en soles | Si |
| Descripcion | No |

3. Hacer clic en "Crear proyecto"

Hacer clic en una tarjeta de proyecto muestra todos los documentos internos y externos vinculados a ese CUI.

---

### Documentos Internos

Ruta: `/#/documentos/internos`

**Tipos de documentos disponibles**

| Codigo | Tipo | Uso |
|--------|------|-----|
| INF | Informe | Reporte tecnico al superior jerarquico |
| MEM | Memorandum | Comunicacion entre unidades internas |
| OFI-E | Oficio Emitido | Comunicacion a entidades externas |
| RES | Resolucion | Acto administrativo resolutivo |

**Registrar un documento interno**

1. Hacer clic en "Nuevo documento"
2. Seleccionar el tipo (determina la serie numerica)
3. Completar fecha, asunto, destinatario y proyecto CUI
4. El sistema genera automaticamente la nomenclatura del archivo:

   Formato: `ANO_TIPO_NUMERO_CUICUI`
   Ejemplo: `2026_INF_001_CUI2642054`

5. El numero de secuencia es asignado automaticamente y no puede modificarse
6. Adjuntar el PDF (maximo 50 MB)
7. Hacer clic en "Registrar documento"

---

### Documentos Externos

Ruta: `/#/documentos/externos`

**Registrar un documento externo**

1. Hacer clic en "Registrar recepcion"
2. Completar el formulario:

| Campo | Obligatorio |
|-------|:-----------:|
| Entidad remitente | Si |
| Nombre del remitente | No |
| Numero externo (segun el emisor) | No |
| Fecha de recepcion | Si |
| Asunto | Si |
| Proyecto CUI vinculado | No |
| Requiere respuesta | No |
| Plazo de respuesta | No |

El sistema asigna automaticamente un ID de Recepcion interno correlativo (ej. REC-001-2026). El Numero Externo es el codigo del documento segun el emisor (ej. Oficio N 4550-2026-GORE).

**Vincular una respuesta**

1. Hacer clic en el icono de vincular en la fila del documento
2. Seleccionar el documento interno que constituye la respuesta
3. Agregar notas opcionales y hacer clic en "Vincular"

El documento deja de aparecer en Pendientes de Respuesta.

---

### Hilos Documentales

Ruta: `/#/hilos`

Muestra el par completo entre cada documento externo recibido y su respuesta interna emitida. Permite demostrar ante la Contraloria que toda la correspondencia fue debidamente atendida.

---

### Analitica

Ruta: `/#/analitica`

| Grafico | Descripcion |
|---------|-------------|
| Proyectos por Etapa | Distribucion porcentual por fase de inversion |
| Tipos de Documentos Emitidos | Volumen por tipo |
| Top Proyectos por Volumen | CUIs con mayor actividad documental |
| Brechas Activas | Detalle de gaps de secuencia |
| Pendientes de Respuesta | Documentos urgentes sin atender |

---

### Administracion

Ruta: `/#/admin` - Solo para el rol Administrador

**Pestana Usuarios**

Lista todos los usuarios con su rol y area. Para cambiar el rol de un usuario, ejecutar en el SQL Editor de Supabase:

```sql
UPDATE public.profiles SET role = 'admin'      WHERE id = 'UUID';
UPDATE public.profiles SET role = 'formulador' WHERE id = 'UUID';
UPDATE public.profiles SET role = 'viewer'     WHERE id = 'UUID';
```

**Pestana Auditoria**

Registro de las ultimas 100 acciones: tabla afectada, tipo de operacion (INSERT, UPDATE, DELETE) y fecha exacta.

---

## Roles y permisos

| Accion | Administrador | Formulador | Visualizador |
|--------|:-------------:|:----------:|:------------:|
| Ver proyectos, documentos e hilos | Si | Si | Si |
| Ver analitica | Si | Si | Si |
| Crear y editar proyectos | Si | Si | No |
| Registrar documentos | Si | Si | No |
| Vincular hilos | Si | Si | No |
| Eliminar documentos | Si | No | No |
| Panel de administracion | Si | No | No |
| Ver auditoria | Si | No | No |

---

## Base de datos

### Tablas

| Tabla | Descripcion |
|-------|-------------|
| profiles | Usuarios con rol y area |
| projects | Proyectos identificados por CUI |
| document_types | Catalogo de tipos documentales |
| internal_documents | Documentos emitidos |
| external_documents | Correspondencia recibida |
| document_threads | Vinculos entre documentos externos e internos |
| audit_log | Registro de operaciones |

### Vistas analiticas

| Vista | Proposito |
|-------|-----------|
| v_sequence_gaps | Numeros faltantes en series documentales |
| v_pending_responses | Documentos externos sin respuesta, con urgencia calculada |
| v_project_document_summary | Resumen de actividad documental por proyecto CUI |

---

## Seguridad

**Row Level Security**

Todas las tablas tienen RLS habilitado. Ningun usuario puede acceder a datos fuera de sus permisos, ni siquiera accediendo directamente a la API de Supabase.

**Eliminacion logica**

Los documentos nunca se eliminan fisicamente. Al eliminar, el sistema registra el estado como eliminado, la razon, la fecha y el usuario responsable. Los registros permanecen accesibles para auditoria.

**Token de integridad**

Cada documento recibe un token unico al momento del registro. Establece que el documento fue ingresado al sistema antes de recibir sello fisico, creando una precedencia temporal verificable.

**Variables de entorno**

Solo la clave publica (ANON_KEY) se expone en el frontend. La clave de servicio (SERVICE_ROLE_KEY) nunca debe incluirse en codigo frontend ni en repositorios publicos.

---

## Glosario

| Termino | Definicion |
|---------|------------|
| CUI | Codigo Unico de Inversion. Identificador del proyecto en el sistema INVIERTE.PE del MEF |
| Informe (INF) | Documento tecnico interno al superior jerarquico |
| Memorandum (MEM) | Comunicacion entre unidades de la misma entidad |
| Oficio Emitido (OFI-E) | Comunicacion oficial a entidades externas |
| Resolucion (RES) | Acto administrativo de decision |
| Brecha de secuencia | Numero faltante en una serie correlativa. Riesgo ante la Contraloria |
| Hilo documental | Vinculo entre un documento externo y su respuesta interna |
| Soft Delete | Eliminacion logica con razon, fecha y autor registrados |
| RLS | Row Level Security. Seguridad a nivel de fila en PostgreSQL |
| Token de integridad | Codigo unico que establece precedencia temporal del registro digital |
| ID de Recepcion | Numeracion interna asignada a cada documento externo recibido |
| Numero Externo | Codigo del documento segun el sistema del emisor |

---

Municipalidad Distrital de Challhuahuacho - Oficina de Formulacion de Proyectos
