FROM node:16.13-bullseye AS runtime

WORKDIR /project

RUN npm install -g npm@8.9.0

################################################################################
FROM runtime AS dev

COPY package.json package-lock.json .
RUN npm install

ENV PATH="/project/node_modules/.bin:${PATH}"

ENTRYPOINT []
CMD ["bash"]

################################################################################
FROM runtime AS build

COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

################################################################################
FROM runtime AS production

COPY package.json package-lock.json .
RUN npm ci --production

COPY --from=build /project/build/dist /project/build/dist

ENTRYPOINT ["node", "/project/build/dist/bin.js"]
CMD []
