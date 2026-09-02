FROM docker-hub.gitee.work/gitee-prod/nginx-skywalking:v1.0.4
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
ENV SKYWALKING_SERVER_URL "http://skywalking-oap.skywalking.svc.cluster.local:12800"
ENV DNS_SERVER kube-dns.kube-system.svc.cluster.local

COPY ./dist /usr/share/nginx/html





