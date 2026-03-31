# Guia de Uso — Acervo Documental

Sistema disponible en: https://JOSETRA44.github.io/acervo/

---

## Credenciales de acceso

### Usuario Administrador

| Campo | Valor |
|-------|-------|
| Email | admin@challhuahuacho.gob.pe |
| Contrasena | Admin2026! |
| Rol | Administrador (acceso total) |
| Area | Sistemas |

### Usuario Formulador

| Campo | Valor |
|-------|-------|
| Email | formulador@challhuahuacho.gob.pe |
| Contrasena | Form2026! |
| Rol | Formulador (registro y consulta) |
| Area | Formulacion |

---

## Diferencia entre roles

| Que puede hacer | Administrador | Formulador |
|-----------------|:-------------:|:----------:|
| Ver proyectos, documentos e hilos | Si | Si |
| Ver graficos analiticos | Si | Si |
| Crear proyectos CUI | Si | Si |
| Registrar documentos internos | Si | Si |
| Registrar documentos externos | Si | Si |
| Vincular hilos de respuesta | Si | Si |
| Eliminar documentos | Si | No |
| Ver panel de administracion | Si | No |
| Ver registro de auditoria | Si | No |
| Gestionar usuarios | Si | No |

---

## Como usar el sistema

### 1. Ingresar al sistema

Abrir el navegador y acceder a https://JOSETRA44.github.io/acervo/

Ingresar el email y la contrasena del usuario asignado. La sesion persiste entre visitas, no es necesario volver a autenticarse cada vez.

---

### 2. Dashboard (pantalla principal)

Al ingresar se muestra el panel principal con cuatro indicadores:

- **Proyectos Activos** — cuantos proyectos CUI estan registrados
- **Docs. Internos** — total de informes, memorandums y oficios emitidos
- **Docs. Externos** — total de correspondencia recibida
- **Brechas Detectadas** — numeros de secuencia faltantes (debe ser cero)

En la parte inferior hay dos paneles importantes:

**Brechas de Secuencia** — si un numero de informe no existe (por ejemplo existe el INF-018 y el INF-020 pero falta el INF-019), aparece una alerta roja. Esto debe resolverse para evitar problemas ante la Contraloria.

**Pendientes de Respuesta** — documentos externos que requieren respuesta y aun no tienen respuesta vinculada. Cada uno muestra cuantos dias lleva sin atender.

---

### 3. Registrar un proyecto CUI

Ir al menu **Proyectos (CUI)** en la barra lateral.

1. Hacer clic en el boton **Nuevo proyecto**
2. Llenar los campos:
   - CUI: el numero de codigo del proyecto en INVIERTE.PE (ej. 2642054)
   - Nombre: nombre completo del proyecto
   - Etapa: Pre-Inversion, Inversion, Post-Inversion o Cerrado
   - Costo de inversion: monto en soles
3. Hacer clic en **Crear proyecto**

El proyecto aparece como una tarjeta en la lista. Hacer clic en la tarjeta muestra todos los documentos vinculados.

---

### 4. Registrar un informe u oficio (documento interno)

Ir al menu **Docs. Internos** en la barra lateral.

1. Hacer clic en **Nuevo documento**
2. Seleccionar el tipo:
   - INF = Informe tecnico
   - MEM = Memorandum interno
   - OFI-E = Oficio emitido a entidad externa
   - RES = Resolucion
3. Completar los campos:
   - Fecha de emision
   - Asunto (descripcion del documento)
   - Destinatario
   - Proyecto CUI (seleccionar de la lista)
4. El sistema muestra automaticamente el codigo del documento, por ejemplo: `2026_INF_001_CUI2642054`
   - Este codigo es el nombre oficial del archivo
   - El numero de secuencia lo asigna el sistema automaticamente
5. Arrastrar el archivo PDF al area indicada o hacer clic para buscarlo
6. Hacer clic en **Registrar documento**

El documento queda guardado y disponible en la lista.

---

### 5. Registrar correspondencia recibida (documento externo)

Ir al menu **Docs. Externos** en la barra lateral.

1. Hacer clic en **Registrar recepcion**
2. Completar los campos:
   - Entidad remitente: quien envia el documento (ej. Ministerio de Educacion)
   - Nombre del remitente: persona que firma (opcional)
   - Numero externo: el numero que trae el documento del emisor (ej. Oficio N 4550-2026)
   - Fecha de recepcion: cuando se recibio fisicamente
   - Asunto: de que trata el documento
   - Proyecto CUI: a que proyecto corresponde (opcional)
   - Requiere respuesta: marcar si el documento exige una respuesta
   - Plazo de respuesta: fecha limite (si aplica)
3. Adjuntar el PDF si se tiene digitalizado
4. Hacer clic en **Registrar**

El sistema asigna automaticamente un numero de recepcion interno (ej. REC-001-2026).

---

### 6. Vincular una respuesta a un documento externo

Cuando la oficina emite la respuesta a un documento recibido, se debe vincular en el sistema:

1. Ir a **Docs. Externos**
2. Ubicar el documento externo que fue respondido
3. Hacer clic en el icono de vinculo (columna Acciones)
4. En el panel que aparece, seleccionar el informe u oficio que constituye la respuesta
5. Agregar notas si es necesario
6. Hacer clic en **Vincular**

Esto registra el hilo documental y el documento deja de aparecer como pendiente.

---

### 7. Ver hilos documentales

Ir al menu **Hilos / Threads**.

Muestra todos los vinculos entre documentos externos y sus respuestas. Util para auditorias y para demostrar que toda la correspondencia fue atendida.

---

### 8. Busqueda rapida

Presionar **Ctrl+K** (Windows) o **Cmd+K** (Mac) desde cualquier pantalla.

Escribir el nombre del proyecto, el CUI, o palabras del asunto del documento. Los resultados aparecen en tiempo real. Hacer clic en un resultado navega directamente a ese registro.

---

### 9. Analitica

Ir al menu **Analitica**.

Muestra graficos sobre:
- Distribucion de proyectos por etapa
- Tipos de documentos emitidos
- Proyectos con mayor actividad documental
- Brechas activas y pendientes urgentes

---

### 10. Panel de administracion (solo Administrador)

Ir al menu **Administracion**.

Tiene dos secciones:

**Usuarios** — lista de personas con acceso al sistema, su rol y area.

**Auditoria** — registro de las ultimas 100 operaciones realizadas: quien hizo que, en que tabla y en que momento.

---

## Recomendaciones de uso

- Registrar los documentos el mismo dia que se emiten o reciben, para mantener la fecha correcta
- Siempre vincular el proyecto CUI cuando se conoce, para que la cronologia del proyecto este completa
- Verificar en el Dashboard que no haya brechas de secuencia activas
- Vincular las respuestas a documentos externos dentro del plazo para evitar que aparezcan como vencidos
- Cambiar las contrasenas por defecto despues del primer ingreso

---

## Cambiar contrasena

1. Ingresar con las credenciales actuales
2. El cambio de contrasena se gestiona desde el panel de Supabase por el administrador
3. Para solicitar cambio de contrasena, contactar al administrador del sistema

---

Municipalidad Distrital de Challhuahuacho — Oficina de Formulacion de Proyectos
