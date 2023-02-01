FROM debian:bullseye as builder

ARG NODE_VERSION=16.15.1

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

#######################################################################

RUN mkdir /app
WORKDIR /app

# NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# to install all modules: "npm install --production=false".
# Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description

ENV NODE_ENV production

COPY . .

RUN npm install -g npm@9.4.0
RUN npm install http-errors
FROM debian:bullseye

RUN apt-get update; apt install -y curl wget sudo gnupg systemd gnupg2

RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

RUN echo "deb http://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN sudo apt-get update
RUN sudo apt-get install -y mongodb-org
# Comment after create user and password
RUN sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf

# Uncomment after create admin and password
# RUN rm -rf /etc/mongod.conf
# COPY mongod.conf /etc/mongod.conf

RUN echo "mongodb-org hold" | sudo dpkg --set-selections
RUN echo "mongodb-org-database hold" | sudo dpkg --set-selections
RUN echo "mongodb-org-server hold" | sudo dpkg --set-selections
RUN echo "mongodb-mongosh hold" | sudo dpkg --set-selections
RUN echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
RUN echo "mongodb-org-tools hold" | sudo dpkg --set-selections

ARG PORT 27017

EXPOSE 27017

ENTRYPOINT ["/usr/bin/mongod", "-f", "/etc/mongod.conf"]

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "npm", "run", "start" ]
