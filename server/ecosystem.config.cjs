module.exports = {
    apps: [
        {
            name: "server",
            script: "./src/server.js",
            instances: "max", // number of app instance to be launched, how many CPU core
            autorestart: true, // true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
            watch: true,  // enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded
            max_memory_restart: "1G", // your app will be restarted if it exceeds the amount of memory specified. // human-friendly format : it can be “10M”, “100K”, “2G” and so on
            exec_mode: "cluster", // mode to start your app, can be “cluster” or “fork”, default fork
            out_file: "./src/logs/out.log",
            error_file: "./src/logs/errors.log",
            merge_logs: true,
            env: {
                NODE_ENV: "development",
                NODE_CLUSTER_SCHED_POLICY: "rr"
            }, // env variables which will appear in your app
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
    
};
