FROM node:20-slim
LABEL Author Daniel Ward www.djaw.uk
WORKDIR /
COPY . .
RUN npm install
ENTRYPOINT ["node","index.js"]
