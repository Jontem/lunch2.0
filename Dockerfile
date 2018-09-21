FROM node:9.2
MAINTAINER jontem

WORKDIR /tmp
RUN mkdir /tmp/cache

ADD src /tmp/src
ADD tsconfig.json /tmp
ADD package.json /tmp
ADD package-lock.json /tmp

EXPOSE 8080

RUN npm install
ENTRYPOINT ["npm", "run", "start-prod"]