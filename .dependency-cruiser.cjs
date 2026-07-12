/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-feature-imports',
      comment: 'Do not import from other features inside server/src/features',
      severity: 'error',
      from: {
        path: '^server/src/features/([^/]+)',
      },
      to: {
        path: '^server/src/features/([^/]+)',
        pathNot: '^server/src/features/$1',
      },
    },
    {
      name: 'no-client-in-server',
      comment: 'Do not import client files from the server',
      severity: 'error',
      from: {
        path: '^server/src',
      },
      to: {
        path: '^client',
      },
    },
    {
      name: 'no-server-in-client',
      comment: 'Do not import server files from the client',
      severity: 'error',
      from: {
        path: '^client/src',
      },
      to: {
        path: '^server',
      },
    },
  ],
  options: {
    doNotFollow: 'node_modules',
    tsPreCompilationDeps: true,
  },
};
