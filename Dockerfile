FROM node:16.13-bullseye AS base

WORKDIR /deployer

RUN npm install -g npm@8.1.3

################################################################################
FROM base AS dev

# This is a workaround for https://github.com/moby/moby/issues/2259
ARG DEV_USER_ID=10000
ARG DEV_GROUP_ID=10000
RUN groupadd --non-unique --gid ${DEV_GROUP_ID} dev && \
    useradd --non-unique --uid ${DEV_USER_ID} --gid dev dev && \
    install --directory --owner dev --group dev /home/dev /deployer
USER dev

COPY --chown=dev:dev package.json package-lock.json .
RUN npm install

ENV PATH="/deployer/node_modules/.bin:${PATH}"

ENTRYPOINT []
CMD ["bash"]

################################################################################
FROM base AS build

COPY package.json package-lock.json .
RUN npm install --production

COPY . .
RUN npm run build

################################################################################
FROM base AS production

COPY --from=build /deployer/build /deployer/build
COPY --from=build /deployer/node_modules /deployer/node_modules

ENTRYPOINT ["node", "build/index.js"]
CMD []
