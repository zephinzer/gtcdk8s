FROM alpine:3.7
RUN apk add --no-cache nodejs
WORKDIR /app
COPY ./example-app /app
RUN npm install
ENTRYPOINT ["node", "index.js"]