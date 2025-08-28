exports.apps = [{
  name: 'bhindi-brewit-agent',
  script: 'dist/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 8004
  },
  watch: false,
  max_memory_restart: '1G',
  error_file: 'logs/agent-error.log',
  out_file: 'logs/agent-out.log',
  log_file: 'logs/agent-combined.log',
  time: true,
  restart_delay: 4000,
  max_restarts: 10
}];