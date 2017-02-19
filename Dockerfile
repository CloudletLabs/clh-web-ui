FROM nginx:1.11.10

RUN apt-get update -y &&\
 apt-get install -y git curl build-essential libssl-dev

RUN useradd -m nodejs -s /bin/bash
USER nodejs
WORKDIR /home/nodejs
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | sh

ENV CLH_WEB_UI_BUILD_DIR /home/nodejs/clh-web-ui
RUN mkdir -p $CLH_WEB_UI_BUILD_DIR
WORKDIR $CLH_WEB_UI_BUILD_DIR

COPY .nvmrc $CLH_WEB_UI_BUILD_DIR/
RUN bash -l -c "nvm install"
RUN bash -l -c "nvm use"

COPY bower.json $CLH_WEB_UI_BUILD_DIR/
COPY npm-shrinkwrap.json $CLH_WEB_UI_BUILD_DIR/
RUN bash -l -c "npm install"

COPY app $CLH_WEB_UI_BUILD_DIR/app/
COPY Gruntfile.js $CLH_WEB_UI_BUILD_DIR/
COPY package.json $CLH_WEB_UI_BUILD_DIR/
RUN bash -l -c "npm install && npm run grunt"

USER root
RUN cp -rf $CLH_WEB_UI_BUILD_DIR/build/. /usr/share/nginx/html
RUN chown -R -h www-data:www-data /usr/share/nginx/html

WORKDIR /etc/nginx