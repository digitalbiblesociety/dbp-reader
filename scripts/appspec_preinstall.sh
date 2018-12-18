curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs nginx ssl-cert
sudo rm /etc/nginx/sites-available/listen.dbp4.org  2> /dev/null
sudo rm /etc/nginx/sites-available/insecure  2> /dev/null
sudo tee -a /etc/nginx/sites-available/listen.dbp4.org << "END"
server {
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	server_name _;
	root /home/ubuntu/dbp_4_reader/build;

	ssl_protocols TLSv1.1 TLSv1.2;  #kurt removed TLSv1
	ssl_prefer_server_ciphers on;
	ssl_dhparam /etc/nginx/dhparams.pem;
	include snippets/snakeoil.conf;
	add_header X-Frame-Options "SAMEORIGIN";
	add_header X-XSS-Protection "1; mode=block";
	add_header X-Content-Type-Options "nosniff";

	# add_header Strict-Transport-Security "max-age=1; includeSubdomains; preload";

	index index.html;

	charset utf-8;

	location = /favicon.ico { access_log off; log_not_found off; }
	location = /robots.txt  { access_log off; log_not_found off; }

	location /sw.js {
		add_header Cache-Control "no-cache";
		proxy_cache_bypass $http_pragma;
		proxy_cache_revalidate on;
		expires off;
		access_log off;
	}

	access_log off;
	error_log  /var/log/nginx/dbp_4_reader-error.log error;

	error_page 404 /pages/_error.js;

	location / {
		proxy_pass http://localhost:3000;
	}

	location ~ /\.(?!well-known).* {
		deny all;
	}
}
END

sudo tee -a /etc/nginx/sites-available/insecure << "END"
server {
    listen        80 default_server;
    listen        [::]:80 default_server;
    server_name   _;
    error_log     /var/log/nginx/insecure.error.log;
    access_log    /var/log/nginx/insecure.access.log;
    root          /var/www/insecure;
    location  ~   /.well-known {
        allow     all;
    }
    # Server status
    location = /status {
        stub_status on;
        allow 127.0.0.1;
        deny all;
    }
    location  ~   / {
        return    301 https://$host$request_uri;
    }
}
END

sudo rm /etc/nginx/sites-enabled/listen.dbp4.org 2> /dev/null
sudo ln -s /etc/nginx/sites-available/listen.dbp4.org /etc/nginx/sites-enabled/listen.dbp4.org
sudo rm /etc/nginx/sites-enabled/default 2> /dev/null
sudo make-ssl-cert generate-default-snakeoil --force-overwrite
sudo openssl dhparam -out /etc/nginx/dhparams.pem 1024
sudo service nginx restart
sudo npm install -g pm2
