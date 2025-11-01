upstream backend {
  server 127.0.0.1:5000;
  server 127.0.0.1:5001;
  server 127.0.0.1:5002;

  # Optional balancing strategies:
  # least_conn;   # fewer active connections
  # ip_hash;      # sticky sessions per client
}

server {
  listen 80;
  
  location / {
    proxy_pass http://backend;

    # Important headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket & HTTP/2 support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
