$TTL 604800
@   IN  SOA bongwebsite.com. admin.bongwebsite.com. (
             3         ; Serial
             604800    ; Refresh
             86400     ; Retry
             2419200   ; Expire
             604800 )  ; Negative Cache TTL

; Serveur de nom
@   IN  NS  ns1.bongwebsite.com.
ns1 IN  A   192.168.100.230

; Enregistrement A pour NGINX


bongwebsite.com.     IN  A   192.168.100.220
www                IN  A   192.168.100.230

