FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Angular versions differ in whether the browser bundle is emitted at
# dist/<project>/browser or directly at dist/<project>. Normalize both forms.
RUN set -eux; \
    mkdir -p /app/site; \
    index_dir="$$(dirname "$$(find /app/dist -type f -name index.html -print -quit)")"; \
    test -n "$$index_dir"; \
    cp -a "$$index_dir/." /app/site/

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site/ /usr/share/nginx/html/
COPY docker-entrypoint-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh

RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
