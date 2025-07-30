FROM node:20.11-alpine
# Install & build
WORKDIR /usr/src/app/
COPY . .

RUN yarn install

RUN yarn build

EXPOSE 3000

# Set the volume for the static app so that a proxy (NGiNX)
# can read files and serve them statically
# VOLUME /usr/src/app/build

ENTRYPOINT ["yarn", "start"]
