FROM ubuntu:16.04
WORKDIR /app
COPY ./example-app/package.json /app/package.json
COPY ./example-app/package-lock.json /app/package-lock.json
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && ln -s /usr/bin/nodejs /usr/bin/node \
  && npm install \
  && apt-get -y remove nodejs npm
COPY ./example-app /app
ENTRYPOINT ["node", "index.js"]