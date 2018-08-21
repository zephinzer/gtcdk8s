FROM alpine:3.8
WORKDIR /app
COPY ./example-app/package.json /app/package.json
COPY ./example-app/package-lock.json /app/package-lock.json
RUN apk add --no-cache nodejs python make g++ npm \
  && npm install \
  && apk del nodejs python make g++ npm
COPY ./example-app /app
ENTRYPOINT ["node", "index.js"]