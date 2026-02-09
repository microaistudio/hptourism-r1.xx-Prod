module.exports = {
    apps: [{
        name: 'hptourism-dev',
        script: './dist/index.js',
        cwd: '/home/subhash.thakur.india/Projects/hptourism-rc8',
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        env: {
            NODE_ENV: 'production',
            PORT: 5030
        },
        max_memory_restart: '500M',
        error_file: './logs/dev-error.log',
        out_file: './logs/dev-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }]
};
