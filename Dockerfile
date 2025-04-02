# 使用多阶段构建减小镜像体积
FROM node:14.5.0-alpine

# 设置阿里云镜像源（覆盖所有可能的下载源）
RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set disturl https://npmmirror.com/dist && \
    yarn config set sass_binary_site https://npmmirror.com/mirrors/node-sass && \
    yarn config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs && \
    yarn config set electron_mirror https://npmmirror.com/mirrors/electron/

WORKDIR /app

# 先单独复制 package.json 和 yarn.lock（利用 Docker 缓存层）
COPY package.json yarn.lock ./

# 安装依赖（带重试机制）
RUN yarn install --frozen-lockfile || \
    (yarn cache clean && yarn install --frozen-lockfile)

# 复制其他文件
COPY . .

# 构建应用
RUN yarn build

EXPOSE 4000
CMD ["yarn", "start"]