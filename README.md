# oFraud - Backend

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellowgreen)
---

## Descripción

Este repositorio contiene todo lo relacionado con el **backend** del proyecto **oFraud**, una plataforma web y móvil enfocada en la **seguridad de los usuarios**, permitiendo realizar **reportes de fraude** en sitios y páginas web.

El repositorio incluye:
* **Backend y base de datos**: gestión de la lógica de negocio y persistencia de datos.
* **API REST**: endpoints para interactuar con la plataforma desde aplicaciones web y móviles.
* **Arquitectura modular**: basada en **NestJS**, utilizando módulos, controladores, servicios y otros patrones recomendados por el framework.

---

## Tecnologías y versiones recomendadas

- **Backend**: 
  - **NestJS**: v11.1.7
  - **Node.js**: v20 o superior

- **Base de datos**: 
  - **MySQL**: 8.0.44 (última versión LTS)
  
> Recomendación: estas versiones garantizan estabilidad, soporte a largo plazo y compatibilidad con ORMs como TypeORM, Prisma o Sequelize. Si es que en un futuro se llegase a escalar a ese nivel. 

---

## Instalación

```bash
# Antes de instalar y correr la aplicación es necesario contar con: 
- Node.js
- Instalador de paquetes (npm)

# Clonar repositorio
$ git clone https://github.com/etxsA/backend-ofraud.git
$ cd backend-ofraud

# Configurar variables de entorno
$ cp .env.example .env

# Edita .env con tus credenciales y configuraciones

# Instalar paquetes necesarios
$ npm install
````

### Base de datos
```bash
# Para generar la base de datos 
1. Descarga el arhivo dump.sql de:  https://github.com/etxsA/backend-ofraud/blob/main/database/create.sql
2. Corre el siguiente comando:
mysql -u root -p oFraud < ofraud_dump.sql


```

---

## Ejecución
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Abrir / acceder a la aplicación - puerto por defecto: 3000
- http://localhost:3001/
```
----

## Uso

Para consumir los endpoints generador por el backend, es recomendable acceder a la documentación de los mismos disponible en: 
- http://localhost:3001/api/

Aquí se pueden consultar los endpoints disponibles así como cualquier detalle de estos y su usabilidad. 

---

## Estructura del Proyecto

```bash
backend-ofraud/
├── README.md
├── database/                            # Dump de la base de datos en mysql
│   └── create.sql
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── src/                                # Código principal del proyecto y modulo principal de nest.js, las subcarpetas son submódulos incluidos en el principal.
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth/
│   ├── category/
│   ├── comment/
│   ├── comment-like/
│   ├── common/
│   ├── db/
│   ├── file/
│   ├── interfaces/
│   ├── like/
│   ├── main.ts                         # Constructor del proyecto, aqui se define el puerto de ejecución.
│   ├── reports/
│   ├── stats/
│   ├── status/
│   ├── user/
│   └── util/
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

---

## Variables de Entorno

| Variable        | Descripción | Valor de ejemplo / Notas |
| --------------- | ----------- | ------------------------ |
| NOMBRE_VARIABLE | Descripción | Ejemplo                  |
| NOMBRE_VARIABLE | Descripción | Ejemplo                  |

---

## Contribución

Instrucciones para contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Descripción del cambio'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

---
## Fuentes de información
- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

---
## Colaboradores
- https://github.com/etxsA
- https://github.com/David-Brnb

