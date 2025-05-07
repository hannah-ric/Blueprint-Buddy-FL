const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');
const pexelsRoutes = require('./routes/pexels');

const organizationForAuthRoutes = require('./routes/organizationLogin');

const openaiRoutes = require('./routes/openai');

const contactFormRoutes = require('./routes/contactForm');

const usersRoutes = require('./routes/users');

const build_plansRoutes = require('./routes/build_plans');

const componentsRoutes = require('./routes/components');

const hardware_fastenersRoutes = require('./routes/hardware_fasteners');

const joinery_methodsRoutes = require('./routes/joinery_methods');

const materialsRoutes = require('./routes/materials');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const workshopRoutes = require('./routes/workshop');

const getBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Blueprint Buddy',
      description:
        'Blueprint Buddy Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host =
      getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/pexels', pexelsRoutes);
app.enable('trust proxy');

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/build_plans',
  passport.authenticate('jwt', { session: false }),
  build_plansRoutes,
);

app.use(
  '/api/components',
  passport.authenticate('jwt', { session: false }),
  componentsRoutes,
);

app.use(
  '/api/hardware_fasteners',
  passport.authenticate('jwt', { session: false }),
  hardware_fastenersRoutes,
);

app.use(
  '/api/joinery_methods',
  passport.authenticate('jwt', { session: false }),
  joinery_methodsRoutes,
);

app.use(
  '/api/materials',
  passport.authenticate('jwt', { session: false }),
  materialsRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

app.use(
  '/api/workshop',
  passport.authenticate('jwt', { session: false }),
  workshopRoutes,
);

app.use(
  '/api/openai',
  passport.authenticate('jwt', { session: false }),
  openaiRoutes,
);

app.use('/api/contact-form', contactFormRoutes);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes,
);

app.use('/api/org-for-auth', organizationForAuthRoutes);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.NODE_ENV === 'dev_stage' ? 3000 : 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
