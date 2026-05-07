module.exports = {
  apps: [
    {
      name: "moglix-frontend",
      cwd: "/var/www/html/moglix-clone/moglix-nextjs",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "moglix-cms",
      cwd: "/var/www/html/moglix-clone/moglix-cms",
      script: "npm",
      args: "run start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 1337
      }
    }
  ]
}
