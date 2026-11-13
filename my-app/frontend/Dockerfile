FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && \
    if [ -d dist ]; then output=dist; \
    elif [ -d build ]; then output=build; \
    elif [ -d ../dist ]; then output=../dist; \
    else echo "No frontend build output found (expected dist, build, or ../dist)." >&2; exit 1; fi && \
    test -f "$output/index.html" && \
    mkdir -p /usr/src/app/public_html && \
    cp -R "$output"/. /usr/src/app/public_html/

FROM nginx:alpine
COPY --from=build /usr/src/app/public_html/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
